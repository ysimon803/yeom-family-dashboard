"use client";

import { useEffect, useMemo, useState } from "react";

import { calculateForecast } from "@/lib/forecast";
import {
  getHousePlannerSummary,
  type HousePlannerSummary,
} from "@/services/api/housePlanner";

interface HousePlannerCardProps {
  currentSavings?: number;
  targetHomePrice?: number;
  downPaymentPercent?: number;
  monthlySavings?: number;
  expectedAnnualReturn?: number;
  monthsUntilPurchase?: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function hasCompleteProps(
  props: HousePlannerCardProps,
): props is Required<HousePlannerCardProps> {
  return (
    props.currentSavings !== undefined &&
    props.targetHomePrice !== undefined &&
    props.downPaymentPercent !== undefined &&
    props.monthlySavings !== undefined &&
    props.expectedAnnualReturn !== undefined &&
    props.monthsUntilPurchase !== undefined
  );
}

export default function HousePlannerCard(
  props: HousePlannerCardProps,
) {
  const hasProvidedData = hasCompleteProps(props);

  const [fetchedSummary, setFetchedSummary] =
    useState<HousePlannerSummary | null>(null);

  const [loading, setLoading] = useState(
    !hasProvidedData,
  );

  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (hasProvidedData) {
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      try {
        const result =
          await getHousePlannerSummary();

        if (!cancelled) {
          setFetchedSummary(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load house planner",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [hasProvidedData]);

  const providedSummary = useMemo<
    HousePlannerSummary | null
  >(() => {
    if (!hasProvidedData) {
      return null;
    }

    return {
      currentSavings: props.currentSavings,
      targetHomePrice: props.targetHomePrice,
      downPaymentPercent:
        props.downPaymentPercent,
      monthlySavings: props.monthlySavings,
      monthsUntilPurchase:
        props.monthsUntilPurchase,
    };
  }, [
    hasProvidedData,
    props.currentSavings,
    props.downPaymentPercent,
    props.monthlySavings,
    props.monthsUntilPurchase,
    props.targetHomePrice,
  ]);

  const summary =
    providedSummary ?? fetchedSummary;

  const expectedAnnualReturn =
    props.expectedAnnualReturn ?? 7;

  const forecast = useMemo(() => {
    if (!summary) {
      return null;
    }

    return calculateForecast({
      currentNetWorth: summary.currentSavings,
      monthlySavings: summary.monthlySavings,
      expectedAnnualReturn,
      months: summary.monthsUntilPurchase,
    });
  }, [expectedAnnualReturn, summary]);

  if (loading && !hasProvidedData) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />

          <div className="mt-3 h-8 w-52 rounded bg-slate-200" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !summary || !forecast) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          House Planner
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error ??
            "House planner data is unavailable"}
        </p>
      </section>
    );
  }

  const targetDownPayment =
    summary.targetHomePrice *
    (summary.downPaymentPercent / 100);

  const projectedSavings =
    forecast.projectedNetWorth;

  const rawProgress =
    targetDownPayment > 0
      ? (projectedSavings / targetDownPayment) *
        100
      : 0;

  const progress = Math.min(
    Math.max(rawProgress, 0),
    100,
  );

  const onTrack =
    projectedSavings >= targetDownPayment;

  const remainingAmount = Math.max(
    targetDownPayment - projectedSavings,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            House Planner
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Future Home Goal
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Projection based on your current savings
            and cash flow
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
            onTrack
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {onTrack
            ? "On Track"
            : "Needs Attention"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Target Home"
          value={formatCurrency(
            summary.targetHomePrice,
          )}
        />

        <Metric
          title={`${summary.downPaymentPercent}% Down Payment`}
          value={formatCurrency(
            targetDownPayment,
          )}
        />

        <Metric
          title="Current Savings"
          value={formatCurrency(
            summary.currentSavings,
          )}
        />

        <Metric
          title={`Projected in ${summary.monthsUntilPurchase} Months`}
          value={formatCurrency(
            projectedSavings,
          )}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-slate-700">
            Goal progress
          </span>

          <span className="font-semibold text-slate-950">
            {progress.toFixed(1)}%
          </span>
        </div>

        <div
          className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200"
          aria-label={`House down payment progress ${progress.toFixed(
            1,
          )}%`}
        >
          <div
            className={`h-full rounded-full transition-all ${
              onTrack
                ? "bg-emerald-600"
                : "bg-blue-600"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Monthly Savings
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-950">
            {formatCurrency(
              summary.monthlySavings,
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Remaining
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              remainingAmount === 0
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {formatCurrency(remainingAmount)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Timeline
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-950">
            {summary.monthsUntilPurchase} months
          </p>
        </div>
      </div>
    </section>
  );
}