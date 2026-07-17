import type { Transaction } from "@/services/api/transactions";

export interface CashFlowSummary {
  income: number;
  expenses: number;
  netCashFlow: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
}

interface FlexibleTransaction extends Transaction {
  pending?: boolean | null;
}

function getDateDaysAgo(days: number): Date {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

export function calculateCashFlow(
  transactions: Transaction[],
  days = 30
): CashFlowSummary {
  const startDate = getDateDaysAgo(days);

  let income = 0;
  let expenses = 0;
  let incomeTransactionCount = 0;
  let expenseTransactionCount = 0;

  for (const originalTransaction of transactions) {
    const transaction =
      originalTransaction as FlexibleTransaction;

    const transactionDate = new Date(transaction.date);

    if (Number.isNaN(transactionDate.getTime())) {
      continue;
    }

    if (transactionDate < startDate) {
      continue;
    }

    if (transaction.pending) {
      continue;
    }

    const amount = Number(transaction.amount);

    if (!Number.isFinite(amount) || amount === 0) {
      continue;
    }

    if (amount < 0) {
      income += Math.abs(amount);
      incomeTransactionCount += 1;
    } else {
      expenses += amount;
      expenseTransactionCount += 1;
    }
  }

  income = Number(income.toFixed(2));
  expenses = Number(expenses.toFixed(2));

  return {
    income,
    expenses,
    netCashFlow: Number(
      (income - expenses).toFixed(2)
    ),
    incomeTransactionCount,
    expenseTransactionCount,
  };
}