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
  calculateCashFlow,
  type CashFlowSummary,
} from "@/services/finance/cashFlow";

const EMPTY_CASH_FLOW: CashFlowSummary = {
  income: 0,
  expenses: 0,
  netCashFlow: 0,
  incomeTransactionCount: 0,
  expenseTransactionCount: 0,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

interface SummaryCardProps {
  title: string;
  amount: number;
  description: string;
  amountClassName: string;
  showPositiveSign?: boolean;
}

function SummaryCard({
  title,
  amount,
  description,
  amountClassName,
  showPositiveSign = false,
}: SummaryCardProps) {
  const prefix =
    showPositiveSign && amount > 0 ? "+" : "";

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold tracking-tight ${amountClassName}`}
      >
        {prefix}
        {formatCurrency(amount)}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {description}
      </p>
    </article>
  );
}

interface TooltipPayloadItem {
  value?: number;
  payload?: {
    name?: string;
    amount?: number;
  };
}

interface CashFlowTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CashFlowTooltip({
  active,
  payload,
}: CashFlowTooltipProps) {
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
        {item.name}
      </p>

      <p className="mt-1 text-sm text-gray-700">
        {formatCurrency(item.amount ?? 0)}
      </p>
    </div>
  );
}

export default function MonthlyCashFlow() {
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

        const response = await getTransactions(500);

        if (active) {
          setTransactions(response.transactions ?? []);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load cash flow data"
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

  const cashFlow = useMemo(() => {
    if (transactions.length === 0) {
      return EMPTY_CASH_FLOW;
    }

    return calculateCashFlow(transactions, 30);
  }, [transactions]);

  const chartData = useMemo(
    () => [
      {
        name: "Income",
        amount: cashFlow.income,
      },
      {
        name: "Expenses",
        amount: cashFlow.expenses,
      },
    ],
    [cashFlow]
  );

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-44 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="mt-6 h-72 animate-pulse rounded-xl bg-gray-100" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Cash flow unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Monthly Cash Flow
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Income and expenses from completed transactions
          during the last 30 days
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Income"
          amount={cashFlow.income}
          description={`${cashFlow.incomeTransactionCount} income transactions`}
          amountClassName="text-emerald-600"
        />

        <SummaryCard
          title="Expenses"
          amount={cashFlow.expenses}
          description={`${cashFlow.expenseTransactionCount} expense transactions`}
          amountClassName="text-red-600"
        />

        <SummaryCard
          title="Net Cash Flow"
          amount={cashFlow.netCashFlow}
          description={
            cashFlow.netCashFlow >= 0
              ? "Positive cash flow"
              : "Expenses exceeded income"
          }
          amountClassName={
            cashFlow.netCashFlow >= 0
              ? "text-blue-600"
              : "text-red-600"
          }
          showPositiveSign
        />
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {cashFlow.income === 0 &&
        cashFlow.expenses === 0 ? (
          <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
            <div>
              <p className="font-medium text-gray-700">
                No recent cash flow data
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Sync recent Plaid transactions to display
                income and expenses.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-72 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={13}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatCompactCurrency}
                    fontSize={12}
                  />

                  <Tooltip
                    content={<CashFlowTooltip />}
                    cursor={{
                      fill: "rgba(15, 23, 42, 0.04)",
                    }}
                  />

                  <Bar
                    dataKey="amount"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={120}
                  >
                    {chartData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={
                          item.name === "Income"
                            ? "#10b981"
                            : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`mt-5 rounded-xl border px-4 py-3 ${
                cashFlow.netCashFlow >= 0
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <p
                className={`text-sm ${
                  cashFlow.netCashFlow >= 0
                    ? "text-emerald-900"
                    : "text-red-900"
                }`}
              >
                {cashFlow.netCashFlow >= 0 ? (
                  <>
                    You retained{" "}
                    <span className="font-semibold">
                      {formatCurrency(
                        cashFlow.netCashFlow
                      )}
                    </span>{" "}
                    after expenses during the displayed
                    period.
                  </>
                ) : (
                  <>
                    Expenses exceeded incoming funds by{" "}
                    <span className="font-semibold">
                      {formatCurrency(
                        Math.abs(
                          cashFlow.netCashFlow
                        )
                      )}
                    </span>{" "}
                    during the displayed period.
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-900">
          Plaid negative transactions are currently treated as
          income. Refunds, credit-card payments, and account
          transfers may therefore affect this preliminary cash-flow
          total. Transaction classification will be refined in a
          later step.
        </p>
      </div>
    </section>
  );
}