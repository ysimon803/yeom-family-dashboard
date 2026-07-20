import type {
  SpendingAnalyzerInput,
  SpendingCategoryData,
} from "@/services/ai/spendingAnalyzer";
import { normalizeSpendingCategory } from "@/services/ai/spendingCategoryNormalizer";

export interface SpendingTransaction {
  id?: string;
  amount: number | string;
  date: string;
  name?: string | null;
  merchant_name?: string | null;
  category?: string | null;
  primary_category?: string | null;
  detailed_category?: string | null;
  transaction_type?: string | null;
  pending?: boolean | null;
}

export interface SpendingBudget {
  category: string;
  amount: number;
}

export interface SpendingDataAdapterOptions {
  transactions: SpendingTransaction[];
  monthlyIncome: number;
  budgets?: SpendingBudget[];
  referenceDate?: Date;
}

interface MonthRange {
  start: Date;
  end: Date;
}

const EXCLUDED_CATEGORIES = [
  "transfer",
  "transfers",
  "credit card payment",
  "loan payment",
  "investment",
  "investments",
];

const INCOME_CATEGORIES = [
  "income",
  "payroll",
  "deposit",
  "deposits",
  "interest earned",
];

function toSafeNumber(
  value: number | string | null | undefined,
): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function normalizeText(
  value: string | null | undefined,
): string {
  return value?.trim().toLowerCase() ?? "";
}

function getTransactionCategory(
  transaction: SpendingTransaction,
): string {
  return normalizeSpendingCategory(
    transaction.primary_category,
    transaction.category,
    transaction.detailed_category,
    transaction.name,
    transaction.merchant_name,
  );
}

function isExcludedCategory(
  category: string,
): boolean {
  const normalizedCategory =
    normalizeText(category);

  return EXCLUDED_CATEGORIES.some(
    (excludedCategory) =>
      normalizedCategory.includes(
        excludedCategory,
      ),
  );
}

function isIncomeCategory(
  category: string,
): boolean {
  const normalizedCategory =
    normalizeText(category);

  return INCOME_CATEGORIES.some(
    (incomeCategory) =>
      normalizedCategory.includes(
        incomeCategory,
      ),
  );
}

function isIncomeTransaction(
  transaction: SpendingTransaction,
  category: string,
): boolean {
  const transactionType = normalizeText(
    transaction.transaction_type,
  );

  if (
    transactionType === "income" ||
    transactionType === "credit"
  ) {
    return true;
  }

  return isIncomeCategory(category);
}

function isExpenseTransaction(
  transaction: SpendingTransaction,
): boolean {
  if (transaction.pending) {
    return false;
  }

  const amount = toSafeNumber(
    transaction.amount,
  );

  if (amount === 0) {
    return false;
  }

  const rawCategory = [
    transaction.primary_category,
    transaction.category,
    transaction.detailed_category,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

  if (isExcludedCategory(rawCategory)) {
    return false;
  }

  if (
    isIncomeTransaction(
      transaction,
      rawCategory,
    )
  ) {
    return false;
  }

  /*
   * Plaid 기본 형태:
   * 양수 = 계좌에서 나간 돈
   * 음수 = 계좌로 들어온 돈
   *
   * Supabase에서 expense/debit 타입을
   * 별도로 저장한 경우에는 타입을 우선합니다.
   */
  const transactionType = normalizeText(
    transaction.transaction_type,
  );

  if (
    transactionType === "expense" ||
    transactionType === "debit"
  ) {
    return true;
  }

  return amount > 0;
}

function getExpenseAmount(
  transaction: SpendingTransaction,
): number {
  return Math.abs(
    toSafeNumber(transaction.amount),
  );
}

function createMonthRange(
  date: Date,
  monthOffset = 0,
): MonthRange {
  const year = date.getFullYear();
  const month =
    date.getMonth() + monthOffset;

  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  };
}

function parseTransactionDate(
  dateValue: string,
): Date | null {
  const normalizedDate =
    dateValue.trim();

  if (!normalizedDate) {
    return null;
  }

  const dateOnlyPattern =
    /^\d{4}-\d{2}-\d{2}$/;

  const transactionDate =
    dateOnlyPattern.test(normalizedDate)
      ? new Date(
          `${normalizedDate}T00:00:00`,
        )
      : new Date(normalizedDate);

  if (
    Number.isNaN(
      transactionDate.getTime(),
    )
  ) {
    return null;
  }

  return transactionDate;
}

export function getLatestTransactionDate(
  transactions: SpendingTransaction[],
): Date | null {
  let latestDate: Date | null = null;

  transactions.forEach((transaction) => {
    const transactionDate =
      parseTransactionDate(
        transaction.date,
      );

    if (!transactionDate) {
      return;
    }

    if (
      !latestDate ||
      transactionDate.getTime() >
        latestDate.getTime()
    ) {
      latestDate = transactionDate;
    }
  });

  return latestDate;
}

