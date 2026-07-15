"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import SavingsRateCard from "@/components/analytics/SavingsRateCard";
import MonthlyCashFlowCard from "@/components/analytics/MonthlyCashFlowCard";

import type { FinancialProfile } from "@/types/financial";
import ExpenseBreakdownCard from "@/components/analytics/ExpenseBreakdownCard";
import IncomeExpenseTrendCard from "@/components/analytics/IncomeExpenseTrendCard";
import FinancialRatiosCard from "@/components/analytics/FinancialRatiosCard";
import YearlyFinancialSummaryCard
from "@/components/analytics/YearlyFinancialSummaryCard";

export default function AnalyticsPage() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data } =
      await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

    setProfile(data);

    setLoading(false);
  }

  if (loading || !profile) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

    const monthlyIncome =
        profile.monthly_income;

    const monthlySaving =
    3000;

    const monthlyExpenses =
    monthlyIncome - monthlySaving;
    
    const savingsRate =
    (monthlySaving / monthlyIncome) * 100;

    const investmentRate =
    (monthlySaving / monthlyIncome) * 100;

    const debtRatio =
    (profile.mortgage / profile.home_value) * 100;
    
    const annualIncome =
    monthlyIncome * 12;

    const annualSavings =
    monthlySaving * 12;

    const annualExpenses =
    monthlyExpenses * 12;

    const estimatedGrowth =
    18000;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          📊 Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          Financial analytics dashboard
        </p>
      </div>

      <SavingsRateCard
        income={monthlyIncome}
        savings={monthlySaving}
      />

      <MonthlyCashFlowCard
        income={monthlyIncome}
        savings={monthlySaving}
      />
      <ExpenseBreakdownCard
        housing={3439}
        transportation={1000}
        food={1200}
        insurance={500}
        other={2902}
        />
      <IncomeExpenseTrendCard
        income={monthlyIncome}
        expenses={monthlyExpenses}
      />
      <FinancialRatiosCard
        savingsRate={savingsRate}
        debtRatio={debtRatio}
        investmentRate={investmentRate}
      />
      <YearlyFinancialSummaryCard
        annualIncome={annualIncome}
        annualSavings={annualSavings}
        annualExpenses={annualExpenses}
        estimatedGrowth={estimatedGrowth}
      />
    </div>
  );
}