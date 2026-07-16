import { supabase } from "@/lib/supabase";

type UpdateTransactionInput = {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
};

export async function updateTransaction(
  id: number,
  input: UpdateTransactionInput
) {
  const { error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id);

  if (error) {
    throw error;
  }
}