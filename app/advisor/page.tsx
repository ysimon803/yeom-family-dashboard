"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import AIAdvisorCard from "@/components/advisor/AIAdvisorCard";
import PortfolioAnalysisCard from "@/components/advisor/PortfolioAnalysisCard";
import HomePurchaseAdvisorCard from "@/components/advisor/HomePurchaseAdvisorCard";
import EmergencyFundAdvisorCard from "@/components/advisor/EmergencyFundAdvisorCard";
import PriorityRecommendationCard from "@/components/advisor/PriorityRecommendationCard";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

import { calculateInvestmentTotal } from "@/services/finance";

export default function AdvisorPage() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: profileData } =
      await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

    const { data: investmentData } =
      await supabase
        .from("investments")
        .select("*");

    setProfile(profileData);

    setInvestments(
      investmentData ?? []
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading...
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

  const investmentTotal =
    calculateInvestmentTotal(
      investments
    );
    const companyRisk =
  (
    (Number(profile.rsu_value ?? 0) +
      Number(profile.stock_option_value ?? 0)) /
    (
      profile.retirement_assets +
      Number(profile.rsu_value ?? 0) +
      Number(profile.stock_option_value ?? 0) +
      profile.cash
    )
  ) *
  100;

const emergencyMonths =
  profile.cash /
  Math.max(
    profile.monthly_income * 0.6,
    4000
  );

const houseProgress =
  (profile.cash /
    (
      profile.target_home_price *
      (profile.down_payment_percent / 100)
    )) *
  100;

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
        retirement={
          profile.retirement_assets
        }
        rsu={
          Number(profile.rsu_value ?? 0)
        }
        stockOptions={
          Number(profile.stock_option_value ?? 0)
        }
        cash={
          profile.cash
        }
      />

      <HomePurchaseAdvisorCard
        cash={profile.cash}
        targetHomePrice={profile.target_home_price}
        downPaymentPercent={profile.down_payment_percent}
      />

      <EmergencyFundAdvisorCard
        cash={profile.cash}
        monthlyExpense={
          Math.max(
            profile.monthly_income * 0.6,
            4000
          )
        }
      />
      <PriorityRecommendationCard
        companyRisk={companyRisk}
        emergencyMonths={emergencyMonths}
        houseProgress={houseProgress}
      />
    </div>
  );
}