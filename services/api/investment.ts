export interface InvestmentBalances {
  available: number | null;
  current: number | null;
  limit: number | null;
  isoCurrencyCode: string | null;
  unofficialCurrencyCode: string | null;
}

export interface InvestmentAccount {
  accountId: string;
  itemId: string;
  institutionId: string | null;
  institutionName: string;
  name: string;
  officialName: string | null;
  mask: string | null;
  type: string;
  subtype: string | null;
  balances: InvestmentBalances;
  verificationStatus: string | null;
}

interface AccountsApiResponse {
  success: boolean;
  accounts?: InvestmentAccount[];
  error?: string;
}

export type InvestmentCategory =
  | "401k"
  | "ira"
  | "hsa"
  | "brokerage"
  | "other";

export interface InvestmentAccountSummary {
  accountId: string;
  name: string;
  institutionName: string;
  mask: string | null;
  category: InvestmentCategory;
  subtype: string | null;
  balance: number;
  currencyCode: string;
}

export interface InvestmentSummary {
  totalValue: number;
  accountCount: number;
  accounts: InvestmentAccountSummary[];
  categoryTotals: Record<InvestmentCategory, number>;
}

function normalizeSubtype(
  subtype: string | null | undefined
): string {
  return subtype
    ?.trim()
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ") ?? "";
}

function getInvestmentCategory(
  account: InvestmentAccount
): InvestmentCategory {
  const type = account.type.trim().toLowerCase();
  const subtype = normalizeSubtype(account.subtype);
  const accountName = account.name.trim().toLowerCase();

  if (
    subtype === "401k" ||
    subtype === "401 k" ||
    accountName.includes("401k") ||
    accountName.includes("401(k)")
  ) {
    return "401k";
  }

  if (
    subtype.includes("ira") ||
    accountName.includes("ira")
  ) {
    return "ira";
  }

  if (
    subtype === "hsa" ||
    accountName.includes("hsa") ||
    accountName.includes("health savings")
  ) {
    return "hsa";
  }

  if (
    subtype.includes("brokerage") ||
    accountName.includes("brokerage")
  ) {
    return "brokerage";
  }

  if (type === "investment") {
    return "other";
  }

  return "other";
}

function isInvestmentAccount(
  account: InvestmentAccount
): boolean {
  const type = account.type.trim().toLowerCase();
  const subtype = normalizeSubtype(account.subtype);
  const accountName = account.name.trim().toLowerCase();

  return (
    type === "investment" ||
    subtype === "hsa" ||
    accountName.includes("hsa") ||
    accountName.includes("health savings")
  );
}

function getAccountBalance(
  account: InvestmentAccount
): number {
  const balance =
    account.balances.current ??
    account.balances.available ??
    0;

  const numericBalance = Number(balance);

  return Number.isFinite(numericBalance)
    ? numericBalance
    : 0;
}

export async function getInvestmentSummary(): Promise<InvestmentSummary> {
  const response = await fetch("/api/plaid/accounts", {
    method: "GET",
    cache: "no-store",
  });

  const data =
    (await response.json()) as AccountsApiResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ?? "Unable to load investment accounts"
    );
  }

  const investmentAccounts = (
    data.accounts ?? []
  ).filter(isInvestmentAccount);

  const accounts: InvestmentAccountSummary[] =
    investmentAccounts.map((account) => {
      const balance = getAccountBalance(account);

      return {
        accountId: account.accountId,
        name: account.name,
        institutionName:
          account.institutionName ||
          "Connected Institution",
        mask: account.mask,
        category: getInvestmentCategory(account),
        subtype: account.subtype,
        balance,
        currencyCode:
          account.balances.isoCurrencyCode ??
          "USD",
      };
    });

  const categoryTotals: Record<
    InvestmentCategory,
    number
  > = {
    "401k": 0,
    ira: 0,
    hsa: 0,
    brokerage: 0,
    other: 0,
  };

  for (const account of accounts) {
    categoryTotals[account.category] +=
      account.balance;
  }

  const totalValue = accounts.reduce(
    (total, account) => total + account.balance,
    0
  );

  return {
    totalValue,
    accountCount: accounts.length,
    accounts,
    categoryTotals,
  };
}