"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  getSpendingCategorySummary,
  type SpendingCategoryItem,
  type SpendingCategorySummary,
} from "@/services/api/spending";

const CHART_COLORS = [
  "#0f172a",
  "#2563eb",
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#64748b",
];

const EMPTY_SUMMARY: SpendingCategorySummary = {
  totalSpending: 0,
  transactionCount: 0,
  categories: [],
  periodStart: "",
  periodEnd: "",
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SpendingCategoryItem;
  }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateRangeDate(value: string): string {
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

function SpendingTooltip({
  active,
  payload,
}: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-900">
        {item.category}
      </p>

      <p className="mt-1 text-sm text-slate-600">
        {formatCurrency(item.amount)}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        {item.percentage.toFixed(1)}% ·{" "}
        {item.transactionCount}{" "}
        {item.transactionCount === 1
          ? "transaction"
          : "transactions"}
      </p>
    </div>
  );
}

export default function SpendingByCategoryChart() {
  const [summary, setSummary] =
    useState<SpendingCategorySummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setError(null);

      const result = await getSpendingCategorySummary(30);

      setSummary(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load spending data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSummary();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadSummary]);

  const chartData = useMemo(
    () => summary.categories.slice(0, 8),
    [summary.categories]
  );

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-9 w-36 rounded bg-slate-200" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="mx-auto h-52 w-52 rounded-full bg-slate-100" />

            <div className="space-y-3">
              <div className="h-12 rounded-xl bg-slate-100" />
              <div className="h-12 rounded-xl bg-slate-100" />
              <div className="h-12 rounded-xl bg-slate-100" />
              <div className="h-12 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Spending by Category
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadSummary();
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
            Spending by Category
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {formatCurrency(summary.totalSpending)}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {summary.transactionCount} expenses over the last
            30 days
          </p>
        </div>

        {summary.periodStart && summary.periodEnd ? (
          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            {formatDateRangeDate(summary.periodStart)}
            {" – "}
            {formatDateRangeDate(summary.periodEnd)}
          </div>
        ) : null}
      </div>

      {chartData.length > 0 ? (
        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[240px_1fr]">
          <div className="relative mx-auto h-56 w-full max-w-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={94}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={
                        CHART_COLORS[
                          index % CHART_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip content={<SpendingTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total
              </span>

              <span className="mt-1 text-lg font-bold text-slate-950">
                {formatCurrency(summary.totalSpending)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[
                          index % CHART_COLORS.length
                        ],
                    }}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.category}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.percentage.toFixed(1)}% ·{" "}
                      {item.transactionCount} transactions
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-semibold text-slate-950">
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No spending data found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Add expense transactions to display category
            analytics.
          </p>
        </div>
      )}
    </section>
  );
}