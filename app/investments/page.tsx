"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Investment = {
  id: number;
  account_name: string;
  account_type: string;
  institution: string;
  ticker: string;
  allocation: number;
  balance: number;
  shares: number;
  average_cost: number;
  current_price: number;
};

export default function InvestmentsPage() {
  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [accountName, setAccountName] =
    useState("");

  const [accountType, setAccountType] =
    useState("");

  const [institution, setInstitution] =
    useState("");

  const [ticker, setTicker] =
    useState("");

  const [allocation, setAllocation] =
    useState(100);

  const [balance, setBalance] =
    useState(0);

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .order("id");

    if (error) {
      alert(error.message);
      return;
    }

    setInvestments(data ?? []);
  }

  function resetForm() {
    setEditingId(null);
    setAccountName("");
    setAccountType("");
    setInstitution("");
    setTicker("");
    setAllocation(100);
    setBalance(0);
  }

  function openNewModal() {
    resetForm();
    setShowModal(true);
  }

  function editInvestment(item: Investment) {
    setEditingId(item.id);

    setAccountName(item.account_name);
    setAccountType(item.account_type);
    setInstitution(item.institution);
    setTicker(item.ticker);
    setAllocation(item.allocation);
    setBalance(item.balance);

    setShowModal(true);
  }

  async function deleteInvestment(id: number) {
    const ok = window.confirm(
      "Delete this investment?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadInvestments();
  }

  async function saveInvestment() {
    if (editingId === null) {

      const { error } = await supabase
        .from("investments")
        .insert({
          account_name: accountName,
          account_type: accountType,
          institution,
          ticker,
          allocation,
          balance,
        });

      if (error) {
        alert(error.message);
        return;
      }

    } else {

      const { error } = await supabase
        .from("investments")
        .update({
          account_name: accountName,
          account_type: accountType,
          institution,
          ticker,
          allocation,
          balance,
        })
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }

    }

    setShowModal(false);
    resetForm();
    loadInvestments();
  }

  return (
    <main className="mx-auto max-w-7xl">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            📈 Investments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your investment accounts
          </p>

        </div>

        <button
          onClick={openNewModal}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          + Add Investment
        </button>

      </div>

      <table className="w-full border-collapse border">

        <thead>

          <tr className="bg-slate-100">

            <th className="border p-3">
              Account
            </th>

            <th className="border p-3">
              Institution
            </th>

            <th className="border p-3">
              Ticker
            </th>

            <th className="border p-3">
              Allocation
            </th>

            <th className="border p-3">
              Balance
            </th>

            <th className="border p-3">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {investments.map((item) => (

            <tr key={item.id}>

              <td className="border p-3">
                {item.account_name}
              </td>

              <td className="border p-3">
                {item.institution}
              </td>

              <td className="border p-3">
                {item.ticker}
              </td>

              <td className="border p-3">
                {item.allocation}%
              </td>

              <td className="border p-3">
                ${item.balance.toLocaleString()}
              </td>

              <td className="border p-3 flex gap-2">
                              <button
                  onClick={() => editInvestment(item)}
                  className="rounded bg-slate-200 px-3 py-1 hover:bg-slate-300"
                >
                  ✏ Edit
                </button>

                <button
                  onClick={() => deleteInvestment(item.id)}
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                >
                  🗑 Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

            <h2 className="mb-6 text-2xl font-bold">

              {editingId === null
                ? "➕ New Investment"
                : "✏ Edit Investment"}

            </h2>

            <div className="space-y-4">

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) =>
                  setAccountName(e.target.value)
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Account Type"
                value={accountType}
                onChange={(e) =>
                  setAccountType(e.target.value)
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Institution"
                value={institution}
                onChange={(e) =>
                  setInstitution(e.target.value)
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Ticker"
                value={ticker}
                onChange={(e) =>
                  setTicker(e.target.value)
                }
              />

              <input
                type="number"
                className="w-full rounded-lg border p-3"
                placeholder="Allocation (%)"
                value={allocation}
                onChange={(e) =>
                  setAllocation(Number(e.target.value))
                }
              />

              <input
                type="number"
                className="w-full rounded-lg border p-3"
                placeholder="Balance"
                value={balance}
                onChange={(e) =>
                  setBalance(Number(e.target.value))
                }
              />

            </div>

            <div className="mt-8 flex justify-end gap-4">

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg bg-slate-300 px-5 py-2 hover:bg-slate-400"
              >
                Cancel
              </button>

              <button
                onClick={saveInvestment}
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                {editingId === null
                  ? "Save"
                  : "Update"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}