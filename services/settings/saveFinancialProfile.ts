import { supabase } from "@/lib/supabase";
import type { FinancialProfile } from "@/types/financial";

export async function saveFinancialProfile(
  profile: FinancialProfile
) {
  const { error } = await supabase
    .from("financial_profile")
    .update(profile)
    .eq("id", profile.id);

  if (error) {
    throw error;
  }
}