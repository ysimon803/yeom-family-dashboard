"use client";

import { useState } from "react";

import { addTransaction } from "@/services/transactions/addTransaction";
import TransactionForm from "@/components/transactions/TransactionForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function AddTransactionModal({
  open,
  onClose,
  onSaved,
}: Props) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
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
      await addTransaction({
        date,
        type,
        category,
        description,
        amount: Number(amount),
      });

      onSaved();
      onClose();

      setDate("");
      setType("expense");
      setCategory("");
      setDescription("");
      setAmount("");
    } catch (error) {
      console.error(error);
      alert("Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Add Transaction
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
            setType={setType}
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
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}