"use client";

import { useEffect, useState } from "react";

import EquityVestingTimeline from "@/components/future/EquityVestingTimeline";
import NetWorthForecast from "@/components/future/NetWorthForecast";
import { supabase } from "@/lib/supabase";
import {
  calculateInvestmentTotal,
  calculateNetWorth,
} from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export default function FuturePage() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: profileData } = await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

      const { data: investmentData } = await supabase
        .from("investments")
        .select("*");

      setProfile(profileData);
      setInvestments(investmentData ?? []);
      setLoading(false);
    }

    void loadData();
  }, []);

  if (loading || !profile) {
    return <div className="p-8">Loading...</div>;
  }

  const netWorth = calculateNetWorth(profile, investments);
  const investmentTotal = calculateInvestmentTotal(investments);

  const vestingData = [
    {
      year: 2026,
      rsu: 0,
      options: 23120,
    },
    {
      year: 2027,
      rsu: 0,
      options: 23120,
    },
    {
      year: 2028,
      rsu: 162287,
      options: 23120,
    },
    {
      year: 2029,
      rsu: 0,
      options: 23120,
    },
  ];

  const equityData = [
    {
      year: 2026,
      value: 23120,
    },
    {
      year: 2027,
      value: 23120,
    },
    {
      year: 2028,
      value: 185407,
    },
    {
      year: 2029,
      value: 23120,
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-4xl font-bold">📈 Future Planner</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">Current Net Worth</h2>

          <p className="mt-6 text-4xl font-bold text-blue-600">
            ${Math.round(netWorth).toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">Investments</h2>

          <p className="mt-6 text-4xl font-bold text-green-600">
            ${Math.round(investmentTotal).toLocaleString()}
          </p>
        </div>
      </div>

      <NetWorthForecast
        currentNetWorth={netWorth}
        yearlyGrowth={7}
        years={20}
        equity={equityData}
      />

      <EquityVestingTimeline items={vestingData} />
    </div>
  );
}