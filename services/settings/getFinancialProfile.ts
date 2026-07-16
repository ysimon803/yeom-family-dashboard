import { supabase } from "@/lib/supabase";
import type { FinancialProfile } from "@/types/financialProfile";

export async function getFinancialProfile() {
  const { data, error } = await supabase
    .from("financial_profile")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    throw error;
  }

  return data as FinancialProfile;
}