function isDateInRange(
  dateValue: string,
  range: MonthRange,
): boolean {
  const transactionDate =
    parseTransactionDate(dateValue);

  if (!transactionDate) {
    return false;
  }

  return (
    transactionDate >= range.start &&
    transactionDate < range.end
  );
}

function groupSpendingByCategory(
  transactions: SpendingTransaction[],
): Map<string, number> {
  const categoryTotals =
    new Map<string, number>();

  transactions.forEach((transaction) => {
    const category =
      getTransactionCategory(transaction);

    const amount =
      getExpenseAmount(transaction);

    categoryTotals.set(
      category,
      (categoryTotals.get(category) ??
        0) + amount,
    );
  });

  return categoryTotals;
}

function removeDuplicateTransactions(
  transactions: SpendingTransaction[],
): SpendingTransaction[] {
  const seenTransactionKeys =
    new Set<string>();

  return transactions.filter(
    (transaction) => {
      const amount = toSafeNumber(
        transaction.amount,
      );

      const key = transaction.id
        ? `id:${transaction.id}`
        : [
            transaction.date,
            normalizeText(
              transaction.name,
            ),
            normalizeText(
              transaction.merchant_name,
            ),
            amount.toFixed(2),
          ].join("|");

      if (
        seenTransactionKeys.has(key)
      ) {
        return false;
      }

      seenTransactionKeys.add(key);

      return true;
    },
  );
}

function getBudgetMap(
  budgets: SpendingBudget[],
): Map<string, number> {
  const budgetMap =
    new Map<string, number>();

  budgets.forEach((budget) => {
    const normalizedCategory =
      normalizeSpendingCategory(
        budget.category,
      );

    const amount = Math.max(
      0,
      toSafeNumber(budget.amount),
    );

    budgetMap.set(
      normalizedCategory,
      (budgetMap.get(
        normalizedCategory,
      ) ?? 0) + amount,
    );
  });

  return budgetMap;
}

function calculateTotalSpending(
  transactions: SpendingTransaction[],
): number {
  return transactions.reduce(
    (total, transaction) =>
      total +
      getExpenseAmount(transaction),
    0,
  );
}

export function createSpendingAnalyzerInput({
  transactions,
  monthlyIncome,
  budgets = [],
  referenceDate = new Date(),
}: SpendingDataAdapterOptions): SpendingAnalyzerInput {
  const currentMonthRange =
    createMonthRange(referenceDate);

  const previousMonthRange =
    createMonthRange(referenceDate, -1);

  const uniqueTransactions =
    removeDuplicateTransactions(
      transactions,
    );

  const expenseTransactions =
    uniqueTransactions.filter(
      isExpenseTransaction,
    );

  const currentMonthTransactions =
    expenseTransactions.filter(
      (transaction) =>
        isDateInRange(
          transaction.date,
          currentMonthRange,
        ),
    );

  const previousMonthTransactions =
    expenseTransactions.filter(
      (transaction) =>
        isDateInRange(
          transaction.date,
          previousMonthRange,
        ),
    );

  const currentCategoryTotals =
    groupSpendingByCategory(
      currentMonthTransactions,
    );

  const previousCategoryTotals =
    groupSpendingByCategory(
      previousMonthTransactions,
    );

  const budgetMap =
    getBudgetMap(budgets);

  const allCategories = new Set([
    ...currentCategoryTotals.keys(),
    ...previousCategoryTotals.keys(),
    ...budgetMap.keys(),
  ]);

  const categories: SpendingCategoryData[] =
    Array.from(allCategories)
      .map((category) => ({
        category,
        currentAmount:
          currentCategoryTotals.get(
            category,
          ) ?? 0,
        previousAmount:
          previousCategoryTotals.get(
            category,
          ) ?? 0,
        budgetAmount:
          budgetMap.get(category) ?? 0,
      }))
      .filter(
        (category) =>
          category.currentAmount > 0 ||
          category.previousAmount > 0 ||
          category.budgetAmount > 0,
      )
      .sort(
        (
          firstCategory,
          secondCategory,
        ) =>
          secondCategory.currentAmount -
          firstCategory.currentAmount,
      );

  return {
    categories,
    monthlyIncome: Math.max(
      0,
      toSafeNumber(monthlyIncome),
    ),
    totalSpending:
      calculateTotalSpending(
        currentMonthTransactions,
      ),
    previousTotalSpending:
      calculateTotalSpending(
        previousMonthTransactions,
      ),
  };
}