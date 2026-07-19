export interface ForecastInput {
  currentNetWorth: number;
  monthlySavings: number;
  expectedAnnualReturn: number; // %
  months: number;
}

export interface ForecastPoint {
  month: number;
  netWorth: number;
}

export interface ForecastResult {
  points: ForecastPoint[];
  projectedNetWorth: number;
  totalContributions: number;
  investmentGrowth: number;
}

export function calculateForecast(
  input: ForecastInput,
): ForecastResult {
  const monthlyRate =
    input.expectedAnnualReturn / 100 / 12;

  let current = input.currentNetWorth;

  const points: ForecastPoint[] = [];

  let totalContributions = 0;

  for (
    let month = 1;
    month <= input.months;
    month++
  ) {
    current =
      current * (1 + monthlyRate) +
      input.monthlySavings;

    totalContributions +=
      input.monthlySavings;

    points.push({
      month,
      netWorth: current,
    });
  }

  return {
    points,
    projectedNetWorth: current,
    totalContributions,
    investmentGrowth:
      current -
      input.currentNetWorth -
      totalContributions,
  };
}