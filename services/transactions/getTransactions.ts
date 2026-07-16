import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Transaction[];
}