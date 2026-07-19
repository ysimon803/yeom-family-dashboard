export interface FinancialTransaction {
  id?: string;
  transaction_id?: string;
  name?: string | null;
  merchant_name?: string | null;
  amount: number | string;
  date: string;
  category?: string | string[] | null;
  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;
  pending?: boolean;
}

export interface SpendingCategory {
  name: string;
  amount: number;
}

export type FinancialHealthStatus =
  | "strong"
  | "stable"
  | "attention";

export type FinancialInsightType =
  | "success"
  | "warning"
  | "info";

export interface FinancialInsight {
  id: string;
  type: FinancialInsightType;
  title: string;
  message: string;
}

export interface SpendingAnalysis {
  currentMonthSpending: number;
  previousMonthSpending: number;
  spendingChange: number | null;
  topCategory: SpendingCategory | null;
  estimatedSavings: number;
  transactionCount: number;
}

export interface FinancialAnalysisResult {
  spending: SpendingAnalysis;
  financialHealth: FinancialHealthStatus;
  insights: FinancialInsight[];
}

function normalizeCategoryName(category: string): string {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getTransactionCategory(
  transaction: FinancialTransaction,
): string {
  const personalFinanceCategory =
    transaction.personal_finance_category?.primary;

  if (personalFinanceCategory) {
    return normalizeCategoryName(
      personalFinanceCategory,
    );
  }

  if (Array.isArray(transaction.category)) {
    return transaction.category[0] ?? "Other";
  }

  if (
    typeof transaction.category === "string" &&
    transaction.category.trim().length > 0
  ) {
    return normalizeCategoryName(
      transaction.category,
    );
  }

  return "Other";
}

function getTransactionAmount(
  transaction: FinancialTransaction,
): number {
  const amount = Number(transaction.amount);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return amount;
}

function isSameMonth(
  date: Date,
  year: number,
  month: number,
): boolean {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month
  );
}

function calculateSpendingAnalysis(
  transactions: FinancialTransaction[],
): SpendingAnalysis {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const previousMonthDate = new Date(
    currentYear,
    currentMonth - 1,
    1,
  );

  const previousYear =
    previousMonthDate.getFullYear();

  const previousMonth =
    previousMonthDate.getMonth();

  let currentMonthSpending = 0;
  let previousMonthSpending = 0;
  let transactionCount = 0;

  const categoryTotals = new Map<
    string,
    number
  >();

  transactions.forEach((transaction) => {
    if (transaction.pending) {
      return;
    }

    const transactionDate = new Date(
      `${transaction.date}T12:00:00`,
    );

    if (
      Number.isNaN(transactionDate.getTime())
    ) {
      return;
    }

    const amount =
      getTransactionAmount(transaction);

    /*
     * Plaid expenses are generally positive.
     * Income, refunds, and credits are generally negative.
     */
    if (amount <= 0) {
      return;
    }

    if (
      isSameMonth(
        transactionDate,
        currentYear,
        currentMonth,
      )
    ) {
      currentMonthSpending += amount;
      transactionCount += 1;

      const category =
        getTransactionCategory(transaction);

      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) +
          amount,
      );
    }

    if (
      isSameMonth(
        transactionDate,
        previousYear,
        previousMonth,
      )
    ) {
      previousMonthSpending += amount;
    }
  });

  const topCategory = Array.from(
    categoryTotals.entries(),
  ).reduce<SpendingCategory | null>(
    (largestCategory, [name, amount]) => {
      if (
        largestCategory === null ||
        amount > largestCategory.amount
      ) {
        return {
          name,
          amount,
        };
      }

      return largestCategory;
    },
    null,
  );

  const spendingChange =
    previousMonthSpending > 0
      ? ((currentMonthSpending -
          previousMonthSpending) /
          previousMonthSpending) *
        100
      : null;

  const estimatedSavings = topCategory
    ? topCategory.amount * 0.1
    : 0;

  return {
    currentMonthSpending,
    previousMonthSpending,
    spendingChange,
    topCategory,
    estimatedSavings,
    transactionCount,
  };
}

function getFinancialHealth(
  spending: SpendingAnalysis,
): FinancialHealthStatus {
  const change = spending.spendingChange;

  if (
    change !== null &&
    change <= -10 &&
    spending.currentMonthSpending > 0
  ) {
    return "strong";
  }

  if (
    change === null ||
    change <= 10
  ) {
    return "stable";
  }

  return "attention";
}

function generateSpendingInsights(
  spending: SpendingAnalysis,
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  if (spending.currentMonthSpending === 0) {
    insights.push({
      id: "no-current-month-spending",
      type: "info",
      title: "Limited Current Data",
      message:
        "No completed expenses were found for the current month.",
    });

    return insights;
  }

  if (spending.spendingChange === null) {
    insights.push({
      id: "insufficient-history",
      type: "info",
      title: "More History Needed",
      message:
        "There is not enough previous-month transaction data to calculate a reliable spending trend.",
    });
  } else if (spending.spendingChange > 10) {
    insights.push({
      id: "spending-increase",
      type: "warning",
      title: "Spending Increased",
      message: `Your spending is ${Math.abs(
        spending.spendingChange,
      ).toFixed(
        1,
      )}% higher than last month.`,
    });
  } else if (spending.spendingChange < -10) {
    insights.push({
      id: "spending-decrease",
      type: "success",
      title: "Spending Improved",
      message: `Your spending is ${Math.abs(
        spending.spendingChange,
      ).toFixed(
        1,
      )}% lower than last month.`,
    });
  } else {
    insights.push({
      id: "spending-stable",
      type: "info",
      title: "Spending Stable",
      message:
        "Your spending is relatively consistent with last month.",
    });
  }

  if (spending.topCategory) {
    insights.push({
      id: "top-category",
      type: "info",
      title: "Largest Spending Category",
      message: `${spending.topCategory.name} is your largest spending category this month at approximately $${Math.round(
        spending.topCategory.amount,
      ).toLocaleString("en-US")}.`,
    });

    insights.push({
      id: "savings-opportunity",
      type: "success",
      title: "Savings Opportunity",
      message: `Reducing ${spending.topCategory.name} spending by 10% could save approximately $${Math.round(
        spending.estimatedSavings,
      ).toLocaleString(
        "en-US",
      )} per month.`,
    });
  }

  return insights;
}

export function analyzeFinancialData(
  transactions: FinancialTransaction[],
): FinancialAnalysisResult {
  const spending =
    calculateSpendingAnalysis(transactions);

  return {
    spending,
    financialHealth:
      getFinancialHealth(spending),
    insights:
      generateSpendingInsights(spending),
  };
}