import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const rawPlaidEnv = process.env.PLAID_ENV ?? "sandbox";

const plaidEnv = rawPlaidEnv
  .replace(/^PLAID_ENV=/i, "")
  .trim()
  .toLowerCase();

if (!["sandbox", "development", "production"].includes(plaidEnv)) {
  throw new Error(`Invalid PLAID_ENV: "${rawPlaidEnv}"`);
}

const clientId = process.env.PLAID_CLIENT_ID?.trim();
const secret = process.env.PLAID_SECRET?.trim();

if (!clientId || !secret) {
  throw new Error("Plaid environment variables are missing");
}

const configuration = new Configuration({
  basePath:
    PlaidEnvironments[
      plaidEnv as keyof typeof PlaidEnvironments
    ],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": clientId,
      "PLAID-SECRET": secret,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);