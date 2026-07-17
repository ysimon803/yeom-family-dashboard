import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

const USER_ID = "wealthos-primary-user";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const limit = Number(searchParams.get("limit") ?? "50");
    const offset = Number(searchParams.get("offset") ?? "0");

    const accountId = searchParams.get("accountId");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = supabaseAdmin
      .from("plaid_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", USER_ID)
      .eq("is_removed", false)
      .order("transaction_date", { ascending: false });

    if (accountId) {
      query = query.eq("account_id", accountId);
    }

    if (category) {
      query = query.eq(
        "personal_finance_primary",
        category
      );
    }

    if (startDate) {
      query = query.gte(
        "transaction_date",
        startDate
      );
    }

    if (endDate) {
      query = query.lte(
        "transaction_date",
        endDate
      );
    }

    query = query.range(
      offset,
      offset + limit - 1
    );

    const { data, count, error } =
      await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count,
      limit,
      offset,
      transactions: data,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}