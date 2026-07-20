"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Minus,
} from "lucide-react";

import type {
  SpendingAnalysisResult,
  SpendingInsight,
  SpendingInsightType,
} from "@/services/ai/spendingAnalyzer";

interface SpendingInsightsCardProps {
  analysis: SpendingAnalysisResult;
  maxInsights?: number;
}

interface InsightStyle {
  container: string;
  iconContainer: string;
  icon: string;
  badge: string;
  label: string;
}

const INSIGHT_STYLES: Record<
  SpendingInsightType,
  InsightStyle
> = {
  positive: {
    container:
      "border-emerald-200 bg-emerald-50/70",
    iconContainer:
      "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-700",
    badge:
      "bg-emerald-100 text-emerald-700",
    label: "Positive",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50/70",
    iconContainer:
      "bg-amber-100 text-amber-700",
    icon: "text-amber-700",
    badge:
      "bg-amber-100 text-amber-700",
    label: "Watch",
  },
  critical: {
    container:
      "border-red-200 bg-red-50/70",
    iconContainer:
      "bg-red-100 text-red-700",
    icon: "text-red-700",
    badge:
      "bg-red-100 text-red-700",
    label: "Action needed",
  },
  neutral: {
    container:
      "border-slate-200 bg-slate-50",
    iconContainer:
      "bg-slate-200 text-slate-700",
    icon: "text-slate-700",
    badge:
      "bg-slate-200 text-slate-700",
    label: "Insight",
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${Math.abs(value).toFixed(1)}%`;
}

function getSavingsRateStyle(
  savingsRate: number,
): string {
  if (savingsRate >= 20) {
    return "text-emerald-700";
  }

  if (savingsRate >= 10) {
    return "text-amber-700";
  }

  return "text-red-700";
}

function getSpendingChangeIcon(
  spendingChangePercentage: number,
) {
  if (spendingChangePercentage > 0) {
    return (
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 text-red-600"
      />
    );
  }

  if (spendingChangePercentage < 0) {
    return (
      <ArrowDownRight
        aria-hidden="true"
        className="h-4 w-4 text-emerald-600"
      />
    );
  }

  return (
    <Minus
      aria-hidden="true"
      className="h-4 w-4 text-slate-500"
    />
  );
}

function InsightIcon({
  type,
}: {
  type: SpendingInsightType;
}) {
  const iconClassName = "h-5 w-5";

  if (type === "positive") {
    return (
      <CheckCircle2
        aria-hidden="true"
        className={iconClassName}
      />
    );
  }

  if (type === "warning") {
    return (
      <AlertTriangle
        aria-hidden="true"
        className={iconClassName}
      />
    );
  }

  if (type === "critical") {
    return (
      <CircleAlert
        aria-hidden="true"
        className={iconClassName}
      />
    );
  }

  return (
    <Lightbulb
      aria-hidden="true"
      className={iconClassName}
    />
  );
}

function SummaryMetric({
  label,
  value,
  valueClassName = "text-slate-950",
  description,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueClassName}`}
      >
        {value}
      </p>

      {description ? (
        <div className="mt-1 text-xs text-slate-500">
          {description}
        </div>
      ) : null}
    </div>
  );
}

function InsightItem({
  insight,
}: {
  insight: SpendingInsight;
}) {
  const styles = INSIGHT_STYLES[insight.type];

  return (
    <article
      className={`rounded-xl border p-4 ${styles.container}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconContainer}`}
        >
          <InsightIcon type={insight.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-950">
              {insight.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
            >
              {styles.label}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {insight.description}
          </p>

          {(insight.category ||
            insight.percentageChange !== undefined) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.category ? (
                <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {insight.category}
                </span>
              ) : null}

              {insight.percentageChange !==
              undefined ? (
                <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {formatPercentage(
                    insight.percentageChange,
                  )}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SpendingInsightsCard({
  analysis,
  maxInsights = 5,
}: SpendingInsightsCardProps) {
  const visibleInsights = analysis.insights.slice(
    0,
    Math.max(0, maxInsights),
  );

  const hiddenInsightCount = Math.max(
    analysis.insights.length -
      visibleInsights.length,
    0,
  );

  const spendingChangeText =
    analysis.previousTotalSpending > 0
      ? `${formatPercentage(
          analysis.spendingChangePercentage,
        )} vs last month`
      : "No previous month comparison";

  const highestCategory =
    analysis.highestSpendingCategory;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-violet-600">
            AI Spending Analyzer
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Monthly Spending Insights
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Analysis of spending trends, budget
            performance, and estimated savings.
          </p>
        </div>

        <div className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700">
          {analysis.insights.length} insights
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          label="This Month"
          value={formatCurrency(
            analysis.totalSpending,
          )}
          description={
            <div className="flex items-center gap-1">
              {getSpendingChangeIcon(
                analysis.spendingChangePercentage,
              )}

              <span>{spendingChangeText}</span>
            </div>
          }
        />

        <SummaryMetric
          label="Estimated Savings"
          value={formatCurrency(
            analysis.savingsAmount,
          )}
          valueClassName={
            analysis.savingsAmount >= 0
              ? "text-emerald-700"
              : "text-red-700"
          }
        />

        <SummaryMetric
          label="Savings Rate"
          value={`${analysis.savingsRate.toFixed(
            1,
          )}%`}
          valueClassName={getSavingsRateStyle(
            analysis.savingsRate,
          )}
        />

        <SummaryMetric
          label="Largest Category"
          value={
            highestCategory
              ? highestCategory.category
              : "No spending"
          }
          description={
            highestCategory
              ? formatCurrency(
                  highestCategory.currentAmount,
                )
              : undefined
          }
        />
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Priority insights
          </h3>

          {analysis.overBudgetCategories.length >
          0 ? (
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
              {
                analysis.overBudgetCategories
                  .length
              }{" "}
              over budget
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              No categories over budget
            </span>
          )}
        </div>

        {visibleInsights.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {visibleInsights.map((insight) => (
              <InsightItem
                key={insight.id}
                insight={insight}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Lightbulb
              aria-hidden="true"
              className="mx-auto h-7 w-7 text-slate-400"
            />

            <p className="mt-2 font-semibold text-slate-700">
              No spending insights available
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add transaction data to generate
              monthly insights.
            </p>
          </div>
        )}

        {hiddenInsightCount > 0 ? (
          <p className="mt-4 text-center text-sm text-slate-500">
            +{hiddenInsightCount} additional{" "}
            {hiddenInsightCount === 1
              ? "insight"
              : "insights"}
          </p>
        ) : null}
      </div>
    </section>
  );
}