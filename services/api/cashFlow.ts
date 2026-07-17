import { getTransactions } from "@/services/transactions/getTransactions";

export interface CashFlowSummary {
  income: number;
  expenses: number;
  netCashFlow: number;
  savingsRate: number;
  transactionCount: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
  periodStart: string;
  periodEnd: string;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getStringField(
  record: UnknownRecord,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function getNumberField(
  record: UnknownRecord,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function getTransactionDate(record: UnknownRecord): Date | null {
  const dateValue = getStringField(record, [
    "transaction_date",
    "transactionDate",
    "date",
    "posted_date",
    "postedDate",
    "created_at",
    "createdAt",
  ]);

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function normalizeTransactionType(
  record: UnknownRecord,
  amount: number
): "income" | "expense" | null {
  const type = getStringField(record, [
    "type",
    "transaction_type",
    "transactionType",
    "flow_type",
    "flowType",
  ])
    ?.toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("_", "")
    .replaceAll("-", "");

  if (
    type === "income" ||
    type === "credit" ||
    type === "deposit" ||
    type === "paycheck" ||
    type === "revenue"
  ) {
    return "income";
  }

  if (
    type === "expense" ||
    type === "debit" ||
    type === "purchase" ||
    type === "payment" ||
    type === "withdrawal"
  ) {
    return "expense";
  }

  /*
   * 거래 타입이 없는 경우 사용하는 기본 규칙:
   * 양수 = income
   * 음수 = expense
   *
   * 프로젝트에서 지출을 양수로 저장한다면 거래의 type 필드가
   * 반드시 "expense"로 저장되어 있어야 합니다.
   */
  if (amount > 0) {
    return "income";
  }

  if (amount < 0) {
    return "expense";
  }

  return null;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getCashFlowSummary(
  days = 30
): Promise<CashFlowSummary> {
  const transactions = await getTransactions();

  const periodEndDate = new Date();
  periodEndDate.setHours(23, 59, 59, 999);

  const periodStartDate = new Date(periodEndDate);
  periodStartDate.setDate(periodStartDate.getDate() - (days - 1));
  periodStartDate.setHours(0, 0, 0, 0);

  let income = 0;
  let expenses = 0;
  let transactionCount = 0;
  let incomeTransactionCount = 0;
  let expenseTransactionCount = 0;

  for (const transaction of transactions) {
    if (!isRecord(transaction)) {
      continue;
    }

    const transactionDate = getTransactionDate(transaction);

    if (
      transactionDate &&
      (transactionDate < periodStartDate ||
        transactionDate > periodEndDate)
    ) {
      continue;
    }

    const amount = getNumberField(transaction, [
      "amount",
      "transaction_amount",
      "transactionAmount",
      "value",
    ]);

    if (amount === undefined || amount === 0) {
      continue;
    }

    const transactionType = normalizeTransactionType(
      transaction,
      amount
    );

    if (transactionType === "income") {
      income += Math.abs(amount);
      incomeTransactionCount += 1;
      transactionCount += 1;
      continue;
    }

    if (transactionType === "expense") {
      expenses += Math.abs(amount);
      expenseTransactionCount += 1;
      transactionCount += 1;
    }
  }

  const netCashFlow = income - expenses;

  const savingsRate =
    income > 0 ? (netCashFlow / income) * 100 : 0;

  return {
    income,
    expenses,
    netCashFlow,
    savingsRate,
    transactionCount,
    incomeTransactionCount,
    expenseTransactionCount,
    periodStart: formatDate(periodStartDate),
    periodEnd: formatDate(periodEndDate),
  };
}