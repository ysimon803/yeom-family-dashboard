import { calculateAllocation } from "./finance";

import type { Investment } from "@/types/investment";

type AllocationItem = {
  ticker: string;
  balance: number;
  percent: number;
};

export function buildAdvice(
  investments: Investment[],
  cash: number,
  targetDownPayment: number
): string[] {
  const allocation = calculateAllocation(
    investments
  ) as AllocationItem[];

  const advice: string[] = [];

  if (allocation.length > 0) {
    const largest = allocation.reduce((largest, current) =>
      current.balance > largest.balance ? current : largest
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