"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import TodaySnapshot from "@/components/dashboard/TodaySnapshot";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import MissionProgress from "@/components/dashboard/MissionProgress";

import {
  calculateInvestmentTotal,
  calculateNetWorth,
} from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export default function DashboardPage() {

  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

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
    setInvestments(investmentData ?? []);
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const investmentTotal =
    calculateInvestmentTotal(investments);

  const netWorth =
    calculateNetWorth(
      profile,
      investments
    );

  const houseFund =
    profile.cash + investmentTotal;

  const targetDownPayment =
    profile.target_home_price *
    (profile.down_payment_percent / 100);

  return (

    <div className="space-y-8">

      <TodaySnapshot
        netWorth={netWorth}
        investments={investmentTotal}
        houseFund={houseFund}
      />

      <QuickActions />

      <MissionProgress
        current={houseFund}
        target={targetDownPayment}
      />

      <RecentActivity />

    </div>

  );

}