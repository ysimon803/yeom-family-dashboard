"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getCashFlowSummary,
  type CashFlowSummary,
} from "@/services/api/cashFlow";

const EMPTY_SUMMARY: CashFlowSummary = {
  income: 0,
  expenses: 0,
  netCashFlow: 0,
  savingsRate: 0,
  transactionCount: 0,
  incomeTransactionCount: 0,
  expenseTransactionCount: 0,
  periodStart: "",
  periodEnd: "",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number): string {
  const formattedValue = formatCurrency(Math.abs(value));

  if (value > 0) {
    return `+${formattedValue}`;
  }

  if (value < 0) {
    return `-${formattedValue}`;
  }

  return formattedValue;
}

function formatDate(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function clampPercentage(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

export default function CashFlowCard() {
  const [summary, setSummary] =
    useState<CashFlowSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCashFlow = useCallback(async () => {
    try {
      setError(null);

      const result = await getCashFlowSummary(30);

      setSummary(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load cash flow"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCashFlow();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCashFlow]);

  const maximumFlow = useMemo(
    () => Math.max(summary.income, summary.expenses, 1),
    [summary.expenses, summary.income]
  );

  const incomeBarWidth = clampPercentage(
    (summary.income / maximumFlow) * 100
  );

  const expenseBarWidth = clampPercentage(
    (summary.expenses / maximumFlow) * 100
  );

  const hasPositiveCashFlow = summary.netCashFlow >= 0;

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-9 w-36 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-48 rounded bg-slate-100" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-slate-100" />
            <div className="h-24 rounded-xl bg-slate-100" />
          </div>

          <div className="mt-5 space-y-4">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Cash Flow
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadCashFlow();
          }}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Monthly Cash Flow
          </p>

          <h2
            className={`mt-2 text-3xl font-bold tracking-tight ${
              hasPositiveCashFlow
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {formatSignedCurrency(summary.netCashFlow)}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Net cash flow over the last 30 days
          </p>
        </div>

        {summary.periodStart && summary.periodEnd ? (
          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            {formatDate(summary.periodStart)}
            {" – "}
            {formatDate(summary.periodEnd)}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-emerald-700">
              Income
            </p>

            <span className="text-lg">↗</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {formatCurrency(summary.income)}
          </p>

          <p className="mt-1 text-xs text-emerald-700">
            {summary.incomeTransactionCount}{" "}
            {summary.incomeTransactionCount === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-red-700">
              Expenses
            </p>

            <span className="text-lg">↘</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-red-900">
            {formatCurrency(summary.expenses)}
          </p>

          <p className="mt-1 text-xs text-red-700">
            {summary.expenseTransactionCount}{" "}
            {summary.expenseTransactionCount === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-700">
              Income
            </p>

            <p className="text-sm font-semibold text-slate-950">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${incomeBarWidth}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-700">
              Expenses
            </p>

            <p className="text-sm font-semibold text-slate-950">
              {formatCurrency(summary.expenses)}
            </p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{
                width: `${expenseBarWidth}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Savings rate
          </p>

          <p
            className={`mt-1 text-lg font-bold ${
              summary.savingsRate >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {summary.savingsRate.toFixed(1)}%
          </p>
        </div>

        <p className="text-xs text-slate-500">
          {summary.transactionCount} total{" "}
          {summary.transactionCount === 1
            ? "transaction"
            : "transactions"}
        </p>
      </div>
    </section>
  );
}