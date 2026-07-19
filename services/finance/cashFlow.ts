import type { Transaction } from "@/services/api/transactions";

export interface CashFlowSummary {
  income: number;
  expenses: number;
  netCashFlow: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
}

function getDateDaysAgo(days: number): Date {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (days - 1));

  return date;
}

export function calculateCashFlow(
  transactions: Transaction[],
  days = 30
): CashFlowSummary {
  const startDate = getDateDaysAgo(days);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  let income = 0;
  let expenses = 0;
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
      transactionDate < startDate ||
      transactionDate > endDate
    ) {
      continue;
    }

    if (transaction.pending) {
      continue;
    }

    const rawAmount = Number(transaction.amount);

    if (
      !Number.isFinite(rawAmount) ||
      rawAmount === 0
    ) {
      continue;
    }

    const amount = Math.abs(rawAmount);

    if (rawAmount < 0) {
      income += amount;
      incomeTransactionCount += 1;
      continue;
    }

    expenses += amount;
    expenseTransactionCount += 1;
  }

  const roundedIncome = Number(income.toFixed(2));
  const roundedExpenses = Number(expenses.toFixed(2));

  return {
    income: roundedIncome,
    expenses: roundedExpenses,
    netCashFlow: Number(
      (roundedIncome - roundedExpenses).toFixed(2)
    ),
    incomeTransactionCount,
    expenseTransactionCount,
  };
}