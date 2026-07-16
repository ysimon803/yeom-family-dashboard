import { supabase } from "@/lib/supabase";
import type { Investment } from "@/types/investment";

export async function getInvestments() {
  const { data, error } = await supabase
    .from("investments")
    .select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as Investment[];
}