"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [homeValue, setHomeValue] = useState(430000);
  const [mortgage, setMortgage] = useState(410000);
  const [cash, setCash] = useState(15000);
  const [monthlyIncome, setMonthlyIncome] = useState(12041);

  const [targetHomePrice, setTargetHomePrice] = useState(950000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.8);
  const [hoa, setHoa] = useState(900);
  const [insurance, setInsurance] = useState(1800);
  const [monthlyInvestment, setMonthlyInvestment] = useState(2000);
  const [monthlySaving, setMonthlySaving] = useState(3000);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data } = await supabase
      .from("financial_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (!data) return;

    setHomeValue(data.home_value);
    setMortgage(data.mortgage);
    setCash(data.cash);
    setMonthlyIncome(data.monthly_income);

    setTargetHomePrice(data.target_home_price);
    setDownPaymentPercent(data.down_payment_percent);
    setInterestRate(data.interest_rate);
    setPropertyTaxRate(data.property_tax_rate);
    setHoa(data.hoa);
    setInsurance(data.insurance);
    setMonthlyInvestment(data.monthly_investment);
    setMonthlySaving(data.monthly_saving);
  }

  async function saveProfile() {
    const { error } = await supabase
      .from("financial_profile")
      .update({
        home_value: homeValue,
        mortgage,
        cash,
        monthly_income: monthlyIncome,

        target_home_price: targetHomePrice,
        down_payment_percent: downPaymentPercent,
        interest_rate: interestRate,
        property_tax_rate: propertyTaxRate,
        hoa,
        insurance,
        monthly_investment: monthlyInvestment,
        monthly_saving: monthlySaving,
      })
      .eq("id", 1);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("✅ Saved Successfully");
    }
  }

  return (
    <main className="mx-auto max-w-5xl">

      <h1 className="text-4xl font-bold">
        ⚙️ Settings
      </h1>

      <p className="mt-2 text-slate-500">
        Manage your financial profile
      </p>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Current Financial Profile
        </h2>

        <div className="grid grid-cols-2 gap-6">
                  <Input
            label="Current Home Value"
            value={homeValue}
            setValue={setHomeValue}
          />

          <Input
            label="Mortgage Balance"
            value={mortgage}
            setValue={setMortgage}
          />

          <Input
            label="Cash"
            value={cash}
            setValue={setCash}
          />

          <Input
            label="Monthly Income"
            value={monthlyIncome}
            setValue={setMonthlyIncome}
          />

          <Input
            label="Target Home Price"
            value={targetHomePrice}
            setValue={setTargetHomePrice}
          />

          <Input
            label="Down Payment (%)"
            value={downPaymentPercent}
            setValue={setDownPaymentPercent}
          />

          <Input
            label="Interest Rate (%)"
            value={interestRate}
            setValue={setInterestRate}
          />

          <Input
            label="Property Tax (%)"
            value={propertyTaxRate}
            setValue={setPropertyTaxRate}
          />

          <Input
            label="HOA (Yearly)"
            value={hoa}
            setValue={setHoa}
          />

          <Input
            label="Insurance (Yearly)"
            value={insurance}
            setValue={setInsurance}
          />

          <Input
            label="Monthly Investment"
            value={monthlyInvestment}
            setValue={setMonthlyInvestment}
          />

          <Input
            label="Monthly Saving"
            value={monthlySaving}
            setValue={setMonthlySaving}
          />

        </div>

        <button
          onClick={saveProfile}
          className="mt-10 rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>

        {message && (
          <div className="mt-6 text-lg font-semibold text-green-600">
            {message}
          </div>
        )}

      </div>

    </main>
  );
}

type InputProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
};

function Input({
  label,
  value,
  setValue,
}: InputProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
      />

    </div>
  );
}