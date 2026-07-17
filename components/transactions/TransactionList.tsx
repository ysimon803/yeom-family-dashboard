"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { deleteTransaction } from "@/services/transactions/deleteTransaction";

import type { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
  onDeleted: () => void;
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionList({
  transactions,
  onDeleted,
  onEdit,
}: Props) {
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  function closeDeleteDialog() {
    if (deleting) {
      return;
    }

    setTransactionToDelete(null);
  }

  async function handleDelete() {
    if (!transactionToDelete || deleting) {
      return;
    }

    setDeleting(true);

    try {
      await deleteTransaction(
        transactionToDelete.id
      );

      setTransactionToDelete(null);
      onDeleted();
    } catch (error) {
      console.error(
        "Failed to delete transaction:",
        error
      );

      alert("Failed to delete transaction.");
    } finally {
      setDeleting(false);
    }
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="No transactions found"
        description="Add a transaction or change your current search and filter settings."
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-2xl font-bold">
          📋 Transaction History
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3">
                  Date
                </th>

                <th className="pb-3">
                  Category
                </th>

                <th className="pb-3">
                  Description
                </th>

                <th className="pb-3 text-right">
                  Amount
                </th>

                <th className="pb-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0"
                >
                  <td className="py-3">
                    {item.date}
                  </td>

                  <td className="py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3">
                    {item.description}
                  </td>

                  <td
                    className={[
                      "py-3 text-right font-semibold",
                      item.type === "income"
                        ? "text-green-600"
                        : "text-red-600",
                    ].join(" ")}
                  >
                    {item.type === "income"
                      ? "+"
                      : "-"}

                    {item.amount.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}
                  </td>

                  <td className="py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setTransactionToDelete(item)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={transactionToDelete !== null}
        title="Delete transaction?"
        description={
          transactionToDelete
            ? `Delete “${transactionToDelete.description}”? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onClose={closeDeleteDialog}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}