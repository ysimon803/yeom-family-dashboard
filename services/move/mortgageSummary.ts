import { calculateMonthlyMortgage } from "@/components/move/mortgage";

export function getMortgageSummary(
  homePrice: number,
  downPaymentPercent: number
) {
  const monthlyMortgage =
    calculateMonthlyMortgage(
      homePrice,
      downPaymentPercent
    );

  return {
    monthlyMortgage,
  };
}