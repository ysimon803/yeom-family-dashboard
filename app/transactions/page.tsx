"use client";

import { useEffect, useMemo, useState } from "react";

import TransactionList from "@/components/transactions/TransactionList";
import TransactionSummaryCard from "@/components/transactions/TransactionSummaryCard";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";

import { getTransactions } from "@/services/transactions/getTransactions";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import type { Transaction } from "@/types/transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();

    return transactions.filter((t) => {
      const matchesSearch =
        t.category.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword);

      const matchesType =
        typeFilter === "all" ||
        t.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            💵 Transactions
          </h1>

          <p className="mt-2 text-slate-500">
            Income and expense management
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Transaction
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border p-3"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <TransactionSummaryCard
        transactions={filteredTransactions}
      />

      <TransactionList
        transactions={filteredTransactions}
        onDeleted={loadTransactions}
        onEdit={(transaction) => {
            setEditingTransaction(transaction);
        }}
        />

      <AddTransactionModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={loadTransactions}
      />

      <EditTransactionModal
        open={editingTransaction !== null}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSaved={() => {
            loadTransactions();
            setEditingTransaction(null);
        }}
        />
    </div>
  );
}