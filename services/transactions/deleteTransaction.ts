import { supabase } from "@/lib/supabase";

export async function deleteTransaction(id: number) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}