"use client";

import { useState } from "react";

import TransactionForm from "@/components/transactions/TransactionForm";
import { updateTransaction } from "@/services/transactions/updateTransaction";

import type { Transaction } from "@/types/transaction";

type TransactionType = "income" | "expense";

type Props = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSaved: () => void;
};

type EditTransactionFormProps = {
  transaction: Transaction;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
  onSaved,
}: Props) {
  if (!open || !transaction) {
    return null;
  }

  return (
    <EditTransactionForm
      key={transaction.id}
      transaction={transaction}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function EditTransactionForm({
  transaction,
  onClose,
  onSaved,
}: EditTransactionFormProps) {
  const [date, setDate] = useState(transaction.date);
  const [type, setType] = useState<TransactionType>(
    transaction.type
  );
  const [category, setCategory] = useState(
    transaction.category
  );
  const [description, setDescription] = useState(
    transaction.description
  );
  const [amount, setAmount] = useState(
    String(transaction.amount)
  );
  const [saving, setSaving] = useState(false);

  function handleTypeChange(value: string) {
    if (value === "income" || value === "expense") {
      setType(value);
    }
  }

  async function handleUpdate() {
    if (!date || !category || !description || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    setSaving(true);

    try {
      await updateTransaction(transaction.id, {
        date,
        type,
        category,
        description,
        amount: numericAmount,
      });

      alert("✅ Transaction updated successfully.");

      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Transaction
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit transaction modal"
            className="text-2xl text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="mt-8">
          <TransactionForm
            date={date}
            setDate={setDate}
            type={type}
            setType={handleTypeChange}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border px-5 py-3 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleUpdate()}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}