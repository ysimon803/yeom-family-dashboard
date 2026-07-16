"use client";

import type { Transaction } from "@/types/transaction";
import { deleteTransaction } from "@/services/transactions/deleteTransaction";

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
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📋 Transaction History
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">Date</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">
                Amount
              </th>
              <th className="pb-3 text-center">
                Actions
                </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-slate-400"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="py-3">
                    {item.date}
                  </td>

                  <td>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {item.category}
                    </span>
                  </td>

                  <td>
                    {item.description}
                  </td>

                  <td
                    className={`text-right font-semibold ${
                      item.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
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
                  <td className="space-x-2 text-center">
                    <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                        >
                        Edit
                    </button>

                    <button
                        onClick={async () => {
                            if (
                                !confirm(
                                "Are you sure you want to delete this transaction?"
                                )
                            ) {
                                return;
                            }

                            try {
                                await deleteTransaction(item.id);
                                onDeleted();
                            } catch (error) {
                                console.error(error);
                                alert("Failed to delete transaction.");
                            }
                            }}
                        className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        >
                        Delete
                        </button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}