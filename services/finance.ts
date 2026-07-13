export type FinancialProfile = {
  home_value: number;
  mortgage: number;
  cash: number;
  monthly_income: number;
};

export type Investment = {
  ticker: string;
  balance: number;
};

export function calculateInvestmentTotal(
  investments: Investment[]
) {
  return investments.reduce(
    (sum, item) => sum + Number(item.balance),
    0
  );
}

export function calculateAssets(
  profile: FinancialProfile,
  investments: Investment[]
) {
  return (
    profile.home_value +
    profile.cash +
    calculateInvestmentTotal(investments)
  );
}

export function calculateNetWorth(
  profile: FinancialProfile,
  investments: Investment[]
) {
  return (
    calculateAssets(profile, investments) -
    profile.mortgage
  );
}

export function calculateSavingsRate(
  monthlyIncome: number,
  mortgage: number
) {
  if (monthlyIncome <= 0) return 0;

  const savings = monthlyIncome - mortgage;

  return Math.round(
    (savings / monthlyIncome) * 100
  );
}

export function calculateGoalProgress(
  current: number,
  target: number
) {
  if (target <= 0) return 0;

  return Math.min(
    Math.round((current / target) * 100),
    100
  );
}

export function calculateAllocation(
  investments: Investment[]
) {
  const total =
    calculateInvestmentTotal(investments);

  if (total === 0) return [];

  const grouped: Record<string, number> = {};

  investments.forEach((item) => {
    grouped[item.ticker] =
      (grouped[item.ticker] || 0) +
      Number(item.balance);
  });

  return Object.entries(grouped).map(
    ([ticker, value]) => ({
      ticker,
      balance: value,
      percent: Math.round(
        (value / total) * 100
      ),
    })
  );
}