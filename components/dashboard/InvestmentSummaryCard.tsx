"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getInvestmentSummary,
  type InvestmentCategory,
  type InvestmentSummary,
} from "@/services/api/investments";

const EMPTY_SUMMARY: InvestmentSummary = {
  totalValue: 0,
  accountCount: 0,
  accounts: [],
  categoryTotals: {
    "401k": 0,
    ira: 0,
    hsa: 0,
    brokerage: 0,
    other: 0,
  },
};

const CATEGORY_LABELS: Record<InvestmentCategory, string> = {
  "401k": "401(k)",
  ira: "IRA",
  hsa: "HSA",
  brokerage: "Brokerage",
  other: "Other",
};

function formatCurrency(
  value: number,
  currencyCode = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvestmentSummaryCard() {
  const [summary, setSummary] =
    useState<InvestmentSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvestmentSummary = useCallback(async () => {
    try {
      setError(null);

      const result = await getInvestmentSummary();

      setSummary(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load investment summary"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInvestmentSummary();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadInvestmentSummary]);

  const visibleCategories = (
    Object.entries(summary.categoryTotals) as Array<
      [InvestmentCategory, number]
    >
  ).filter(([, amount]) => amount > 0);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
          <div className="mb-3 h-9 w-48 rounded bg-slate-200" />
          <div className="mb-6 h-4 w-32 rounded bg-slate-200" />

          <div className="space-y-3">
            <div className="h-10 rounded bg-slate-100" />
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
          Investment Portfolio
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadInvestmentSummary();
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Investment Portfolio
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {formatCurrency(summary.totalValue)}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {summary.accountCount}{" "}
            {summary.accountCount === 1
              ? "investment account"
              : "investment accounts"}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
          📈
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visibleCategories.length > 0 ? (
          visibleCategories.map(([category, amount]) => {
            const percentage =
              summary.totalValue > 0
                ? (amount / summary.totalValue) * 100
                : 0;

            return (
              <div
                key={category}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {CATEGORY_LABELS[category]}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {percentage.toFixed(1)}% of portfolio
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-950">
                  {formatCurrency(amount)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              No investment accounts found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}