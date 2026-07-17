"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getFinancialOverview,
  type FinancialHealthStatus,
  type FinancialOverview as FinancialOverviewData,
} from "@/services/api/overview";

interface OverviewMetricProps {
  label: string;
  value: string;
  description: string;
  valueClassName?: string;
}

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

function getHealthLabel(
  status: FinancialHealthStatus
): string {
  if (status === "strong") {
    return "Strong";
  }

  if (status === "stable") {
    return "Stable";
  }

  return "Needs Attention";
}

function getHealthClassName(
  status: FinancialHealthStatus
): string {
  if (status === "strong") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "stable") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-amber-100 text-amber-700";
}

function OverviewMetric({
  label,
  value,
  description,
  valueClassName = "text-slate-950",
}: OverviewMetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold tracking-tight ${valueClassName}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function FinancialOverview() {
  const [overview, setOverview] =
    useState<FinancialOverviewData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    try {
      setError(null);

      const result = await getFinancialOverview();

      setOverview(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load financial overview"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadOverview();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadOverview]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="h-6 w-48 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-64 rounded bg-slate-200" />
            </div>

            <div className="h-8 w-24 rounded-full bg-slate-200" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !overview) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Financial Overview
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error ?? "Financial overview is unavailable"}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadOverview();
          }}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Try again
        </button>
      </section>
    );
  }

  const positiveCashFlow = overview.cashFlow >= 0;
  const positiveNetWorth = overview.netWorth >= 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current financial position and recent activity
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getHealthClassName(
            overview.financialHealth
          )}`}
        >
          Financial Health:{" "}
          {getHealthLabel(overview.financialHealth)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric
          label="Net Worth"
          value={formatSignedCurrency(overview.netWorth)}
          description="Assets minus liabilities"
          valueClassName={
            positiveNetWorth
              ? "text-slate-950"
              : "text-red-600"
          }
        />

        <OverviewMetric
          label="Investments"
          value={formatCurrency(overview.investments)}
          description="Current portfolio value"
        />

        <OverviewMetric
          label="30-Day Spending"
          value={formatCurrency(overview.spending)}
          description="Recent expense activity"
          valueClassName="text-red-600"
        />

        <OverviewMetric
          label="Cash Flow"
          value={formatSignedCurrency(overview.cashFlow)}
          description={`${overview.savingsRate.toFixed(
            1
          )}% savings rate`}
          valueClassName={
            positiveCashFlow
              ? "text-emerald-600"
              : "text-red-600"
          }
        />
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Assets
          </p>

          <p className="mt-1 text-sm font-semibold text-emerald-700">
            {formatCurrency(overview.assets)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Liabilities
          </p>

          <p className="mt-1 text-sm font-semibold text-red-700">
            {formatCurrency(overview.liabilities)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Savings Rate
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              overview.savingsRate >= 0
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {overview.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </section>
  );
}