"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FinancialProfile } from "@/types/financial";

type Props = {
  profile: FinancialProfile;
  setProfile: Dispatch<SetStateAction<FinancialProfile>>;
};

export default function InvestmentSettingsCard({
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
        📈 Investment Settings
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Retirement Assets
          </label>

          <input
            type="number"
            value={profile.retirement_assets}
            onChange={(e) =>
              update("retirement_assets", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            RSU Value
          </label>

          <input
            type="number"
            value={profile.rsu_value}
            onChange={(e) =>
              update("rsu_value", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Stock Option Value
          </label>

          <input
            type="number"
            value={profile.stock_option_value}
            onChange={(e) =>
              update("stock_option_value", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Cash
          </label>

          <input
            type="number"
            value={profile.cash}
            onChange={(e) =>
              update("cash", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>
    </div>
  );
}