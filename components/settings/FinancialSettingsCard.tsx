"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FinancialProfile } from "@/types/financial";

type Props = {
  profile: FinancialProfile;
  setProfile: Dispatch<SetStateAction<FinancialProfile>>;
};

export default function FinancialSettingsCard({
  profile,
  setProfile,
}: Props) {
  function update<K extends keyof FinancialProfile>(
    key: K,
    value: FinancialProfile[K]
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💰 Financial Settings
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Monthly Income
          </label>

          <input
            type="number"
            value={profile.monthly_income}
            onChange={(e) =>
              update("monthly_income", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Monthly Savings
          </label>

          <input
            type="number"
            value={profile.monthly_savings}
            onChange={(e) =>
              update("monthly_savings", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Emergency Fund
          </label>

          <input
            type="number"
            value={profile.emergency_fund}
            onChange={(e) =>
              update("emergency_fund", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Net Worth
          </label>

          <input
            type="number"
            value={profile.net_worth}
            onChange={(e) =>
              update("net_worth", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>
    </div>
  );
}