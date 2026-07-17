import { NextResponse } from "next/server";
import type { AccountsGetRequest } from "plaid";

import { plaidClient } from "@/services/plaid/client";
import { supabaseAdmin } from "@/services/supabase/admin";

const PLAID_USER_ID = "wealthos-primary-user";

type PlaidItemRow = {
  item_id: string;
  access_token: string;
  institution_id: string | null;
  institution_name: string | null;
};

export async function GET() {
  try {
    const { data: plaidItems, error: databaseError } =
      await supabaseAdmin
        .from("plaid_items")
        .select(
          `
            item_id,
            access_token,
            institution_id,
            institution_name
          `,
        )
        .eq("user_id", PLAID_USER_ID)
        .eq("status", "active");

    if (databaseError) {
      console.error(
        "Failed to load Plaid Items from Supabase:",
        databaseError,
      );

      return NextResponse.json(
        {
          error: "Failed to load connected institutions.",
        },
        {
          status: 500,
        },
      );
    }

    const items = (plaidItems ?? []) as PlaidItemRow[];

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        accounts: [],
        institutions: [],
        message: "No financial institutions are connected.",
      });
    }

    const institutionResults = await Promise.all(
      items.map(async (item) => {
        const plaidRequest: AccountsGetRequest = {
          access_token: item.access_token,
        };

        const plaidResponse =
          await plaidClient.accountsGet(plaidRequest);

        const accounts = plaidResponse.data.accounts.map(
          (account) => ({
            accountId: account.account_id,
            itemId: item.item_id,

            institutionId: item.institution_id,
            institutionName:
              item.institution_name ??
              "Connected Institution",

            name: account.name,
            officialName: account.official_name,

            mask: account.mask,
            type: account.type,
            subtype: account.subtype,

            balances: {
              available: account.balances.available,
              current: account.balances.current,
              limit: account.balances.limit,
              isoCurrencyCode:
                account.balances.iso_currency_code,
              unofficialCurrencyCode:
                account.balances
                  .unofficial_currency_code,
            },

            verificationStatus:
              account.verification_status ?? null,
          }),
        );

        return {
          itemId: item.item_id,
          institutionId: item.institution_id,
          institutionName:
            item.institution_name ??
            "Connected Institution",
          requestId: plaidResponse.data.request_id,
          accounts,
        };
      }),
    );

    const accounts = institutionResults.flatMap(
      (institution) => institution.accounts,
    );

    const institutions = institutionResults.map(
      (institution) => ({
        itemId: institution.itemId,
        institutionId: institution.institutionId,
        institutionName: institution.institutionName,
        accountCount: institution.accounts.length,
      }),
    );

    return NextResponse.json({
      success: true,
      accounts,
      institutions,
      totalAccounts: accounts.length,
    });
  } catch (error: unknown) {
    console.error(
      "Failed to retrieve Plaid accounts:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to retrieve Plaid accounts.",
      },
      {
        status: 500,
      },
    );
  }
}