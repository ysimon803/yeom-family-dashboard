"use client";

import { useEffect, useState } from "react";
import { getTransactions, Transaction } from "@/services/api/transactions";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTransactions(10);
        setTransactions(data.transactions);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border p-6">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Recent Transactions
      </h2>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.transaction_id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <div className="font-medium">
                {tx.merchant_name || tx.name}
              </div>

              <div className="text-sm text-gray-500">
                {tx.date}
              </div>
            </div>

            <div
              className={
                tx.amount < 0
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {tx.amount < 0 ? "+" : "-"}$
              {Math.abs(tx.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}