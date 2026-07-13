import { supabase } from "@/lib/supabase";

export async function saveNetWorthSnapshot(
  assets: number,
  liabilities: number
) {
  const netWorth = assets - liabilities;

  return await supabase
    .from("networth_history")
    .insert({
      snapshot_date: new Date()
        .toISOString()
        .slice(0, 10),

      net_worth: netWorth,

      assets,

      liabilities,
    });
}