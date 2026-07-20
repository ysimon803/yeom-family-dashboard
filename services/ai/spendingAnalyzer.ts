export type SpendingInsightType =
  | "positive"
  | "warning"
  | "critical"
  | "neutral";

export interface SpendingCategoryData {
  category: string;
  currentAmount: number;
  previousAmount?: number;
  budgetAmount?: number;
}

export interface SpendingAnalyzerInput {
  categories: SpendingCategoryData[];
  monthlyIncome: number;
  totalSpending: number;
  previousTotalSpending?: number;
}

export interface SpendingInsight {
  id: string;
  type: SpendingInsightType;
  title: string;
  description: string;
  category?: string;
  percentageChange?: number;
  amount?: number;
}

export interface SpendingAnalysisResult {
  totalSpending: number;
  previousTotalSpending: number;
  spendingChangePercentage: number;
  savingsAmount: number;
  savingsRate: number;
  highestSpendingCategory: SpendingCategoryData | null;
  overBudgetCategories: SpendingCategoryData[];
  insights: SpendingInsight[];
}

function toSafeNumber(value: number | undefined): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function calculatePercentageChange(
  currentAmount: number,
  previousAmount: number
): number {
  if (previousAmount <= 0) {
    return currentAmount > 0 ? 100 : 0;
  }

  return ((currentAmount - previousAmount) / previousAmount) * 100;
}

function createInsightId(
  prefix: string,
  category?: string
): string {
  const normalizedCategory = category
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedCategory
    ? `${prefix}-${normalizedCategory}`
    : prefix;
}

