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

  const total = calculateInvestmentTotal(investments);

  const invested = investments.reduce(
    (sum, item) => sum + item.cost_basis,
    0
  );

  const groupedAccount = groupByAccount(investments);
  const groupedCategory = groupByCategory(investments);
  const allocation = calculateAllocation(investments);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">💼 Investments</h1>

      <InvestmentSummary total={total} />

      <CategorySummary grouped={groupedCategory} />

      <AllocationChart data={investments} />

      <EquityDashboard
        rsu={profile.rsu_value}
        options={profile.stock_option_value}
      />

      <PerformanceCard invested={invested} current={total} />

      <TargetAllocation />

      <RebalanceAdvisor allocation={allocation} />

      <div className="space-y-6">
        {Object.entries(groupedAccount).map(([account, items]) => (
          <AccountGroup
            key={account}
            title={account}
            investments={items}
          />
        ))}
      </div>
    </div>
  );
}