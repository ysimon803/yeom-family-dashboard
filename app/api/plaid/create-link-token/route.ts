import { NextResponse } from "next/server";
import {
  CountryCode,
  Products,
  type LinkTokenCreateRequest,
} from "plaid";

import { plaidClient } from "@/services/plaid/client";

export async function POST() {
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

    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: "wealthos-primary-user",
      },
      client_name: "Yeom Family WealthOS",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const response = await plaidClient.linkTokenCreate(request);

    return NextResponse.json({
      linkToken: response.data.link_token,
      expiration: response.data.expiration,
      requestId: response.data.request_id,
    });
  } catch (error: unknown) {
    console.error("Failed to create Plaid Link token:", error);

    return NextResponse.json(
      {
        error: "Failed to create Plaid Link token.",
      },
      {
        status: 500,
      },
    );
  }
}