export function analyzeSpending(
  input: SpendingAnalyzerInput
): SpendingAnalysisResult {
  const monthlyIncome = Math.max(
    0,
    toSafeNumber(input.monthlyIncome)
  );

  const totalSpending = Math.max(
    0,
    toSafeNumber(input.totalSpending)
  );

  const previousTotalSpending = Math.max(
    0,
    toSafeNumber(input.previousTotalSpending)
  );

  const normalizedCategories = input.categories
    .map((category) => ({
      category: category.category || "Other",
      currentAmount: Math.max(
        0,
        toSafeNumber(category.currentAmount)
      ),
      previousAmount: Math.max(
        0,
        toSafeNumber(category.previousAmount)
      ),
      budgetAmount: Math.max(
        0,
        toSafeNumber(category.budgetAmount)
      ),
    }))
    .sort(
      (firstCategory, secondCategory) =>
        secondCategory.currentAmount -
        firstCategory.currentAmount
    );

  const savingsAmount = monthlyIncome - totalSpending;

  const savingsRate =
    monthlyIncome > 0
      ? (savingsAmount / monthlyIncome) * 100
      : 0;

  const spendingChangePercentage =
    calculatePercentageChange(
      totalSpending,
      previousTotalSpending
    );

  const highestSpendingCategory =
    normalizedCategories[0] ?? null;

  const overBudgetCategories =
    normalizedCategories.filter(
      (category) =>
        category.budgetAmount > 0 &&
        category.currentAmount > category.budgetAmount
    );

  const insights: SpendingInsight[] = [];

  if (previousTotalSpending > 0) {
    if (spendingChangePercentage >= 10) {
      insights.push({
        id: "total-spending-increased",
        type: "warning",
        title: "Monthly spending increased",
        description: `Total spending increased ${Math.abs(
          spendingChangePercentage
        ).toFixed(1)}% compared with the previous month.`,
        percentageChange: spendingChangePercentage,
        amount: totalSpending,
      });
    } else if (spendingChangePercentage <= -10) {
      insights.push({
        id: "total-spending-decreased",
        type: "positive",
        title: "Monthly spending decreased",
        description: `Total spending decreased ${Math.abs(
          spendingChangePercentage
        ).toFixed(1)}% compared with the previous month.`,
        percentageChange: spendingChangePercentage,
        amount: totalSpending,
      });
    } else {
      insights.push({
        id: "total-spending-stable",
        type: "neutral",
        title: "Monthly spending is stable",
        description: `Total spending changed ${Math.abs(
          spendingChangePercentage
        ).toFixed(1)}% compared with the previous month.`,
        percentageChange: spendingChangePercentage,
        amount: totalSpending,
      });
    }
  }

  normalizedCategories.forEach((category) => {
    const previousAmount =
      category.previousAmount ?? 0;

    if (previousAmount <= 0) {
      return;
    }

    const percentageChange =
      calculatePercentageChange(
        category.currentAmount,
        previousAmount
      );

    if (percentageChange >= 15) {
      insights.push({
        id: createInsightId(
          "category-increased",
          category.category
        ),
        type: "warning",
        title: `${category.category} spending increased`,
        description: `${category.category} spending increased ${percentageChange.toFixed(
          1
        )}% compared with the previous month.`,
        category: category.category,
        percentageChange,
        amount: category.currentAmount,
      });
    } else if (percentageChange <= -15) {
      insights.push({
        id: createInsightId(
          "category-decreased",
          category.category
        ),
        type: "positive",
        title: `${category.category} spending decreased`,
        description: `${category.category} spending decreased ${Math.abs(
          percentageChange
        ).toFixed(1)}% compared with the previous month.`,
        category: category.category,
        percentageChange,
        amount: category.currentAmount,
      });
    }
  });

  overBudgetCategories.forEach((category) => {
    const budgetAmount = category.budgetAmount ?? 0;
    const amountOverBudget =
      category.currentAmount - budgetAmount;

    const percentageOverBudget =
      budgetAmount > 0
        ? (amountOverBudget / budgetAmount) * 100
        : 0;

    insights.push({
      id: createInsightId(
        "category-over-budget",
        category.category
      ),
      type:
        percentageOverBudget >= 25
          ? "critical"
          : "warning",
      title: `${category.category} exceeded budget`,
      description: `${category.category} is $${amountOverBudget.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )} over budget.`,
      category: category.category,
      percentageChange: percentageOverBudget,
      amount: amountOverBudget,
    });
  });

  if (savingsRate >= 30) {
    insights.push({
      id: "savings-rate-excellent",
      type: "positive",
      title: "Excellent savings rate",
      description: `Your estimated savings rate is ${savingsRate.toFixed(
        1
      )}%.`,
      percentageChange: savingsRate,
      amount: savingsAmount,
    });
  } else if (savingsRate >= 20) {
    insights.push({
      id: "savings-rate-strong",
      type: "positive",
      title: "Strong savings rate",
      description: `Your estimated savings rate is ${savingsRate.toFixed(
        1
      )}%.`,
      percentageChange: savingsRate,
      amount: savingsAmount,
    });
  } else if (savingsRate >= 10) {
    insights.push({
      id: "savings-rate-moderate",
      type: "neutral",
      title: "Savings rate can improve",
      description: `Your estimated savings rate is ${savingsRate.toFixed(
        1
      )}%. Consider targeting at least 20%.`,
      percentageChange: savingsRate,
      amount: savingsAmount,
    });
  } else {
    insights.push({
      id: "savings-rate-low",
      type: savingsRate < 0 ? "critical" : "warning",
      title:
        savingsRate < 0
          ? "Spending exceeds income"
          : "Low savings rate",
      description:
        savingsRate < 0
          ? `Monthly spending exceeds income by $${Math.abs(
              savingsAmount
            ).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}.`
          : `Your estimated savings rate is ${savingsRate.toFixed(
              1
            )}%.`,
      percentageChange: savingsRate,
      amount: savingsAmount,
    });
  }

  if (highestSpendingCategory) {
    insights.push({
      id: createInsightId(
        "highest-spending-category",
        highestSpendingCategory.category
      ),
      type: "neutral",
      title: `${highestSpendingCategory.category} is the largest category`,
      description: `$${highestSpendingCategory.currentAmount.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )} was spent in ${highestSpendingCategory.category}.`,
      category: highestSpendingCategory.category,
      amount: highestSpendingCategory.currentAmount,
    });
  }

  const priorityOrder: Record<
    SpendingInsightType,
    number
  > = {
    critical: 0,
    warning: 1,
    positive: 2,
    neutral: 3,
  };

  insights.sort(
    (firstInsight, secondInsight) =>
      priorityOrder[firstInsight.type] -
      priorityOrder[secondInsight.type]
  );

  return {
    totalSpending,
    previousTotalSpending,
    spendingChangePercentage,
    savingsAmount,
    savingsRate,
    highestSpendingCategory,
    overBudgetCategories,
    insights,
  };
}