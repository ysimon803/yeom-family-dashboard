"use client";

import { useEffect, useState } from "react";

import AccountGroup from "@/components/investments/AccountGroup";
import AllocationChart from "@/components/investments/AllocationChart";
import CategorySummary from "@/components/investments/CategorySummary";
import EquityDashboard from "@/components/investments/EquityDashboard";
import InvestmentSummary from "@/components/investments/InvestmentSummary";
import PerformanceCard from "@/components/investments/PerformanceCard";
import RebalanceAdvisor from "@/components/investments/RebalanceAdvisor";
import TargetAllocation from "@/components/investments/TargetAllocation";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

import { supabase } from "@/lib/supabase";
import {
  calculateAllocation,
  calculateInvestmentTotal,
} from "@/services/finance";
import { groupByAccount } from "@/services/investments/groupByAccount";
import { groupByCategory } from "@/services/investments/groupByCategory";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export default function InvestmentsPage() {
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
        <Skeleton
          width="280px"
          height="42px"
        />

        <Skeleton height="180px" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton height="240px" />
          <Skeleton height="240px" />
        </div>

        <Skeleton height="240px" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <EmptyState
          icon="⚠️"
          title="Financial profile unavailable"
          description="Your financial profile could not be loaded. Check your connection and try again."
        />
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="space-y-8 p-8">
        <h1 className="text-4xl font-bold">
          💼 Investments
        </h1>

        <EmptyState
          icon="📈"
          title="No investments yet"
          description="Add your first investment to begin tracking your portfolio and asset allocation."
        />
      </div>
    );
  }

  const total =
    calculateInvestmentTotal(investments);

  const invested =
    investments.reduce(
      (sum, item) =>
        sum + Number(item.cost_basis ?? 0),
      0
    );

  const groupedAccount =
    groupByAccount(investments);

  const groupedCategory =
    groupByCategory(investments);

  const allocation =
    calculateAllocation(investments);

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-4xl font-bold">
        💼 Investments
      </h1>

      <InvestmentSummary
        total={total}
      />

      <CategorySummary
        grouped={groupedCategory}
      />

      <AllocationChart
        data={investments}
      />

      <EquityDashboard
        rsu={Number(profile.rsu_value ?? 0)}
        options={Number(
          profile.stock_option_value ?? 0
        )}
      />

      <PerformanceCard
        invested={invested}
        current={total}
      />

      <TargetAllocation />

      <RebalanceAdvisor
        allocation={allocation}
      />

      <div className="space-y-6">
        {Object.entries(groupedAccount).map(
          ([account, items]) => (
            <AccountGroup
              key={account}
              title={account}
              investments={items}
            />
          )
        )}
      </div>
    </div>
  );
}