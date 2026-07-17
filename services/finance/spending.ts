import type { Transaction } from "@/services/api/transactions";

export interface SpendingCategory {
  category: string;
  amount: number;
  transactionCount: number;
}

interface FlexibleTransaction extends Transaction {
  category?: string | string[] | null;

  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  personalFinanceCategory?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  pending?: boolean | null;
}

function formatCategoryName(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getTransactionCategory(
  transaction: FlexibleTransaction
): string {
  const personalFinanceCategory =
    transaction.personal_finance_category ??
    transaction.personalFinanceCategory;

  if (personalFinanceCategory?.primary) {
    return formatCategoryName(
      personalFinanceCategory.primary
    );
  }

  if (Array.isArray(transaction.category)) {
    const category =
      transaction.category[0] ??
      transaction.category[1];

    return category
      ? formatCategoryName(category)
      : "Other";
  }

  if (
    typeof transaction.category === "string" &&
    transaction.category.trim()
  ) {
    return formatCategoryName(transaction.category);
  }

  return "Other";
}

function getDateDaysAgo(days: number): Date {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

export function calculateSpendingByCategory(
  transactions: Transaction[],
  days = 30,
  categoryLimit = 8
): SpendingCategory[] {
  const startDate = getDateDaysAgo(days);

  const totals = new Map<
    string,
    {
      amount: number;
      transactionCount: number;
    }
  >();

  for (const originalTransaction of transactions) {
    const transaction =
      originalTransaction as FlexibleTransaction;

    const transactionDate = new Date(transaction.date);

    if (Number.isNaN(transactionDate.getTime())) {
      continue;
    }

    if (transactionDate < startDate) {
      continue;
    }

    if (transaction.pending) {
      continue;
    }

    /*
      Plaid 규칙:
      양수 금액 = 일반적으로 지출
      음수 금액 = 일반적으로 입금 또는 환불
    */
    if (transaction.amount <= 0) {
      continue;
    }

    const category = getTransactionCategory(transaction);
    const existing = totals.get(category);

    totals.set(category, {
      amount:
        (existing?.amount ?? 0) +
        Number(transaction.amount),
      transactionCount:
        (existing?.transactionCount ?? 0) + 1,
    });
  }

  return Array.from(totals.entries())
    .map(([category, data]) => ({
      category,
      amount: Number(data.amount.toFixed(2)),
      transactionCount: data.transactionCount,
    }))
    .sort((first, second) => second.amount - first.amount)
    .slice(0, categoryLimit);
}

export function calculateTotalSpending(
  categories: SpendingCategory[]
): number {
  return categories.reduce(
    (total, category) => total + category.amount,
    0
  );
}