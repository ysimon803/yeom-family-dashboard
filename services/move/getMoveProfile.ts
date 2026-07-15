import { supabase } from "@/lib/supabase";
import type { MoveProfile } from "../../types/move";

export async function getMoveProfile(): Promise<MoveProfile> {
  const { data, error } = await supabase
    .from("move_profile")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MoveProfile;
}