"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface NetWorthHistoryRow {
  id: string;
  user_id: string;
  snapshot_date: string;
  net_worth: number | string;
  assets: number | string;
  liabilities: number | string;
  created_at: string;
}

interface NetWorthHistoryResponse {
  success: boolean;
  history?: NetWorthHistoryRow[];
  error?: string;
}

interface NetWorthChartItem {
  id: string;
  date: string;
  netWorth: number;
  assets: number;
  liabilities: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(
  amount: number
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function formatChartDate(date: string): string {
  const parsedDate = new Date(
    `${date}T12:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function formatFullDate(date: string): string {
  const parsedDate = new Date(
    `${date}T12:00:00`
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}

function toNumber(
  value: number | string | null | undefined
): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function calculatePercentageChange(
  current: number,
  previous: number
): number | null {
  if (previous === 0) {
    return null;
  }

  return (
    ((current - previous) /
      Math.abs(previous)) *
    100
  );
}

interface TooltipPayloadItem {
  payload?: NetWorthChartItem;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function TrendTooltip({
  active,
  payload,
}: TrendTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="min-w-52 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {formatFullDate(item.date)}
      </p>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-6">
          <span className="text-gray-500">
            Net Worth
          </span>

          <span className="font-semibold text-blue-600">
            {formatCurrency(item.netWorth)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-gray-500">
            Assets
          </span>

          <span className="font-medium text-emerald-600">
            {formatCurrency(item.assets)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-gray-500">
            Liabilities
          </span>

          <span className="font-medium text-red-600">
            {formatCurrency(
              item.liabilities
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  const loadingItems = [
    "loading-assets",
    "loading-liabilities",
    "loading-snapshots",
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />

      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {loadingItems.map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>

      <div className="mt-6 h-80 animate-pulse rounded-xl bg-gray-100" />
    </section>
  );
}

export default function NetWorthTrend() {
  const [history, setHistory] = useState<
    NetWorthHistoryRow[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const loadHistory = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError(null);

        const response = await fetch(
          "/api/networth/history",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as NetWorthHistoryResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ??
              "Unable to load net worth history"
          );
        }

        setHistory(result.history ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load net worth history"
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    function handleSnapshotSaved() {
      loadHistory(false);
    }

    window.addEventListener(
      "wealthos:networth-snapshot-saved",
      handleSnapshotSaved
    );

    return () => {
      window.removeEventListener(
        "wealthos:networth-snapshot-saved",
        handleSnapshotSaved
      );
    };
  }, [loadHistory]);

  const chartData = useMemo<
    NetWorthChartItem[]
  >(() => {
    return history
      .map((item) => ({
        id: item.id,
        date: item.snapshot_date,
        netWorth: toNumber(item.net_worth),
        assets: toNumber(item.assets),
        liabilities: toNumber(
          item.liabilities
        ),
      }))
      .sort(
        (first, second) =>
          new Date(first.date).getTime() -
          new Date(second.date).getTime()
      );
  }, [history]);

  const currentItem =
    chartData.at(-1) ?? null;

  const previousItem =
    chartData.length >= 2
      ? chartData.at(-2) ?? null
      : null;

  const netWorthChange =
    currentItem && previousItem
      ? currentItem.netWorth -
        previousItem.netWorth
      : null;

  const percentageChange =
    currentItem && previousItem
      ? calculatePercentageChange(
          currentItem.netWorth,
          previousItem.netWorth
        )
      : null;

  const isPositive =
    (netWorthChange ?? 0) >= 0;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Net worth trend unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadHistory()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Net Worth Trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Historical daily net worth snapshots
          </p>
        </div>

        {currentItem && (
          <div className="lg:text-right">
            <p className="text-sm font-medium text-gray-500">
              Current Net Worth
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(
                currentItem.netWorth
              )}
            </p>

            {netWorthChange !== null && (
              <p
                className={`mt-1 text-sm font-medium ${
                  isPositive
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {isPositive ? "▲" : "▼"}{" "}
                {isPositive ? "+" : ""}
                {formatCurrency(netWorthChange)}

                {percentageChange !== null && (
                  <>
                    {" "}
                    (
                    {percentageChange >= 0
                      ? "+"
                      : ""}
                    {percentageChange.toFixed(2)}
                    %)
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="mt-8 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
          <div>
            <p className="font-medium text-gray-700">
              No net worth history yet
            </p>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              Open the dashboard after your accounts
              load. WealthOS will save one net worth
              snapshot per day.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Latest Assets
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-600">
                {formatCurrency(
                  currentItem?.assets ?? 0
                )}
              </p>
            </article>

            <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Latest Liabilities
              </p>

              <p className="mt-2 text-lg font-bold text-red-600">
                {formatCurrency(
                  currentItem?.liabilities ?? 0
                )}
              </p>
            </article>

            <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Snapshots
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {chartData.length}
              </p>
            </article>
          </div>

          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  bottom: 5,
                  left: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  minTickGap={24}
                  tickFormatter={formatChartDate}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickFormatter={
                    formatCompactCurrency
                  }
                  width={72}
                />

                <Tooltip
                  content={<TrendTooltip />}
                />

                <Line
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#2563eb",
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length === 1 && (
            <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-900">
                The first snapshot has been saved.
                Return on another day to begin seeing
                a historical trend and percentage
                change.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}