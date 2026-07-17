import { getInvestmentSummary } from "@/services/api/investments";
import { getFinancialProfile } from "@/services/settings/getFinancialProfile";

export interface NetWorthSummary {
  assets: number;
  liabilities: number;
  netWorth: number;
  assetRatio: number;
  liabilityRatio: number;
}

type UnknownRecord = Record<string, unknown>;

function getNumberField(
  record: UnknownRecord,
  keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

export async function getNetWorthSummary(): Promise<NetWorthSummary> {
  const [investmentSummary, financialProfile] =
    await Promise.all([
      getInvestmentSummary(),
      getFinancialProfile(),
    ]);

  const profile = (financialProfile ??
    {}) as UnknownRecord;

  const cash = getNumberField(profile, [
    "cash",
    "cash_balance",
    "cashBalance",
    "checking_balance",
    "checkingBalance",
    "savings_balance",
    "savingsBalance",
  ]);

  const homeValue = getNumberField(profile, [
    "home_value",
    "homeValue",
    "house_value",
    "houseValue",
    "property_value",
    "propertyValue",
  ]);

  const mortgage = getNumberField(profile, [
    "mortgage_balance",
    "mortgageBalance",
  ]);

  const carLoan = getNumberField(profile, [
    "car_loan_balance",
    "carLoanBalance",
    "auto_loan_balance",
    "autoLoanBalance",
  ]);

  const otherDebt = getNumberField(profile, [
    "other_debt",
    "otherDebt",
    "credit_card_balance",
    "creditCardBalance",
  ]);

  const investmentValue =
    investmentSummary.totalValue;

  const assets =
    cash +
    investmentValue +
    homeValue;

  const liabilities =
    mortgage +
    carLoan +
    otherDebt;

  const netWorth =
    assets - liabilities;

  const total =
    assets + liabilities;

  return {
    assets,
    liabilities,
    netWorth,
    assetRatio:
      total > 0
        ? (assets / total) * 100
        : 0,
    liabilityRatio:
      total > 0
        ? (liabilities / total) * 100
        : 0,
  };
}