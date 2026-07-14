import type { Investment } from "@/types/investment";

export type InvestmentAllocation = Investment & {
  allocation: number;
};

export function calculateAllocation(
  investments: Investment[]
): InvestmentAllocation[] {

  const total = investments.reduce(
    (sum, item) => sum + item.balance,
    0
  );

  return investments.map((item): InvestmentAllocation => ({
    ...item,
    allocation:
      total > 0
        ? (item.balance / total) * 100
        : 0,
  }));
}