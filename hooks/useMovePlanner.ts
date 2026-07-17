import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export function useMovePlanner() {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const [homePrice, setHomePrice] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [returnRate, setReturnRate] = useState(0);

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
        console.error("Failed to load move planner profile:", profileError);
        setLoading(false);
        return;
      }

      if (!profileData) {
        setLoading(false);
        return;
      }

      if (investmentError) {
        console.error(
          "Failed to load move planner investments:",
          investmentError
        );
      }

      setProfile(profileData);
      setInvestments(investmentData ?? []);

      setHomePrice(
        profileData.move_home_price ??
          profileData.target_home_price ??
          0
      );

      setMonthlySavings(
        profileData.move_monthly_savings ?? 3000
      );

      setReturnRate(
        profileData.move_return_rate ?? 5
      );

      setLoading(false);
    }

    void loadData();
  }, []);

  async function saveScenario(
    key: string,
    value: number
  ) {
    const updateData: Record<string, number> = {
      [key]: value,
    };

    const { error } = await supabase
      .from("financial_profile")
      .update(updateData)
      .eq("id", 1);

    if (error) {
      console.error("Failed to save move planner scenario:", error);
    }
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