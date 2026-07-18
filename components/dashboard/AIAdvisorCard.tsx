"use client";

import { useEffect, useMemo, useState } from "react";

interface Transaction {
  id?: string;
  transaction_id?: string;
  name?: string | null;
  merchant_name?: string | null;
  amount: number | string;
  date: string;
  category?: string | string[] | null;
  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;
  pending?: boolean;
}

interface TransactionsResponse {
  success?: boolean;
  transactions?: Transaction[];
  error?: string;
}

interface SpendingCategory {
  name: string;
  amount: number;
}

interface SpendingAnalysis {
  currentMonthSpending: number;
  previousMonthSpending: number;
  spendingChange: number | null;
  topCategory: SpendingCategory | null;
  estimatedSavings: number;
  transactionCount: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Math.abs(value) / 100);
}

function normalizeCategoryName(category: string): string {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getTransactionCategory(transaction: Transaction): string {
  const personalFinanceCategory =
    transaction.personal_finance_category?.primary;

  if (personalFinanceCategory) {
    return normalizeCategoryName(personalFinanceCategory);
  }

  if (Array.isArray(transaction.category)) {
    return transaction.category[0] ?? "Other";
  }

  if (
    typeof transaction.category === "string" &&
    transaction.category.trim()
  ) {
    return normalizeCategoryName(transaction.category);
  }

  return "Other";
}

function getTransactionAmount(transaction: Transaction): number {
  const amount = Number(transaction.amount);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return amount;
}

function isSameMonth(
  date: Date,
  year: number,
  month: number
): boolean {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month
  );
}

function calculateSpendingAnalysis(
  transactions: Transaction[]
): SpendingAnalysis {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const previousMonthDate = new Date(
    currentYear,
    currentMonth - 1,
    1
  );

  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth();

  let currentMonthSpending = 0;
  let previousMonthSpending = 0;
  let transactionCount = 0;

  const categoryTotals = new Map<string, number>();

  transactions.forEach((transaction) => {
    if (transaction.pending) {
      return;
    }

    const transactionDate = new Date(
      `${transaction.date}T12:00:00`
    );

    if (Number.isNaN(transactionDate.getTime())) {
      return;
    }

    const amount = getTransactionAmount(transaction);

    /*
     * Plaid generally returns expenses as positive amounts
     * and income/refunds as negative amounts.
     */
    if (amount <= 0) {
      return;
    }

    if (
      isSameMonth(
        transactionDate,
        currentYear,
        currentMonth
      )
    ) {
      currentMonthSpending += amount;
      transactionCount += 1;

      const category =
        getTransactionCategory(transaction);

      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) + amount
      );
    }

    if (
      isSameMonth(
        transactionDate,
        previousYear,
        previousMonth
      )
    ) {
      previousMonthSpending += amount;
    }
  });

  const topCategory =
  Array.from(categoryTotals.entries()).reduce<
    SpendingCategory | null
  >((largestCategory, [name, amount]) => {
    if (
      largestCategory === null ||
      amount > largestCategory.amount
    ) {
      return {
        name,
        amount,
      };
    }

    return largestCategory;
  }, null);

  const spendingChange =
    previousMonthSpending > 0
      ? ((currentMonthSpending -
          previousMonthSpending) /
          previousMonthSpending) *
        100
      : null;

  /*
   * Initial savings estimate:
   * 10% of the highest spending category.
   */
  const estimatedSavings = topCategory
    ? topCategory.amount * 0.1
    : 0;

  return {
    currentMonthSpending,
    previousMonthSpending,
    spendingChange,
    topCategory,
    estimatedSavings,
    transactionCount,
  };
}

function LoadingState() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="mt-3 h-8 w-60 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-100" />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AIAdvisorCard() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/transactions?limit=500",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as TransactionsResponse;

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to load transaction data"
          );
        }

        if (active) {
          setTransactions(result.transactions ?? []);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load transaction data"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  const analysis = useMemo(
    () => calculateSpendingAnalysis(transactions),
    [transactions]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">
          WealthOS AI
        </p>

        <h2 className="mt-1 text-xl font-semibold text-red-900">
          AI Advisor unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          WealthOS AI
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          AI Financial Advisor
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          No transactions were found. Connect an account
          and synchronize transactions to generate financial
          insights.
        </p>
      </section>
    );
  }

  const change = analysis.spendingChange;

  const spendingIncreased =
    change !== null && change > 0;

  const spendingDecreased =
    change !== null && change < 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            WealthOS AI
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            AI Financial Advisor
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Personalized insights generated from your
            connected transaction data.
          </p>
        </div>

        <div className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          AI Analysis
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            This Month
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(
              analysis.currentMonthSpending
            )}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {analysis.transactionCount} completed expense
            {analysis.transactionCount === 1 ? "" : "s"}
          </p>
        </article>

        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Monthly Change
          </p>

          <p
            className={[
              "mt-2 text-2xl font-bold",
              spendingIncreased
                ? "text-red-600"
                : spendingDecreased
                  ? "text-emerald-600"
                  : "text-gray-900",
            ].join(" ")}
          >
            {change === null
              ? "Not available"
              : `${spendingIncreased ? "+" : ""}${formatPercentage(
                  change
                )}`}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Compared with{" "}
            {formatCurrency(
              analysis.previousMonthSpending
            )}{" "}
            last month
          </p>
        </article>

        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Top Category
          </p>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {analysis.topCategory?.name ?? "Not available"}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {analysis.topCategory
              ? `${formatCurrency(
                  analysis.topCategory.amount
                )} spent this month`
              : "No categorized spending found"}
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-950">
            Spending Insight
          </h3>

          <p className="mt-2 text-sm leading-6 text-blue-900">
            {change === null
              ? "There is not enough previous-month data to calculate a spending trend yet."
              : spendingIncreased
                ? `Your spending is ${formatPercentage(
                    change
                  )} higher than last month. Review ${
                    analysis.topCategory?.name ??
                    "your largest categories"
                  } for potential reductions.`
                : spendingDecreased
                  ? `Your spending is ${formatPercentage(
                      change
                    )} lower than last month. You are moving in a positive direction.`
                  : "Your spending is approximately unchanged from last month."}
          </p>
        </article>

        <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <h3 className="font-semibold text-emerald-950">
            Savings Opportunity
          </h3>

          <p className="mt-2 text-sm leading-6 text-emerald-900">
            {analysis.topCategory
              ? `Reducing ${analysis.topCategory.name} spending by 10% could save approximately ${formatCurrency(
                  analysis.estimatedSavings
                )} per month.`
              : "More transaction history is needed to estimate a savings opportunity."}
          </p>
        </article>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        This initial analysis uses rule-based calculations.
        Generative AI commentary will be added in a later
        step.
      </p>
    </section>
  );
}