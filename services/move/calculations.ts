export function calculateCurrentNetWorth(
  homeValue: number,
  mortgage: number,
  cash: number,
  investments: number
) {
  return (
    homeValue -
    mortgage +
    cash +
    investments
  );
}

export function calculateFutureHomeValue(
  homeValue: number,
  annualGrowth = 3,
  years = 2
) {
  return (
    homeValue *
    Math.pow(
      1 + annualGrowth / 100,
      years
    )
  );
}

export function calculateHomeSaleProceeds(
  futureHomeValue: number,
  mortgage: number,
  sellingCostPercent = 6
) {
  return (
    futureHomeValue -
    futureHomeValue *
      (sellingCostPercent / 100) -
    mortgage
  );
}