"use client";

import { useEffect, useState } from "react";

import {
  getAccounts,
  type PlaidAccount,
} from "@/services/api/accounts";

type DashboardTransaction = {
  id: string;
  transaction_id: string;
  account_id: string;
  name: string;
  merchant_name: string | null;
  amount: number;
  transaction_date: string;
  pending: boolean;
  personal_finance_primary: string | null;
  personal_finance_detailed: string | null;
  logo_url: string | null;
  website: string | null;
};

type TransactionsResponse = {
  success: boolean;
  transactions: DashboardTransaction[];
  error?: string;
};

export function useDashboardData() {
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [transactions, setTransactions] = useState<
    DashboardTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [accountsResponse, transactionsResponse] =
          await Promise.all([
            getAccounts(),
            fetch("/api/transactions?limit=500", {
              method: "GET",
              cache: "no-store",
            }),
          ]);

        const transactionsData =
          (await transactionsResponse.json()) as TransactionsResponse;

        if (
          !transactionsResponse.ok ||
          !transactionsData.success
        ) {
          throw new Error(
            transactionsData.error ??
              "Failed to fetch transactions",
          );
        }

        if (!cancelled) {
          setAccounts(accountsResponse.accounts ?? []);
          setTransactions(
            transactionsData.transactions ?? [],
          );
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    accounts,
    transactions,
    loading,
    error,
  };
}