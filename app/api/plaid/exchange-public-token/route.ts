import { NextResponse } from "next/server";
import type {
  ItemPublicTokenExchangeRequest,
  ItemGetRequest,
  ItemRemoveRequest,
} from "plaid";

import { plaidClient } from "@/services/plaid/client";
import { supabaseAdmin } from "@/services/supabase/admin";

type ExchangePublicTokenBody = {
  publicToken?: unknown;
};

const PLAID_USER_ID = "wealthos-primary-user";

async function removeNewPlaidItem(
  accessToken: string
): Promise<void> {
  try {
    const removeRequest: ItemRemoveRequest = {
      access_token: accessToken,
    };

    await plaidClient.itemRemove(removeRequest);
  } catch (error: unknown) {
    console.error(
      "Failed to remove duplicate Plaid Item:",
      error
    );
  }
}

export async function POST(request: Request) {
  let newlyCreatedAccessToken: string | null = null;

  try {
    if (
      !process.env.PLAID_CLIENT_ID ||
      !process.env.PLAID_SECRET
    ) {
      return NextResponse.json(
        {
          error:
            "Plaid environment variables are not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body =
      (await request.json()) as ExchangePublicTokenBody;

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
        }
      );
    }

    const exchangeRequest: ItemPublicTokenExchangeRequest = {
      public_token: body.publicToken.trim(),
    };

    const exchangeResponse =
      await plaidClient.itemPublicTokenExchange(
        exchangeRequest
      );

    const {
      access_token: accessToken,
      item_id: itemId,
      request_id: exchangeRequestId,
    } = exchangeResponse.data;

    newlyCreatedAccessToken = accessToken;

    const itemRequest: ItemGetRequest = {
      access_token: accessToken,
    };

    const itemResponse =
      await plaidClient.itemGet(itemRequest);

    const institutionId =
      itemResponse.data.item.institution_id ?? null;

    const institutionName =
      itemResponse.data.item.institution_name ??
      "Connected Institution";

    if (institutionId) {
      const {
        data: existingItem,
        error: existingItemError,
      } = await supabaseAdmin
        .from("plaid_items")
        .select(
          "item_id, institution_id, institution_name, status"
        )
        .eq("user_id", PLAID_USER_ID)
        .eq("institution_id", institutionId)
        .eq("status", "active")
        .neq("item_id", itemId)
        .maybeSingle();

      if (existingItemError) {
        console.error(
          "Failed to check existing Plaid Item:",
          existingItemError
        );

        await removeNewPlaidItem(accessToken);

        return NextResponse.json(
          {
            error:
              "Unable to verify whether this institution is already connected.",
          },
          {
            status: 500,
          }
        );
      }

      if (existingItem) {
        await removeNewPlaidItem(accessToken);

        newlyCreatedAccessToken = null;

        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            institutionId,
            institutionName,
            existingItemId: existingItem.item_id,
            message: `${institutionName} is already connected.`,
          },
          {
            status: 409,
          }
        );
      }
    }

    const { error: databaseError } =
      await supabaseAdmin
        .from("plaid_items")
        .upsert(
          {
            user_id: PLAID_USER_ID,
            item_id: itemId,
            access_token: accessToken,
            institution_id: institutionId,
            institution_name: institutionName,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "item_id",
          }
        );

    if (databaseError) {
      console.error(
        "Failed to save Plaid Item to Supabase:",
        databaseError
      );

      await removeNewPlaidItem(accessToken);

      newlyCreatedAccessToken = null;

      return NextResponse.json(
        {
          error:
            "Plaid connected, but the connection could not be saved.",
        },
        {
          status: 500,
        }
      );
    }

    newlyCreatedAccessToken = null;

    return NextResponse.json({
      success: true,
      itemId,
      institutionId,
      institutionName,
      requestId: exchangeRequestId,
      message:
        "Plaid institution connected successfully.",
    });
  } catch (error: unknown) {
    console.error(
      "Failed to exchange and save Plaid public token:",
      error
    );

    if (newlyCreatedAccessToken) {
      await removeNewPlaidItem(
        newlyCreatedAccessToken
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to connect the Plaid institution.",
      },
      {
        status: 500,
      }
    );
  }
}