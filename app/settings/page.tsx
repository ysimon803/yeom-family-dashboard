"use client";

import { useState } from "react";

import FinancialSettingsCard from "@/components/settings/FinancialSettingsCard";
import HouseGoalCard from "@/components/settings/HouseGoalCard";
import InvestmentSettingsCard from "@/components/settings/InvestmentSettingsCard";
import ProfileCard from "@/components/settings/ProfileCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { saveFinancialProfile } from "@/services/settings/saveFinancialProfile";

import type { FinancialProfile } from "@/types/financial";

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

    home_value: 430000,
    mortgage: 414047,

    retirement_assets: 232534,
    rsu_value: 162287,
    stock_option_value: 92480,
    cash: 15000,

    target_home_price: 900000,
    down_payment_percent: 20,
    target_move_year: 2028,
  });

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      await saveFinancialProfile(profile);
      alert("✅ Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("❌ Failed to save settings.");
    } finally {
      setSaving(false);
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
        <Button
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving && (
            <Spinner
              size="sm"
              label="Saving settings"
            />
          )}

          {saving
            ? "Saving..."
            : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}