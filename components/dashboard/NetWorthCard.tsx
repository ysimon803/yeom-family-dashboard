"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getNetWorthSummary,
  type NetWorthSummary,
} from "@/services/api/netWorth";

const EMPTY_SUMMARY: NetWorthSummary = {
  assets: 0,
  liabilities: 0,
  netWorth: 0,
  assetRatio: 0,
  liabilityRatio: 0,
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

function clampPercentage(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

export default function NetWorthCard() {
  const [summary, setSummary] =
    useState<NetWorthSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNetWorth = useCallback(async () => {
    try {
      setError(null);

      const result = await getNetWorthSummary();

      setSummary(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load net worth"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadNetWorth();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadNetWorth]);

  const assetRatio = useMemo(
    () => clampPercentage(summary.assetRatio),
    [summary.assetRatio]
  );

  const liabilityRatio = useMemo(
    () => clampPercentage(summary.liabilityRatio),
    [summary.liabilityRatio]
  );

  const hasPositiveNetWorth = summary.netWorth >= 0;

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-28 rounded bg-slate-200" />
          <div className="mt-3 h-9 w-44 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-40 rounded bg-slate-100" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-slate-100" />
            <div className="h-24 rounded-xl bg-slate-100" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Net Worth
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadNetWorth();
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
      <div>
        <p className="text-sm font-medium text-slate-500">
          Net Worth
        </p>

        <h2
          className={`mt-2 text-3xl font-bold tracking-tight ${
            hasPositiveNetWorth
              ? "text-slate-950"
              : "text-red-600"
          }`}
        >
          {formatSignedCurrency(summary.netWorth)}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Total assets minus total liabilities
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-emerald-700">
              Assets
            </p>

            <span
              aria-hidden="true"
              className="text-lg text-emerald-700"
            >
              ↗
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {formatCurrency(summary.assets)}
          </p>

          <p className="mt-1 text-xs text-emerald-700">
            {assetRatio.toFixed(1)}% of total balance
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-red-700">
              Liabilities
            </p>

            <span
              aria-hidden="true"
              className="text-lg text-red-700"
            >
              ↘
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-red-900">
            {formatCurrency(summary.liabilities)}
          </p>

          <p className="mt-1 text-xs text-red-700">
            {liabilityRatio.toFixed(1)}% of total balance
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-700">
              Assets
            </p>

            <p className="text-sm font-semibold text-slate-950">
              {assetRatio.toFixed(1)}%
            </p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${assetRatio}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-700">
              Liabilities
            </p>

            <p className="text-sm font-semibold text-slate-950">
              {liabilityRatio.toFixed(1)}%
            </p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{
                width: `${liabilityRatio}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Financial position
          </p>

          <p
            className={`text-sm font-semibold ${
              hasPositiveNetWorth
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {hasPositiveNetWorth
              ? "Positive net worth"
              : "Negative net worth"}
          </p>
        </div>
      </div>
    </section>
  );
}