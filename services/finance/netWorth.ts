import type { PlaidAccount } from "@/services/api/accounts";

export interface NetWorthSummary {
  assets: number;
  liabilities: number;
  netWorth: number;
  assetAccountCount: number;
  liabilityAccountCount: number;
}

const LIABILITY_TYPES = new Set([
  "credit",
  "loan",
]);

function getAccountBalance(account: PlaidAccount): number {
  return (
    account.balances.current ??
    account.balances.available ??
    0
  );
}

export function isLiabilityAccount(
  account: PlaidAccount
): boolean {
  return LIABILITY_TYPES.has(account.type.toLowerCase());
}

export function calculateNetWorth(
  accounts: PlaidAccount[]
): NetWorthSummary {
  let assets = 0;
  let liabilities = 0;
  let assetAccountCount = 0;
  let liabilityAccountCount = 0;

  for (const account of accounts) {
    const balance = Math.abs(getAccountBalance(account));

    if (isLiabilityAccount(account)) {
      liabilities += balance;
      liabilityAccountCount += 1;
    } else {
      assets += balance;
      assetAccountCount += 1;
    }
  }

  return {
    assets,
    liabilities,
    netWorth: assets - liabilities,
    assetAccountCount,
    liabilityAccountCount,
  };
}