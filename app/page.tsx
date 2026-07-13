"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import SummaryCards from "@/components/dashboard/SummaryCards";
import AssetBreakdown from "@/components/dashboard/AssetBreakdown";
import MonthlySummary from "@/components/dashboard/MonthlySummary";
import GoalCard from "@/components/dashboard/GoalCard";
import NetWorthChart from "@/components/dashboard/NetWorthChart";
import InvestmentPieChart from "@/components/dashboard/InvestmentPieChart";
import PortfolioAnalysis from "@/components/dashboard/PortfolioAnalysis";
import HousePlanner from "@/components/dashboard/HousePlanner";
import MortgageCalculator from "@/components/dashboard/MortgageCalculator";
import AIFinancialCoach from "@/components/dashboard/AIFinancialCoach";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import {
  calculateInvestmentTotal,
  calculateAssets,
  calculateNetWorth,
  calculateAllocation,
} from "@/services/finance";

type FinancialProfile = {
  id: number;

  home_value: number;
  mortgage: number;
  cash: number;
  monthly_income: number;

  target_home_price: number;
  down_payment_percent: number;

  interest_rate: number;
  property_tax_rate: number;

  hoa: number;
  insurance: number;

  monthly_investment: number;
  monthly_saving: number;
};

type Investment = {
  id: number;
  account_name: string;
  ticker: string;
  balance: number;
};

export default function DashboardPage() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("financial_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (profileError) {
      console.error(profileError);
      return;
    }

    const {
      data: investmentData,
      error: investmentError,
    } = await supabase
      .from("investments")
      .select("id,account_name,ticker,balance");

    if (investmentError) {
      console.error(investmentError);
      return;
    }

    setProfile(profileData);
    setInvestments(investmentData ?? []);
  }

  if (!profile) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  const investmentTotal =
    calculateInvestmentTotal(investments);

  const totalAssets =
    calculateAssets(profile, investments);

  const netWorth =
    calculateNetWorth(profile, investments);

  const allocation =
    calculateAllocation(investments);

  const targetDownPayment =
    profile.target_home_price *
    (profile.down_payment_percent / 100);

  const currentDownPayment =
    profile.cash + investmentTotal;

  const largestHolding =
    allocation.length > 0
      ? allocation.reduce((max, item) =>
          item.balance > max.balance ? item : max
        ).ticker
      : "-";

  return (
    <main>
  

      <h1 className="text-5xl font-bold">
        🏠 Yeom Family Dashboard
      </h1>

      <p className="mt-2 text-slate-500 text-lg">
        Personal Wealth Dashboard
      </p>

      <div className="mt-10">

        <SummaryCards
          netWorth={netWorth}
          assets={totalAssets}
          investments={investmentTotal}
          cash={profile.cash}
        />

      </div>
      <div className="mt-10">

        <PortfolioSummary
          investments={investments}
        />

      </div>
      <div className="mt-10 grid grid-cols-2 gap-8">

        <AssetBreakdown
          home={profile.home_value}
          cash={profile.cash}
          investments={investmentTotal}
          mortgage={profile.mortgage}
        />

        <MonthlySummary
          monthlyIncome={profile.monthly_income}
          mortgage={profile.mortgage}
        />

      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">

        <GoalCard
          target={targetDownPayment}
          current={currentDownPayment}
        />

        <NetWorthChart />

      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">

        <InvestmentPieChart
          investments={investments}
        />

        <PortfolioAnalysis
          allocation={allocation}
        />

      </div>
            <div className="mt-10 grid grid-cols-2 gap-8">

        <HousePlanner
          homeValue={profile.home_value}
          mortgage={profile.mortgage}
          cash={profile.cash}
          investments={investmentTotal}
          targetPrice={profile.target_home_price}
          downPercent={profile.down_payment_percent}
        />

        <MortgageCalculator
          defaultPrice={profile.target_home_price}
        />

      </div>

      <div className="mt-10">

        <AIFinancialCoach
          netWorth={netWorth}
          investmentTotal={investmentTotal}
          monthlyIncome={profile.monthly_income}
          currentDownPayment={currentDownPayment}
          targetDownPayment={targetDownPayment}
          largestHolding={largestHolding}
        />

      </div>

    </main>
  );
}