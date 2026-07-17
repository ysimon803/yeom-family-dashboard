export interface PlaidAccount {
  account_id: string;
  name: string;
  official_name: string | null;
  mask: string | null;
  type: string;
  subtype: string | null;

  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
  };
}

interface AccountsResponse {
  success: boolean;
  accounts: PlaidAccount[];
  error?: string;
}

export async function getAccounts(): Promise<AccountsResponse> {
  const response = await fetch("/api/plaid/accounts", {
    method: "GET",
    cache: "no-store",
  });

  const data = (await response.json()) as AccountsResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Failed to fetch accounts");
  }

  return data;
}