"use client";

import { useState } from "react";

import ProfileCard from "@/components/settings/ProfileCard";
import FinancialSettingsCard from "@/components/settings/FinancialSettingsCard";
import InvestmentSettingsCard from "@/components/settings/InvestmentSettingsCard";
import HouseGoalCard from "@/components/settings/HouseGoalCard";
import type { FinancialProfile } from "@/types/financial";
import { saveFinancialProfile } from "@/services/settings/saveFinancialProfile";

export default function SettingsPage() {
  const [profile, setProfile] = useState<FinancialProfile>({
    
    id: 1,

    full_name: "Seungwon Yeom",
    email: "",
    timezone: "America/Chicago",
    currency: "USD",

    monthly_income: 12041,
    monthly_savings: 4000,
    emergency_fund: 15000,
    net_worth: 707301,

    retirement_assets: 232534,
    rsu_value: 162287,
    stock_option_value: 92480,
    cash: 15000,

    target_home_price: 900000,
    down_payment_percent: 20,
    target_move_year: 2028,
  });
async function handleSave() {
  try {
    await saveFinancialProfile(profile);
    alert("✅ Settings saved successfully.");
  } catch (error) {
    console.error(error);
    alert("❌ Failed to save settings.");
  }
}
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          ⚙️ Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your financial profile and application settings.
        </p>
      </div>

      <ProfileCard
        profile={profile}
        setProfile={setProfile}
      />

     <FinancialSettingsCard
      profile={profile}
      setProfile={setProfile}
    />

    <InvestmentSettingsCard
      profile={profile}
      setProfile={setProfile}
    />
    <HouseGoalCard
      profile={profile}
      setProfile={setProfile}
    />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}