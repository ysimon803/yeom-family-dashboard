import { useEffect, useState } from "react";
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

  async function refresh() {
    const { data } = await supabase
      .from("financial_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    profile,
    refresh,
  };
}