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

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getSpendingCategorySummary(
  days = 30
): Promise<SpendingCategorySummary> {
  const transactions = await getTransactions();

  const periodEndDate = new Date();
  periodEndDate.setHours(23, 59, 59, 999);

  const periodStartDate = new Date(periodEndDate);
  periodStartDate.setDate(
    periodStartDate.getDate() - (days - 1)
  );
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
    const transactionDate = new Date(
      `${transaction.date}T12:00:00`
    );

    if (Number.isNaN(transactionDate.getTime())) {
      continue;
    }

    if (
      transactionDate < periodStartDate ||
      transactionDate > periodEndDate
    ) {
      continue;
    }

    if (transaction.type !== "expense") {
      continue;
    }

    if (
      !Number.isFinite(transaction.amount) ||
      transaction.amount <= 0
    ) {
      continue;
    }

    const normalizedCategory =
      transaction.category.trim() ||
      "Uncategorized";

    const existingCategory =
      categoryMap.get(normalizedCategory);

    categoryMap.set(normalizedCategory, {
      amount:
        (existingCategory?.amount ?? 0) +
        transaction.amount,
      transactionCount:
        (existingCategory?.transactionCount ?? 0) + 1,
    });

    transactionCount += 1;
  }

  const totalSpending = Array.from(
    categoryMap.values()
  ).reduce(
    (total, category) =>
      total + category.amount,
    0
  );

  const categories: SpendingCategoryItem[] =
    Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        transactionCount:
          data.transactionCount,
        percentage:
          totalSpending > 0
            ? (data.amount / totalSpending) * 100
            : 0,
      }))
      .sort(
        (first, second) =>
          second.amount - first.amount
      );

  return {
    totalSpending,
    transactionCount,
    categories,
    periodStart: formatDate(periodStartDate),
    periodEnd: formatDate(periodEndDate),
  };
}