"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FinancialProfile } from "@/types/financialProfile";

type Props = {
  profile: FinancialProfile;
  setProfile: Dispatch<SetStateAction<FinancialProfile>>;
};

export default function HouseGoalCard({
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
        🏡 House Goal
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Target Home Price
          </label>

          <input
            type="number"
            value={profile.target_home_price}
            onChange={(e) =>
              update("target_home_price", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Down Payment (%)
          </label>

          <input
            type="number"
            value={profile.down_payment_percent}
            onChange={(e) =>
              update("down_payment_percent", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Target Move Year
          </label>

          <input
            type="number"
            value={profile.target_move_year}
            onChange={(e) =>
              update("target_move_year", Number(e.target.value))
            }
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>
    </div>
  );
}