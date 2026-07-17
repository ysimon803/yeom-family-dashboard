import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const USER_ID = "wealthos-primary-user";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      netWorth,
      assets,
      liabilities,
    } = body;

    const snapshotDate =
      new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("networth_history")
      .upsert(
        {
          user_id: USER_ID,
          snapshot_date: snapshotDate,
          net_worth: netWorth,
          assets,
          liabilities,
        },
        {
          onConflict:
            "user_id,snapshot_date",
        }
      );

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}