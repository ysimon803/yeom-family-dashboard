"use client";

import { useEffect, useState } from "react";

import AssetAllocationCard from "@/components/wealth/AssetAllocationCard";
import ConcentrationRiskCard from "@/components/wealth/ConcentrationRiskCard";
import FinancialHealthScoreCard from "@/components/wealth/FinancialHealthScoreCard";
import InvestmentBreakdownCard from "@/components/wealth/InvestmentBreakdownCard";
import NetWorthCard from "@/components/wealth/NetWorthCard";
import NetWorthHistoryCard from "@/components/wealth/NetWorthHistoryCard";
import PortfolioAllocationCard from "@/components/wealth/PortfolioAllocationCard";
import { supabase } from "@/lib/supabase";
import { calculateInvestmentTotal } from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export default function WealthPage() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: profileData, error: profileError } = await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

      const { data: investmentData, error: investmentError } = await supabase
        .from("investments")
        .select("*");

      if (profileError) {
        console.error("Failed to load financial profile:", profileError);
      } else {
        setProfile(profileData);
      }

      if (investmentError) {
        console.error("Failed to load investments:", investmentError);
      } else {
        setInvestments(investmentData ?? []);
      }

      setLoading(false);
    }

    void loadData();
  }, []);

  if (loading || !profile) {
    return <div className="p-8">Loading...</div>;
  }

  const investmentTotal = calculateInvestmentTotal(investments);

  const cash = profile.cash;
  const retirement = investmentTotal;
  const homeEquity = profile.home_value - profile.mortgage;

  const assets = cash + retirement + homeEquity;
  const liabilities = profile.mortgage;
  const netWorth = assets - liabilities;

  const rsu = Number(profile.rsu_value ?? 0);
  const stockOptions = Number(profile.stock_option_value ?? 0);

  const totalAssets = assets + rsu + stockOptions;

  let score = 100;

  if (cash < 10000) {
    score -= 10;
  }

  if (
    totalAssets > 0 &&
    (rsu + stockOptions) / totalAssets > 0.4
  ) {
    score -= 15;
  }

  if (liabilities > assets) {
    score -= 20;
  }

  score = Math.max(score, 0);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">💰 Wealth Dashboard</h1>

        <p className="mt-2 text-slate-500">
          Overall financial overview
        </p>
      </div>

      <AssetAllocationCard
        cash={cash}
        retirement={retirement}
        homeEquity={homeEquity}
      />

      <NetWorthCard
        assets={assets}
        liabilities={liabilities}
      />

      <NetWorthHistoryCard
        currentNetWorth={netWorth}
      />

      <InvestmentBreakdownCard
        cash={cash}
        retirement={retirement}
        homeEquity={homeEquity}
      />

      <PortfolioAllocationCard
        retirement={retirement}
        rsu={rsu}
        stockOptions={stockOptions}
        cash={cash}
        homeEquity={homeEquity}
      />

      <ConcentrationRiskCard
        rsu={rsu}
        stockOptions={stockOptions}
        totalAssets={totalAssets}
      />

      <FinancialHealthScoreCard
        score={score}
      />
    </div>
  );
}