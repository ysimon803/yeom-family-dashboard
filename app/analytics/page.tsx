"use client";

import { useFinancialData } from "@/hooks/useFinancialData";

import AIAdvisorCard from "@/components/advisor/AIAdvisorCard";
import PortfolioAnalysisCard from "@/components/advisor/PortfolioAnalysisCard";
import HomePurchaseAdvisorCard from "@/components/advisor/HomePurchaseAdvisorCard";
import EmergencyFundAdvisorCard from "@/components/advisor/EmergencyFundAdvisorCard";
import PriorityRecommendationCard from "@/components/advisor/PriorityRecommendationCard";

export default function AdvisorPage() {
  const {
    profile,
    loading,
    error,
  } = useFinancialData();

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        No financial profile found.
      </div>
    );
  }

  const retirement =
    Number(profile.retirement_assets ?? 0);

  const rsu =
    Number(profile.rsu_value ?? 0);

  const stockOptions =
    Number(profile.stock_option_value ?? 0);

  const cash =
    Number(profile.cash ?? 0);

  const monthlyIncome =
    Number(profile.monthly_income ?? 0);

  const targetHomePrice =
    Number(profile.target_home_price ?? 0);

  const downPaymentPercent =
    Number(profile.down_payment_percent ?? 0);

  const employerEquity =
    rsu + stockOptions;

  const portfolioTotal =
    retirement +
    employerEquity +
    cash;

  const companyRisk =
    portfolioTotal > 0
      ? (employerEquity / portfolioTotal) * 100
      : 0;

  const estimatedMonthlyExpense =
    Math.max(
      monthlyIncome * 0.6,
      4000
    );

  const emergencyMonths =
    estimatedMonthlyExpense > 0
      ? cash / estimatedMonthlyExpense
      : 0;

  const targetDownPayment =
    targetHomePrice *
    (downPaymentPercent / 100);

  const houseProgress =
    targetDownPayment > 0
      ? (cash / targetDownPayment) * 100
      : 0;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          🤖 AI Financial Advisor
        </h1>

        <p className="mt-2 text-slate-500">
          Personalized financial insights
        </p>
      </div>

      <AIAdvisorCard />

      <PortfolioAnalysisCard
        retirement={retirement}
        rsu={rsu}
        stockOptions={stockOptions}
        cash={cash}
      />

      <HomePurchaseAdvisorCard
        cash={cash}
        targetHomePrice={targetHomePrice}
        downPaymentPercent={downPaymentPercent}
      />

      <EmergencyFundAdvisorCard
        cash={cash}
        monthlyExpense={estimatedMonthlyExpense}
      />

      <PriorityRecommendationCard
        companyRisk={companyRisk}
        emergencyMonths={emergencyMonths}
        houseProgress={houseProgress}
      />
    </div>
  );
}