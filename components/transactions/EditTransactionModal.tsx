"use client";

import { useState } from "react";

import TransactionForm from "@/components/transactions/TransactionForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
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

      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={saving}
      >
        Cancel
      </Button>

      <Button
        onClick={() => void handleUpdate()}
        loading={saving}
      >
        Update
      </Button>
    </>
  );

  return (
    <Modal
      open
      title="Edit Transaction"
      onClose={onClose}
      footer={footer}
      size="md"
    >
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
    </Modal>
  );
}