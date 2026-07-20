export interface FinancialHealthInput {
  netWorth: number;
  assets: number;
  liabilities: number;
  monthlyIncome: number;
  monthlySpending: number;
  savingsRate: number;
}

export interface FinancialHealthResult {
  score: number;
  grade:
    | "Excellent"
    | "Good"
    | "Fair"
    | "Needs Attention";
  breakdown: {
    savings: number;
    debt: number;
    cashFlow: number;
    netWorth: number;
  };
}

export function calculateFinancialHealth(
  input: FinancialHealthInput
): FinancialHealthResult {
  let savings = 0;
  let debt = 0;
  let cashFlow = 0;
  let netWorth = 0;

  // Savings (30)
  if (input.savingsRate >= 25) {
    savings = 30;
  } else if (input.savingsRate >= 15) {
    savings = 22;
  } else if (input.savingsRate >= 10) {
    savings = 15;
  } else {
    savings = 5;
  }

  // Debt (25)
  const debtRatio =
    input.assets <= 0
      ? 1
      : input.liabilities / input.assets;

  if (debtRatio < 0.20) {
    debt = 25;
  } else if (debtRatio < 0.40) {
    debt = 20;
  } else if (debtRatio < 0.60) {
    debt = 12;
  } else {
    debt = 5;
  }

  // Cash Flow (20)
  const monthlySavings =
    input.monthlyIncome -
    input.monthlySpending;

  if (monthlySavings > 2000) {
    cashFlow = 20;
  } else if (monthlySavings > 1000) {
    cashFlow = 16;
  } else if (monthlySavings > 0) {
    cashFlow = 10;
  } else {
    cashFlow = 0;
  }

  // Net Worth (25)
  if (input.netWorth >= 500000) {
    netWorth = 25;
  } else if (input.netWorth >= 250000) {
    netWorth = 20;
  } else if (input.netWorth >= 100000) {
    netWorth = 15;
  } else {
    netWorth = 5;
  }

  const score =
    savings +
    debt +
    cashFlow +
    netWorth;

  let grade: FinancialHealthResult["grade"];

  if (score >= 90) {
    grade = "Excellent";
  } else if (score >= 75) {
    grade = "Good";
  } else if (score >= 60) {
    grade = "Fair";
  } else {
    grade = "Needs Attention";
  }

  return {
    score,
    grade,
    breakdown: {
      savings,
      debt,
      cashFlow,
      netWorth,
    },
  };
}