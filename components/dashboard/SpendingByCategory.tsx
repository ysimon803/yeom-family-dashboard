"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getTransactions,
  type Transaction,
} from "@/services/api/transactions";

import {
  calculateSpendingByCategory,
  calculateTotalSpending,
} from "@/services/finance/spending";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPreciseCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface TooltipPayloadItem {
  value?: number;
  payload?: {
    category?: string;
    amount?: number;
    transactionCount?: number;
  };
}

interface SpendingTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function SpendingTooltip({
  active,
  payload,
}: SpendingTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-gray-900">
        {item.category ?? "Other"}
      </p>

      <p className="mt-1 text-sm text-gray-700">
        {formatPreciseCurrency(item.amount ?? 0)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {item.transactionCount ?? 0} transactions
      </p>
    </div>
  );
}

export default function SpendingByCategory() {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError(null);

        /*
          최근 거래를 충분히 가져온 뒤
          브라우저에서 최근 30일 거래만 필터링합니다.
        */
        const response = await getTransactions(500);

        if (active) {
          setTransactions(response.transactions ?? []);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load spending data"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () =>
      calculateSpendingByCategory(
        transactions,
        30,
        8
      ),
    [transactions]
  );

  const totalSpending = useMemo(
    () => calculateTotalSpending(categories),
    [categories]
  );

  const largestCategory = categories[0];

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100" />
        <div className="mt-8 h-80 animate-pulse rounded-xl bg-gray-100" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Spending data unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Spending by Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Completed expense transactions from the last 30 days
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-medium text-gray-500">
            Total spending
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatPreciseCurrency(totalSpending)}
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 flex min-h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
          <div>
            <p className="font-medium text-gray-700">
              No spending transactions found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Sync recent Plaid transactions to populate this chart.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={categories}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  bottom: 10,
                  left: 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  tickFormatter={formatCurrency}
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={125}
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />

                <Tooltip
                  content={<SpendingTooltip />}
                  cursor={{
                    fill: "rgba(15, 23, 42, 0.04)",
                  }}
                />

                <Bar
                  dataKey="amount"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={34}
                >
                  {categories.map((category, index) => (
                    <Cell
                      key={category.category}
                      fill={
                        index === 0
                          ? "#2563eb"
                          : "#93c5fd"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <article
                key={category.category}
                className="rounded-xl bg-gray-50 p-4"
              >
                <p className="truncate text-sm font-medium text-gray-600">
                  {category.category}
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatPreciseCurrency(category.amount)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {category.transactionCount} transactions
                </p>
              </article>
            ))}
          </div>

          {largestCategory && totalSpending > 0 && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">
                  {largestCategory.category}
                </span>{" "}
                is your largest spending category at{" "}
                <span className="font-semibold">
                  {formatPreciseCurrency(
                    largestCategory.amount
                  )}
                </span>
                , representing{" "}
                <span className="font-semibold">
                  {Math.round(
                    (largestCategory.amount /
                      totalSpending) *
                      100
                  )}
                  %
                </span>{" "}
                of the displayed spending.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}