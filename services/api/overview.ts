import {
  getCashFlowSummary,
  type CashFlowSummary,
} from "@/services/api/cashFlow";
import {
  getInvestmentSummary,
  type InvestmentSummary,
} from "@/services/api/investments";
import {
  getNetWorthSummary,
  type NetWorthSummary,
} from "@/services/api/netWorth";
import {
  getSpendingCategorySummary,
  type SpendingCategorySummary,
} from "@/services/api/spending";

export type FinancialHealthStatus =
  | "strong"
  | "stable"
  | "attention";

export interface FinancialOverview {
  netWorth: number;
  investments: number;
  spending: number;
  cashFlow: number;
  savingsRate: number;
  assets: number;
  liabilities: number;
  financialHealth: FinancialHealthStatus;
  cashFlowSummary: CashFlowSummary;
  netWorthSummary: NetWorthSummary;
  investmentSummary: InvestmentSummary;
  spendingSummary: SpendingCategorySummary;
}

function getFinancialHealth(
  netWorth: number,
  netCashFlow: number,
  savingsRate: number
): FinancialHealthStatus {
  if (
    netWorth > 0 &&
    netCashFlow > 0 &&
    savingsRate >= 20
  ) {
    return "strong";
  }

  if (
    netWorth >= 0 &&
    netCashFlow >= 0
  ) {
    return "stable";
  }

  return "attention";
}

export async function getFinancialOverview(): Promise<FinancialOverview> {
  const [
    cashFlowSummary,
    netWorthSummary,
    investmentSummary,
    spendingSummary,
  ] = await Promise.all([
    getCashFlowSummary(30),
    getNetWorthSummary(),
    getInvestmentSummary(),
    getSpendingCategorySummary(30),
  ]);

  const financialHealth = getFinancialHealth(
    netWorthSummary.netWorth,
    cashFlowSummary.netCashFlow,
    cashFlowSummary.savingsRate
  );

  return {
    netWorth: netWorthSummary.netWorth,
    investments: investmentSummary.totalValue,
    spending: spendingSummary.totalSpending,
    cashFlow: cashFlowSummary.netCashFlow,
    savingsRate: cashFlowSummary.savingsRate,
    assets: netWorthSummary.assets,
    liabilities: netWorthSummary.liabilities,
    financialHealth,
    cashFlowSummary,
    netWorthSummary,
    investmentSummary,
    spendingSummary,
  };
}