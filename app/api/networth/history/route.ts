import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const USER_ID = "wealthos-primary-user";

export async function GET() {
  const { data, error } =
    await supabase
      .from("networth_history")
      .select("*")
      .eq("user_id", USER_ID)
      .order("snapshot_date");

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    history: data,
  });
}