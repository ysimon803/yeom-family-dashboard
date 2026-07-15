"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SafeWithdrawalCard from "@/components/retirement/SafeWithdrawalCard";
import RetirementSummaryCard from "@/components/retirement/RetirementSummaryCard";
import RetirementProjectionChart from "@/components/retirement/RetirementProjectionChart";
import RetirementGoalCard from "@/components/retirement/RetirementGoalCard";
import FIRENumberCard from "@/components/retirement/FIRENumberCard";
import RetirementIncomeCard from "@/components/retirement/RetirementIncomeCard";
import RetirementReadinessCard from "@/components/retirement/RetirementReadinessCard";

type FinancialProfile = {
  retirement_assets: number;
  annual_retirement_contribution: number;
  target_retirement: number;
  current_age: number;
  retirement_age: number;
};

export default function RetirementPage() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data, error } =
      await supabase
        .from("financial_profile")
        .select("*")
        .limit(1)
        .single();

    if (!error && data) {
      setProfile(data as FinancialProfile);
    }

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

  const annualExpense = 80000;
  const safeWithdrawal =
  profile.retirement_assets * 0.04;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          🏖 Retirement Planner
        </h1>

        <p className="mt-2 text-slate-500">
          Retirement planning dashboard
        </p>
      </div>

      <RetirementSummaryCard
        retirementAssets={profile.retirement_assets}
        annualContribution={
          profile.annual_retirement_contribution
        }
        targetRetirement={
          profile.target_retirement
        }
      />

      <RetirementProjectionChart
        currentBalance={
          profile.retirement_assets
        }
        annualContribution={
          profile.annual_retirement_contribution
        }
        currentAge={profile.current_age}
        retirementAge={profile.retirement_age}
      />

      <RetirementGoalCard
        currentBalance={
          profile.retirement_assets
        }
        targetBalance={
          profile.target_retirement
        }
      />

      <FIRENumberCard
        annualExpense={annualExpense}
      />
      <SafeWithdrawalCard
        retirementAssets={profile.retirement_assets}
      /> 
      <RetirementIncomeCard
        retirementAssets={profile.retirement_assets}
        annualExpense={annualExpense}
      />  

      <RetirementReadinessCard
        currentBalance={profile.retirement_assets}
        targetBalance={profile.target_retirement}
      />
    </div>
  );
}