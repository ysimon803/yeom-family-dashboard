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
    const transactionDate = new Date(
      `${transaction.date}T12:00:00`
    );

    if (Number.isNaN(transactionDate.getTime())) {
      continue;
    }

    if (
      transactionDate < periodStartDate ||
      transactionDate > periodEndDate
    ) {
      continue;
    }

    const amount = Number(transaction.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      continue;
    }

    const transactionType = transaction.type
      ?.trim()
      .toLowerCase();

    if (transactionType === "income") {
      income += amount;
      incomeTransactionCount += 1;
      transactionCount += 1;
      continue;
    }

    if (transactionType === "expense") {
      expenses += amount;
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