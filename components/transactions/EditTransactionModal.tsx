"use client";

import { useEffect, useState } from "react";

import TransactionForm from "@/components/transactions/TransactionForm";
import { updateTransaction } from "@/services/transactions/updateTransaction";
import type { Transaction } from "@/types/transaction";

type Props = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
  onSaved,
}: Props) {
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!transaction) return;

    setDate(transaction.date);
    setType(transaction.type);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setAmount(String(transaction.amount));
  }, [transaction]);

  if (!open || !transaction) {
    return null;
  }

  async function handleUpdate() {
    if (!transaction) return;

    if (!date || !category || !description || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(amount) <= 0) {
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
        amount: Number(amount),
      });

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Transaction
          </h2>

          <button
            onClick={onClose}
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
            setType={(value) => setType(value as "income" | "expense")}
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
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
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