import { calculateAllocation } from "./finance";

export function buildAdvice(
  investments: any[],
  cash: number,
  targetDownPayment: number
) {
  const allocation =
    calculateAllocation(investments);

  const advice: string[] = [];

  if (allocation.length > 0) {
    const largest = allocation.reduce((a, b) =>
      a.balance > b.balance ? a : b
    );

    if (largest.percent > 70) {
      advice.push(
        `${largest.ticker} accounts for ${largest.percent.toFixed(
          1
        )}% of your portfolio. Consider improving diversification.`
      );
    }
  }

  if (cash < targetDownPayment * 0.25) {
    advice.push(
      "Cash reserves are below 25% of your target down payment."
    );
  }

  if (advice.length === 0) {
    advice.push(
      "Your portfolio currently looks well balanced."
    );
  }

  return advice;
}