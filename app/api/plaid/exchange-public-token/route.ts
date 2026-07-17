import { NextResponse } from "next/server";
import type { ItemPublicTokenExchangeRequest } from "plaid";

import { plaidClient } from "@/services/plaid/client";
import { supabaseAdmin } from "@/services/supabase/admin";

type ExchangePublicTokenBody = {
  publicToken?: unknown;
};

const PLAID_USER_ID = "wealthos-primary-user";

export async function POST(request: Request) {
  try {
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      return NextResponse.json(
        {
          error: "Plaid environment variables are not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const body = (await request.json()) as ExchangePublicTokenBody;

    if (
      typeof body.publicToken !== "string" ||
      body.publicToken.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A valid public token is required.",
        },
        {
          status: 400,
        },
      );
    }

    const plaidRequest: ItemPublicTokenExchangeRequest = {
      public_token: body.publicToken.trim(),
    };

    const plaidResponse =
      await plaidClient.itemPublicTokenExchange(plaidRequest);

    const {
      access_token: accessToken,
      item_id: itemId,
      request_id: requestId,
    } = plaidResponse.data;

    const { error: databaseError } = await supabaseAdmin
      .from("plaid_items")
      .upsert(
        {
          user_id: PLAID_USER_ID,
          item_id: itemId,
          access_token: accessToken,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "item_id",
        },
      );

    if (databaseError) {
      console.error(
        "Failed to save Plaid Item to Supabase:",
        databaseError,
      );

      return NextResponse.json(
        {
          error: "Plaid connected, but the connection could not be saved.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      itemId,
      requestId,
      message: "Plaid institution connected successfully.",
    });
  } catch (error: unknown) {
    console.error(
      "Failed to exchange and save Plaid public token:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to connect the Plaid institution.",
      },
      {
        status: 500,
      },
    );
  }
}