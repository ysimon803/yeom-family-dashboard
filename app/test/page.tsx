"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [homeValue, setHomeValue] = useState(0);
  const [mortgage, setMortgage] = useState(0);
  const [cash, setCash] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Failed to load settings:", error);
        return;
      }

      if (data) {
        setHomeValue(data.home_value);
        setMortgage(data.mortgage);
        setCash(data.cash);
        setMonthlyIncome(data.monthly_income);
      }
    }

    void loadSettings();
  }, []);

  async function saveSettings() {
    const { error } = await supabase
      .from("financial_profile")
      .update({
        home_value: homeValue,
        mortgage,
        cash,
        monthly_income: monthlyIncome,
      })
      .eq("id", 1);

    if (error) {
      alert(`저장 실패: ${error.message}`);
      return;
    }

    alert("✅ 저장되었습니다.");
  }

  return (
    <main className="mx-auto max-w-5xl p-10">
      <h1 className="text-4xl font-bold">⚙️ Settings</h1>

      <p className="mt-2 text-slate-500">
        Manage your financial information.
      </p>

      <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">House</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Current Home Value"
            value={homeValue}
            setValue={setHomeValue}
          />

          <Input
            label="Mortgage"
            value={mortgage}
            setValue={setMortgage}
          />
        </div>

        <hr className="my-8" />

        <h2 className="mb-6 text-2xl font-semibold">Cash Flow</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Emergency Fund"
            value={cash}
            setValue={setCash}
          />

          <Input
            label="Monthly Take-home"
            value={monthlyIncome}
            setValue={setMonthlyIncome}
          />
        </div>

        <button
          type="button"
          onClick={() => void saveSettings()}
          className="mt-10 rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}

type InputProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
};

function Input({ label, value, setValue }: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-500">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full rounded-lg border p-3"
      />
    </div>
  );
}