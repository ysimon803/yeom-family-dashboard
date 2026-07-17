import { supabase } from "@/lib/supabase";

export type FinancialGoal = {
  id: string;
  name: string;
  category: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  color: string;
  created_at: string;
  updated_at: string;
};

export type CreateFinancialGoalInput = {
  name: string;
  category: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string | null;
  color?: string;
};

export type UpdateFinancialGoalInput = Partial<CreateFinancialGoalInput>;

export async function getFinancialGoals(): Promise<FinancialGoal[]> {
  const { data, error } = await supabase
    .from("financial_goals")
    .select("*")
    .order("target_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error("Failed to fetch financial goals:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createFinancialGoal(
  input: CreateFinancialGoalInput,
): Promise<FinancialGoal> {
  const { data, error } = await supabase
    .from("financial_goals")
    .insert({
      name: input.name.trim(),
      category: input.category,
      target_amount: input.target_amount,
      current_amount: input.current_amount ?? 0,
      target_date: input.target_date || null,
      color: input.color ?? "#3b82f6",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create financial goal:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateFinancialGoal(
  id: string,
  input: UpdateFinancialGoalInput,
): Promise<FinancialGoal> {
  const updates: UpdateFinancialGoalInput & {
    updated_at: string;
  } = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  if (typeof input.name === "string") {
    updates.name = input.name.trim();
  }

  if (input.target_date === "") {
    updates.target_date = null;
  }

  const { data, error } = await supabase
    .from("financial_goals")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update financial goal:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteFinancialGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from("financial_goals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete financial goal:", error);
    throw new Error(error.message);
  }
}