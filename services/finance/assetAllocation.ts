import type { PlaidAccount } from "@/services/api/accounts";

export type AssetAllocationCategory =
  | "Checking"
  | "Savings"
  | "Investment"
  | "Retirement"
  | "Cash"
  | "Other Assets";

export interface AssetAllocationItem {
  category: AssetAllocationCategory;
  amount: number;
  percentage: number;
  accountCount: number;
}

export interface AssetAllocationSummary {
  totalAssets: number;
  totalAccounts: number;
  items: AssetAllocationItem[];
}

interface CategoryAccumulator {
  amount: number;
  accountCount: number;
}

const LIABILITY_TYPES = new Set([
  "credit",
  "loan",
]);

function normalizeValue(
  value: string | null | undefined
): string {
  return value?.trim().toLowerCase() ?? "";
}

function getAccountBalance(account: PlaidAccount): number {
  const balance =
    account.balances.current ??
    account.balances.available ??
    0;

  const numericBalance = Number(balance);

  if (!Number.isFinite(numericBalance)) {
    return 0;
  }

  return Math.abs(numericBalance);
}

function isLiabilityAccount(
  account: PlaidAccount
): boolean {
  return LIABILITY_TYPES.has(
    normalizeValue(account.type)
  );
}

export function getAssetAllocationCategory(
  account: PlaidAccount
): AssetAllocationCategory {
  const type = normalizeValue(account.type);
  const subtype = normalizeValue(account.subtype);
  const name = normalizeValue(account.name);
  const officialName = normalizeValue(
    account.official_name
  );

  const searchableText = [
    type,
    subtype,
    name,
    officialName,
  ].join(" ");

  if (
    subtype === "checking" ||
    searchableText.includes("checking")
  ) {
    return "Checking";
  }

  if (
    subtype === "savings" ||
    subtype === "money market" ||
    searchableText.includes("savings") ||
    searchableText.includes("money market")
  ) {
    return "Savings";
  }

  if (
    subtype === "401k" ||
    subtype === "403b" ||
    subtype === "457b" ||
    subtype === "ira" ||
    subtype === "roth" ||
    subtype === "roth 401k" ||
    subtype === "pension" ||
    searchableText.includes("401k") ||
    searchableText.includes("401(k)") ||
    searchableText.includes("roth ira") ||
    searchableText.includes("traditional ira") ||
    searchableText.includes("retirement")
  ) {
    return "Retirement";
  }

  if (
    type === "investment" ||
    subtype === "brokerage" ||
    subtype === "stock plan" ||
    subtype === "mutual fund" ||
    searchableText.includes("brokerage") ||
    searchableText.includes("investment")
  ) {
    return "Investment";
  }

  if (
    subtype === "cash management" ||
    subtype === "cash isa" ||
    searchableText.includes("cash management")
  ) {
    return "Cash";
  }

  return "Other Assets";
}

export function calculateAssetAllocation(
  accounts: PlaidAccount[]
): AssetAllocationSummary {
  const categoryTotals = new Map<
    AssetAllocationCategory,
    CategoryAccumulator
  >();

  let totalAssets = 0;
  let totalAccounts = 0;

  for (const account of accounts) {
    if (isLiabilityAccount(account)) {
      continue;
    }

    const amount = getAccountBalance(account);

    if (amount <= 0) {
      continue;
    }

    const category =
      getAssetAllocationCategory(account);

    const existing = categoryTotals.get(category);

    categoryTotals.set(category, {
      amount: (existing?.amount ?? 0) + amount,
      accountCount:
        (existing?.accountCount ?? 0) + 1,
    });

    totalAssets += amount;
    totalAccounts += 1;
  }

  const roundedTotalAssets = Number(
    totalAssets.toFixed(2)
  );

  const items = Array.from(
    categoryTotals.entries()
  )
    .map(([category, data]) => ({
      category,
      amount: Number(data.amount.toFixed(2)),
      percentage:
        roundedTotalAssets > 0
          ? Number(
              (
                (data.amount /
                  roundedTotalAssets) *
                100
              ).toFixed(1)
            )
          : 0,
      accountCount: data.accountCount,
    }))
    .sort(
      (first, second) =>
        second.amount - first.amount
    );

  return {
    totalAssets: roundedTotalAssets,
    totalAccounts,
    items,
  };
}