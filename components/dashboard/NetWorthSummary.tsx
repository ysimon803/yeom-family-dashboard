"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

import { getAccounts } from "@/services/api/accounts";

import {
  calculateNetWorth,
  type NetWorthSummary as NetWorthSummaryData,
} from "@/services/finance/netWorth";

const EMPTY_SUMMARY: NetWorthSummaryData = {
  assets: 0,
  liabilities: 0,
  netWorth: 0,
  assetAccountCount: 0,
  liabilityAccountCount: 0,
};

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  valueClassName: string;
}

function SummaryCard({
  title,
  value,
  description,
  valueClassName,
}: SummaryCardProps) {
  const isNegative = value < 0;

  return (
    <article
      className={[
        "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg",
      ].join(" ")}
    >
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p
        className={[
          "mt-2 text-2xl font-bold tracking-tight sm:text-3xl",
          valueClassName,
        ].join(" ")}
      >
        {isNegative && "-"}$
        <CountUp
          start={0}
          end={Math.abs(value)}
          duration={1.4}
          separator=","
          decimals={2}
          decimal="."
          preserveValue
        />
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </article>
  );
}

async function saveNetWorthSnapshot(
  summary: NetWorthSummaryData
): Promise<void> {
  const response = await fetch(
    "/api/networth/snapshot",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        netWorth: summary.netWorth,
        assets: summary.assets,
        liabilities: summary.liabilities,
      }),
    }
  );

  if (!response.ok) {
    const result = await response
      .json()
      .catch(() => null);

    throw new Error(
      result?.error ??
        "Unable to save net worth snapshot"
    );
  }
}

export default function NetWorthSummary() {
  const [summary, setSummary] =
    useState<NetWorthSummaryData>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [snapshotStatus, setSnapshotStatus] =
    useState<
      "idle" | "saving" | "saved" | "error"
    >("idle");

  useEffect(() => {
    let active = true;

    async function loadNetWorth() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAccounts();

        const loadedAccounts =
          response.accounts ?? [];

        const calculatedSummary =
          calculateNetWorth(loadedAccounts);

        if (!active) {
          return;
        }

        setSummary(calculatedSummary);
        setSnapshotStatus("saving");

        try {
          await saveNetWorthSnapshot(
            calculatedSummary
          );

          if (active) {
            setSnapshotStatus("saved");

            window.dispatchEvent(
              new CustomEvent(
                "wealthos:networth-snapshot-saved"
              )
            );
          }
        } catch (snapshotError) {
          console.error(
            "Snapshot save failed:",
            snapshotError
          );

          if (active) {
            setSnapshotStatus("error");
          }
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load net worth"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadNetWorth();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section aria-label="Loading net worth summary">
        <div className="mb-4">
          <div className="h-6 w-44 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded-md bg-gray-100" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 h-8 w-40 animate-pulse rounded bg-gray-200" />

              <div className="mt-4 h-3 w-28 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Net worth unavailable
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Net Worth Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Total assets minus connected liabilities
          </p>
        </div>

        <div
          aria-live="polite"
          className="min-h-5 text-xs text-gray-400"
        >
          {snapshotStatus === "saving" &&
            "Saving today’s snapshot..."}

          {snapshotStatus === "saved" &&
            "Today’s snapshot saved"}

          {snapshotStatus === "error" &&
            "Snapshot could not be saved"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Assets"
          value={summary.assets}
          description={`${summary.assetAccountCount} asset accounts`}
          valueClassName="text-emerald-600"
        />

        <SummaryCard
          title="Total Liabilities"
          value={summary.liabilities}
          description={`${summary.liabilityAccountCount} liability accounts`}
          valueClassName="text-red-600"
        />

        <SummaryCard
          title="Net Worth"
          value={summary.netWorth}
          description="Assets minus liabilities"
          valueClassName={
            summary.netWorth >= 0
              ? "text-blue-600"
              : "text-red-600"
          }
        />
      </div>
    </section>
  );
}