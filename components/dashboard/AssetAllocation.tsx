"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  getAccounts,
  type PlaidAccount,
} from "@/services/api/accounts";

import {
  calculateAssetAllocation,
  type AssetAllocationItem,
} from "@/services/finance/assetAllocation";

const CHART_COLORS = [
  "#2563eb",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#64748b",
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface TooltipPayloadItem {
  payload?: AssetAllocationItem;
}

interface AssetAllocationTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function AssetAllocationTooltip({
  active,
  payload,
}: AssetAllocationTooltipProps) {
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
        {item.category}
      </p>

      <p className="mt-1 text-sm text-gray-700">
        {formatCurrency(item.amount)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {item.percentage}% · {item.accountCount}{" "}
        {item.accountCount === 1
          ? "account"
          : "accounts"}
      </p>
    </div>
  );
}

export default function AssetAllocation() {
  const [accounts, setAccounts] = useState<
    PlaidAccount[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let active = true;

    async function loadAccounts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAccounts();

        if (active) {
          setAccounts(response.accounts ?? []);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load asset allocation"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAccounts();

    return () => {
      active = false;
    };
  }, []);

  const allocation = useMemo(
    () => calculateAssetAllocation(accounts),
    [accounts]
  );

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-44 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="mx-auto h-72 w-72 animate-pulse rounded-full bg-gray-100" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Asset allocation unavailable
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
            Asset Allocation
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of currently connected asset
            accounts
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-medium text-gray-500">
            Total connected assets
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatCurrency(allocation.totalAssets)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {allocation.totalAccounts} asset{" "}
            {allocation.totalAccounts === 1
              ? "account"
              : "accounts"}
          </p>
        </div>
      </div>

      {allocation.items.length === 0 ? (
        <div className="mt-8 flex min-h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
          <div>
            <p className="font-medium text-gray-700">
              No asset accounts found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Connect a checking, savings, or investment
              account to display asset allocation.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative mx-auto h-80 w-full max-w-md">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={allocation.items}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={125}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {allocation.items.map(
                    (item, index) => (
                      <Cell
                        key={item.category}
                        fill={
                          CHART_COLORS[
                            index %
                              CHART_COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  content={
                    <AssetAllocationTooltip />
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Total Assets
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatCurrency(
                    allocation.totalAssets
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {allocation.items.map((item, index) => (
              <article
                key={item.category}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 flex-none rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[
                          index %
                            CHART_COLORS.length
                        ],
                    }}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.category}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.accountCount}{" "}
                      {item.accountCount === 1
                        ? "account"
                        : "accounts"}
                    </p>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </p>

                  <p className="text-xs font-medium text-gray-500">
                    {item.percentage}%
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-900">
          Credit cards and loans are excluded from asset
          allocation. Retirement accounts, property, RSUs,
          stock options, and manually entered assets will be
          included in a later step.
        </p>
      </div>
    </section>
  );
}