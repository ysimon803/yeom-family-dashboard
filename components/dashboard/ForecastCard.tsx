"use client";

import { useMemo } from "react";

import { calculateForecast } from "@/lib/forecast";

interface ForecastCardProps {
  currentNetWorth: number;
  monthlySavings: number;
  expectedAnnualReturn?: number;
  forecastMonths?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export default function ForecastCard({
  currentNetWorth,
  monthlySavings,
  expectedAnnualReturn = 7,
  forecastMonths = 12,
}: ForecastCardProps) {
  const forecast = useMemo(
    () =>
      calculateForecast({
        currentNetWorth,
        monthlySavings,
        expectedAnnualReturn,
        months: forecastMonths,
      }),
    [
      currentNetWorth,
      monthlySavings,
      expectedAnnualReturn,
      forecastMonths,
    ],
  );

  const projectedGrowth =
    currentNetWorth > 0
      ? ((forecast.projectedNetWorth -
          currentNetWorth) /
          currentNetWorth) *
        100
      : 0;

  const chartPoints = useMemo(() => {
    if (forecast.points.length === 0) {
      return [];
    }

    const values = [
      currentNetWorth,
      ...forecast.points.map(
        (point) => point.netWorth,
      ),
    ];

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const range = Math.max(maximum - minimum, 1);

    return values.map((value, index) => {
      const x =
        values.length === 1
          ? 0
          : (index / (values.length - 1)) * 100;

      const y =
        100 - ((value - minimum) / range) * 100;

      return `${x},${y}`;
    });
  }, [currentNetWorth, forecast.points]);

  const linePoints = chartPoints.join(" ");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-600">
            Wealth Forecast
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Net Worth Projection
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Estimated using your current net worth,
            monthly savings, and an annual return of{" "}
            {formatPercentage(expectedAnnualReturn)}.
          </p>
        </div>

        <div className="w-fit rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
          {forecastMonths} Months
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Current Net Worth
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(currentNetWorth)}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Starting value
          </p>
        </article>

        <article className="rounded-xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-sm font-medium text-violet-700">
            Projected Net Worth
          </p>

          <p className="mt-2 text-2xl font-bold text-violet-950">
            {formatCurrency(
              forecast.projectedNetWorth,
            )}
          </p>

          <p className="mt-2 text-xs text-violet-700">
            {projectedGrowth >= 0 ? "+" : ""}
            {formatPercentage(projectedGrowth)} projected
            growth
          </p>
        </article>

        <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">
            Savings Added
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-950">
            {formatCurrency(
              forecast.totalContributions,
            )}
          </p>

          <p className="mt-2 text-xs text-emerald-700">
            {formatCurrency(monthlySavings)} per month
          </p>
        </article>

        <article className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">
            Investment Growth
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-950">
            {formatCurrency(
              forecast.investmentGrowth,
            )}
          </p>

          <p className="mt-2 text-xs text-blue-700">
            Estimated market growth
          </p>
        </article>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Projection Trend
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Month-by-month estimated net worth
            </p>
          </div>

          <p className="text-sm font-semibold text-violet-700">
            {formatCurrency(
              forecast.projectedNetWorth -
                currentNetWorth,
            )}{" "}
            increase
          </p>
        </div>

        <div className="mt-5 h-48 w-full overflow-hidden">
          {linePoints ? (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              role="img"
              aria-label="Projected net worth growth chart"
            >
              <polyline
                points={linePoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="text-violet-600"
              />
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Forecast data is unavailable.
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Today</span>
          <span>{forecastMonths} months</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Forecasts are estimates and actual investment
        returns may vary.
      </p>
    </section>
  );
}