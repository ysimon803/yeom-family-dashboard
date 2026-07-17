"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getNetWorthTrend,
  type NetWorthHistoryPoint,
} from "@/services/api/netWorthHistory";

interface ChartDataPoint {
  month: string;
  fullDate: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

interface TooltipEntry {
  name?: string;
  value?: number | string;
}

interface NetWorthTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function formatCurrency(
  value: number
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(
  value: number
): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMonth(
  dateValue: string
): string {
  const date = new Date(
    `${dateValue}T00:00:00`
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function formatFullDate(
  dateValue: string
): string {
  const date = new Date(
    `${dateValue}T00:00:00`
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function CustomTooltip({
  active,
  payload,
  label,
}: NetWorthTooltipProps) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="text-sm font-semibold text-slate-950">
        {label}
      </p>

      <div className="mt-3 space-y-2">
        {payload.map((entry) => {
          const numericValue =
            typeof entry.value === "number"
              ? entry.value
              : Number(entry.value ?? 0);

          return (
            <div
              key={entry.name}
              className="flex min-w-48 items-center justify-between gap-6"
            >
              <span className="text-xs text-slate-500">
                {entry.name}
              </span>

              <span className="text-xs font-semibold text-slate-900">
                {formatCurrency(numericValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NetWorthTrend() {
  const [history, setHistory] = useState<
    NetWorthHistoryPoint[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadHistory =
    useCallback(async () => {
      try {
        setError(null);

        const result =
          await getNetWorthTrend(12);

        setHistory(result);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load net worth history"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        void loadHistory();
      },
      0
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHistory]);

  const chartData =
    useMemo<ChartDataPoint[]>(
      () =>
        history.map((point) => ({
          month: formatMonth(
            point.snapshotDate
          ),
          fullDate: formatFullDate(
            point.snapshotDate
          ),
          assets: point.assets,
          liabilities: point.liabilities,
          netWorth: point.netWorth,
        })),
      [history]
    );

  const currentNetWorth =
    history.at(-1)?.netWorth ?? 0;

  const previousNetWorth =
    history.at(-2)?.netWorth ?? null;

  const netWorthChange =
    previousNetWorth === null
      ? null
      : currentNetWorth -
        previousNetWorth;

  const netWorthChangePercent =
    previousNetWorth === null ||
    previousNetWorth === 0
      ? null
      : (netWorthChange! /
          Math.abs(previousNetWorth)) *
        100;

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-44 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
          <div className="mt-6 h-80 rounded-xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Net Worth Trend
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadHistory();
          }}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Try again
        </button>
      </section>
    );
  }

  if (chartData.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Net Worth Trend
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          No net worth history is available yet.
        </p>
      </section>
    );
  }

  const positiveChange =
    (netWorthChange ?? 0) >= 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Net Worth Trend
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {formatCurrency(
              currentNetWorth
            )}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assets, liabilities, and net
            worth over the last 12 months
          </p>
        </div>

        {netWorthChange !== null && (
          <div
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              positiveChange
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {positiveChange ? "+" : ""}
            {formatCurrency(
              netWorthChange
            )}

            {netWorthChangePercent !==
              null && (
              <>
                {" "}
                (
                {positiveChange
                  ? "+"
                  : ""}
                {netWorthChangePercent.toFixed(
                  1
                )}
                %)
              </>
            )}
          </div>
        )}
      </div>

      {chartData.length === 1 && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            The first monthly snapshot has
            been saved. The trend line will
            become more meaningful as future
            monthly records are added.
          </p>
        </div>
      )}

      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              tickFormatter={
                formatCompactCurrency
              }
              tickLine={false}
              axisLine={false}
              width={72}
              tick={{
                fontSize: 12,
              }}
            />

            <Tooltip
              content={
                <CustomTooltip />
              }
              labelFormatter={(
                _label,
                payload
              ) => {
                const chartPoint =
                  payload?.[0]
                    ?.payload as
                    | ChartDataPoint
                    | undefined;

                return (
                  chartPoint?.fullDate ??
                  ""
                );
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                paddingTop: 16,
              }}
            />

            <Line
              type="monotone"
              dataKey="assets"
              name="Assets"
              stroke="#10b981"
              strokeWidth={2}
              dot={{
                r: 3,
              }}
              activeDot={{
                r: 5,
              }}
            />

            <Line
              type="monotone"
              dataKey="liabilities"
              name="Liabilities"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{
                r: 3,
              }}
              activeDot={{
                r: 5,
              }}
            />

            <Line
              type="monotone"
              dataKey="netWorth"
              name="Net Worth"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}