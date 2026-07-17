"use client";

import { useEffect, useState } from "react";

import AssetAllocationCard from "@/components/wealth/AssetAllocationCard";
import ConcentrationRiskCard from "@/components/wealth/ConcentrationRiskCard";
import FinancialHealthScoreCard from "@/components/wealth/FinancialHealthScoreCard";
import InvestmentBreakdownCard from "@/components/wealth/InvestmentBreakdownCard";
import NetWorthCard from "@/components/wealth/NetWorthCard";
import NetWorthHistoryCard from "@/components/wealth/NetWorthHistoryCard";
import PortfolioAllocationCard from "@/components/wealth/PortfolioAllocationCard";
import Skeleton from "@/components/ui/Skeleton";

import { supabase } from "@/lib/supabase";
import { calculateInvestmentTotal } from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export default function WealthPage() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

      const {
        data: investmentData,
        error: investmentError,
      } = await supabase
        .from("investments")
        .select("*");

      if (profileError) {
        console.error(
          "Failed to load financial profile:",
          profileError
        );
      } else {
        setProfile(profileData);
      }

      if (investmentError) {
        console.error(
          "Failed to load investments:",
          investmentError
        );
      } else {
        setInvestments(investmentData ?? []);
      }

      setLoading(false);
    }

    void loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-8">
        <div className="space-y-3">
          <Skeleton
            width="320px"
            height="42px"
          />

          <Skeleton
            width="220px"
            height="20px"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>

        <Skeleton height="220px" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>

        <Skeleton height="220px" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Financial profile could not be loaded.
        </div>
      </div>
    );
  }

  const investmentTotal =
    calculateInvestmentTotal(investments);

  const cash =
    Number(profile.cash ?? 0);

  const retirement =
    investmentTotal;

  const homeEquity =
    Number(profile.home_value ?? 0) -
    Number(profile.mortgage ?? 0);

  const assets =
    cash +
    retirement +
    homeEquity;

  const liabilities =
    Number(profile.mortgage ?? 0);

  const netWorth =
    assets -
    liabilities;

  const rsu =
    Number(profile.rsu_value ?? 0);

  const stockOptions =
    Number(profile.stock_option_value ?? 0);

  const totalAssets =
    assets +
    rsu +
    stockOptions;

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

  score = Math.max(
    Math.min(score, 100),
    0
  );

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