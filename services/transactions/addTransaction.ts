import { supabase } from "@/lib/supabase";

type AddTransactionInput = {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
};

export async function addTransaction(
  input: AddTransactionInput
) {
  const { error } = await supabase
    .from("transactions")
    .insert(input);

  if (error) {
    throw error;
  }
}