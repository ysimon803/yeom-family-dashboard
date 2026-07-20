"use client";

import { useState } from "react";
import {
  Bug,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SpendingInsightsDebugPanelProps {
  transactionApiCount: number;
  normalizedTransactionCount: number;
  budgetApiCount: number;
  normalizedBudgetCount: number;
  latestTransactionDate: Date | null;
  analysisReferenceDate: Date;
  currentMonthTransactionCount: number;
  previousMonthTransactionCount: number;
  ignoredTransactionCount: number;
  duplicateTransactionCount?: number;
}

function formatDate(
  value: Date | null,
): string {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

function DebugMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function SpendingInsightsDebugPanel({
  transactionApiCount,
  normalizedTransactionCount,
  budgetApiCount,
  normalizedBudgetCount,
  latestTransactionDate,
  analysisReferenceDate,
  currentMonthTransactionCount,
  previousMonthTransactionCount,
  ignoredTransactionCount,
  duplicateTransactionCount = 0,
}: SpendingInsightsDebugPanelProps) {
  const [expanded, setExpanded] =
    useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <section className="rounded-xl border border-dashed border-violet-300 bg-violet-50/50">
      <button
        type="button"
        onClick={() => {
          setExpanded((current) => !current);
        }}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Bug
            aria-hidden="true"
            className="h-4 w-4 text-violet-700"
          />

          <div>
            <p className="text-sm font-semibold text-violet-900">
              Spending Analyzer Debug
            </p>

            <p className="text-xs text-violet-700">
              Development mode only
            </p>
          </div>
        </div>

        {expanded ? (
          <ChevronUp
            aria-hidden="true"
            className="h-4 w-4 text-violet-700"
          />
        ) : (
          <ChevronDown
            aria-hidden="true"
            className="h-4 w-4 text-violet-700"
          />
        )}
      </button>

      {expanded ? (
        <div className="border-t border-violet-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DebugMetric
              label="API Transactions"
              value={transactionApiCount}
            />

            <DebugMetric
              label="Normalized Transactions"
              value={normalizedTransactionCount}
            />

            <DebugMetric
              label="API Budgets"
              value={budgetApiCount}
            />

            <DebugMetric
              label="Normalized Budgets"
              value={normalizedBudgetCount}
            />

            <DebugMetric
              label="Latest Transaction"
              value={formatDate(
                latestTransactionDate,
              )}
            />

            <DebugMetric
              label="Analysis Month"
              value={new Intl.DateTimeFormat(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                },
              ).format(
                analysisReferenceDate,
              )}
            />

            <DebugMetric
              label="Current Month Transactions"
              value={
                currentMonthTransactionCount
              }
            />

            <DebugMetric
              label="Previous Month Transactions"
              value={
                previousMonthTransactionCount
              }
            />

            <DebugMetric
              label="Ignored Transactions"
              value={ignoredTransactionCount}
            />

            <DebugMetric
              label="Possible Duplicates"
              value={duplicateTransactionCount}
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            This panel is automatically removed
            from production builds.
          </p>
        </div>
      ) : null}
    </section>
  );
}