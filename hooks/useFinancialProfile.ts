import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export type FinancialProfile = {
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

export function useFinancialProfile() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("financial_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error(
        "Failed to load financial profile:",
        error
      );
      return;
    }

    if (data) {
      setProfile(data as FinancialProfile);
    }
  }, []);

  useEffect(() => {
    async function loadInitialProfile() {
      const { data, error } = await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error(
          "Failed to load initial financial profile:",
          error
        );
        return;
      }

      if (data) {
        setProfile(data as FinancialProfile);
      }
    }

    void loadInitialProfile();
  }, []);

  return {
    profile,
    refresh,
  };
}