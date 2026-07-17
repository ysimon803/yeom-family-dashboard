"use client";

import { useEffect, useState } from "react";

import {
  getAccounts,
  type PlaidAccount,
} from "@/services/api/accounts";

function formatCurrency(
  amount: number | null | undefined,
  currencyCode = "USD"
): string {
  if (
    amount === null ||
    amount === undefined ||
    !Number.isFinite(Number(amount))
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatAccountType(
  account: PlaidAccount
): string {
  const type =
    account.type?.replaceAll("_", " ") ??
    "account";

  const subtype =
    account.subtype?.replaceAll("_", " ");

  if (!subtype) {
    return type;
  }

  return `${type} · ${subtype}`;
}

function getDisplayBalance(
  account: PlaidAccount
): number | null {
  return (
    account.balances.current ??
    account.balances.available ??
    null
  );
}

function LoadingState() {
  const placeholders = [
    "account-loading-1",
    "account-loading-2",
    "account-loading-3",
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Accounts
        </h2>

        <p className="text-sm text-gray-500">
          Loading connected accounts...
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {placeholders.map((placeholder) => (
          <div
            key={placeholder}
            className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    </section>
  );
}

export default function AccountCards() {
  const [accounts, setAccounts] = useState<
    PlaidAccount[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

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
              : "Unable to load accounts"
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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Unable to load accounts
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (accounts.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Accounts
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          No connected accounts were found.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Accounts
        </h2>

        <p className="text-sm text-gray-500">
          {accounts.length} connected account
          {accounts.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account, index) => {
          const currencyCode =
            account.balances.iso_currency_code ??
            "USD";

          const displayBalance =
            getDisplayBalance(account);

          const accountKey = `${account.account_id}-${index}`;

          return (
            <article
              key={accountKey}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-gray-900">
                    {account.name || "Unnamed account"}
                  </h3>

                  <p className="mt-1 truncate text-sm capitalize text-gray-500">
                    {formatAccountType(account)}
                  </p>
                </div>

                {account.mask && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    •••• {account.mask}
                  </span>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Current balance
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                  {formatCurrency(
                    displayBalance,
                    currencyCode
                  )}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Available
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatCurrency(
                      account.balances.available,
                      currencyCode
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Limit
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatCurrency(
                      account.balances.limit,
                      currencyCode
                    )}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}