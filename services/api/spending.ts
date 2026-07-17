import { getTransactions } from "@/services/transactions/getTransactions";

export interface SpendingCategoryItem {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingCategorySummary {
  totalSpending: number;
  transactionCount: number;
  categories: SpendingCategoryItem[];
  periodStart: string;
  periodEnd: string;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getStringField(
  record: UnknownRecord,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function getNumberField(
  record: UnknownRecord,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function getTransactionDate(record: UnknownRecord): Date | null {
  const dateValue = getStringField(record, [
    "transaction_date",
    "transactionDate",
    "date",
    "posted_date",
    "postedDate",
    "created_at",
    "createdAt",
  ]);

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getCategory(record: UnknownRecord): string {
  return (
    getStringField(record, [
      "category",
      "primary_category",
      "primaryCategory",
      "merchant_category",
      "merchantCategory",
    ]) ?? "Uncategorized"
  );
}

function isExpenseTransaction(
  record: UnknownRecord,
  amount: number
): boolean {
  const transactionType = getStringField(record, [
    "type",
    "transaction_type",
    "transactionType",
  ])?.toLowerCase();

  if (
    transactionType === "income" ||
    transactionType === "credit" ||
    transactionType === "deposit"
  ) {
    return false;
  }

  if (
    transactionType === "expense" ||
    transactionType === "debit" ||
    transactionType === "purchase"
  ) {
    return true;
  }

  /*
   * WealthOS 데이터가:
   * - 지출을 양수로 저장하면 amount > 0
   * - 지출을 음수로 저장하면 amount < 0
   *
   * 명시적인 type이 없는 경우 0이 아닌 거래를 지출 후보로 처리합니다.
   */
  return amount !== 0;
}

function getExpenseAmount(
  record: UnknownRecord
): number | null {
  const rawAmount = getNumberField(record, [
    "amount",
    "transaction_amount",
    "transactionAmount",
    "value",
  ]);

  if (
    rawAmount === undefined ||
    rawAmount === 0 ||
    !isExpenseTransaction(record, rawAmount)
  ) {
    return null;
  }

  return Math.abs(rawAmount);
}

function formatDateForComparison(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getSpendingCategorySummary(
  days = 30
): Promise<SpendingCategorySummary> {
  const transactions = await getTransactions();

  const periodEndDate = new Date();
  periodEndDate.setHours(23, 59, 59, 999);

  const periodStartDate = new Date(periodEndDate);
  periodStartDate.setDate(periodStartDate.getDate() - (days - 1));
  periodStartDate.setHours(0, 0, 0, 0);

  const categoryMap = new Map<
    string,
    {
      amount: number;
      transactionCount: number;
    }
  >();

  let transactionCount = 0;

  for (const transaction of transactions) {
    if (!isRecord(transaction)) {
      continue;
    }

    const transactionDate = getTransactionDate(transaction);

    if (
      transactionDate &&
      (transactionDate < periodStartDate ||
        transactionDate > periodEndDate)
    ) {
      continue;
    }

    const expenseAmount = getExpenseAmount(transaction);

    if (expenseAmount === null) {
      continue;
    }

    const category = getCategory(transaction);
    const existingCategory = categoryMap.get(category);

    categoryMap.set(category, {
      amount: (existingCategory?.amount ?? 0) + expenseAmount,
      transactionCount:
        (existingCategory?.transactionCount ?? 0) + 1,
    });

    transactionCount += 1;
  }

  const totalSpending = Array.from(categoryMap.values()).reduce(
    (total, category) => total + category.amount,
    0
  );

  const categories: SpendingCategoryItem[] = Array.from(
    categoryMap.entries()
  )
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      transactionCount: data.transactionCount,
      percentage:
        totalSpending > 0
          ? (data.amount / totalSpending) * 100
          : 0,
    }))
    .sort((first, second) => second.amount - first.amount);

  return {
    totalSpending,
    transactionCount,
    categories,
    periodStart: formatDateForComparison(periodStartDate),
    periodEnd: formatDateForComparison(periodEndDate),
  };
}