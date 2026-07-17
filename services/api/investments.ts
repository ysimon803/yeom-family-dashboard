import { getInvestments } from "@/services/investments/getInvestments";

export type InvestmentCategory =
  | "401k"
  | "ira"
  | "hsa"
  | "brokerage"
  | "other";

export interface InvestmentSummaryAccount {
  id: string;
  name: string;
  category: InvestmentCategory;
  value: number;
}

export interface InvestmentSummary {
  totalValue: number;
  accountCount: number;
  accounts: InvestmentSummaryAccount[];
  categoryTotals: Record<InvestmentCategory, number>;
}

function normalizeCategory(
  value: string | null | undefined
): InvestmentCategory {
  const normalizedValue = value
    ?.trim()
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("_", "")
    .replaceAll("-", "");

  if (
    normalizedValue === "401k" ||
    normalizedValue === "401(k)" ||
    normalizedValue === "401"
  ) {
    return "401k";
  }

  if (
    normalizedValue === "ira" ||
    normalizedValue === "rothira" ||
    normalizedValue === "traditionalira"
  ) {
    return "ira";
  }

  if (
    normalizedValue === "hsa" ||
    normalizedValue === "healthsavingsaccount"
  ) {
    return "hsa";
  }

  if (
    normalizedValue === "brokerage" ||
    normalizedValue === "taxable" ||
    normalizedValue === "investment"
  ) {
    return "brokerage";
  }

  return "other";
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getStringField(
  record: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function getNumberField(
  record: Record<string, unknown>,
  keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
}

export async function getInvestmentSummary(): Promise<InvestmentSummary> {
  const investments = await getInvestments();

  const accounts: InvestmentSummaryAccount[] = investments.map(
    (investment, index) => {
      const record = toRecord(investment);

      const idValue = record.id;

      const id =
        typeof idValue === "string" ||
        typeof idValue === "number"
          ? String(idValue)
          : String(index);

      const name =
        getStringField(record, [
          "account_name",
          "accountName",
          "name",
          "symbol",
          "ticker",
        ]) ?? "Investment account";

      const categoryValue = getStringField(record, [
        "category",
        "account_type",
        "accountType",
        "type",
      ]);

      const value = getNumberField(record, [
        "current_value",
        "currentValue",
        "market_value",
        "marketValue",
        "value",
        "balance",
        "amount",
      ]);

      return {
        id,
        name,
        category: normalizeCategory(categoryValue),
        value,
      };
    }
  );

  const categoryTotals: Record<InvestmentCategory, number> = {
    "401k": 0,
    ira: 0,
    hsa: 0,
    brokerage: 0,
    other: 0,
  };

  for (const account of accounts) {
    categoryTotals[account.category] += account.value;
  }

  const totalValue = accounts.reduce(
    (total, account) => total + account.value,
    0
  );

  return {
    totalValue,
    accountCount: accounts.length,
    accounts,
    categoryTotals,
  };
}