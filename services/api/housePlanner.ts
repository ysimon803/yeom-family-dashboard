import { getFinancialOverview } from "@/services/api/overview";

export interface HousePlannerSummary {
  currentSavings: number;
  monthlySavings: number;
  targetHomePrice: number;
  downPaymentPercent: number;
  monthsUntilPurchase: number;
}

export async function getHousePlannerSummary(): Promise<HousePlannerSummary> {
  const overview = await getFinancialOverview();

  return {
    currentSavings: Math.max(
      overview.assets - overview.liabilities - overview.investments,
      0
    ),

    monthlySavings: Math.max(overview.cashFlow, 0),

    // Temporary defaults
    targetHomePrice: 850000,
    downPaymentPercent: 20,
    monthsUntilPurchase: 24,
  };
}