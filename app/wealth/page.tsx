"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import AssetAllocationCard from "@/components/wealth/AssetAllocationCard";
import NetWorthCard from "@/components/wealth/NetWorthCard";

import { calculateInvestmentTotal } from "@/services/finance";
import NetWorthHistoryCard from "@/components/wealth/NetWorthHistoryCard";
import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";
import InvestmentBreakdownCard from "@/components/wealth/InvestmentBreakdownCard";
import PortfolioAllocationCard from "@/components/wealth/PortfolioAllocationCard";
import ConcentrationRiskCard from "@/components/wealth/ConcentrationRiskCard";
import FinancialHealthScoreCard from "@/components/wealth/FinancialHealthScoreCard";

export default function WealthPage() {
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

  if (loading || !profile) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  } 
    const investmentTotal =
    calculateInvestmentTotal(
      investments
    );

  const cash =
    profile.cash;

  const retirement =
    investmentTotal;

  const homeEquity =
    profile.home_value -
    profile.mortgage;

  const assets =
    cash +
    retirement +
    homeEquity;

  const liabilities =
    profile.mortgage;

    const netWorth =
        assets - liabilities;  
    
    const rsu =
        Number(profile.rsu_value ?? 0);

    const stockOptions =
        Number(profile.stock_option_value ?? 0);

    const totalAssets =
        assets +
        rsu +
        stockOptions;
    let score = 100;

    if (cash < 10000)
    score -= 10;

    if (
    (rsu + stockOptions) /
        totalAssets >
    0.4
    )
    score -= 15;

    if (
    liabilities >
    assets
    )
    score -= 20;

    score = Math.max(score, 0);
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          💰 Wealth Dashboard
        </h1>

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