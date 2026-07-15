import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export function useMovePlanner() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [homePrice, setHomePrice] =
    useState(0);

  const [monthlySavings, setMonthlySavings] =
    useState(0);

  const [returnRate, setReturnRate] =
    useState(0);

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

    setHomePrice(
      profileData.move_home_price ??
      profileData.target_home_price
    );

    setMonthlySavings(
      profileData.move_monthly_savings ??
      3000
    );

    setReturnRate(
      profileData.move_return_rate ??
      5
    );

    setLoading(false);
  }

  async function saveScenario(
    key: string,
    value: number
  ) {
    const updateData: Record<string, number> = {
      [key]: value,
    };

    await supabase
      .from("financial_profile")
      .update(updateData)
      .eq("id", 1);
  }

  return {
    profile,
    investments,
    loading,

    homePrice,
    setHomePrice,

    monthlySavings,
    setMonthlySavings,

    returnRate,
    setReturnRate,

    saveScenario,
  };
}