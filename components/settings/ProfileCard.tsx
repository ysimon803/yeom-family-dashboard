"use client";

import type { Dispatch, SetStateAction } from "react";
import type { FinancialProfile } from "@/types/financial";

type Props = {
  profile: FinancialProfile;
  setProfile: Dispatch<SetStateAction<FinancialProfile>>;
};

export default function ProfileCard({
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
        👤 Profile
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Full Name
          </label>

          <input
            type="text"
            value={profile.full_name}
            onChange={(e) =>
              update("full_name", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Email
          </label>

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              update("email", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Time Zone
          </label>

          <select
            value={profile.timezone}
            onChange={(e) =>
              update("timezone", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          >
            <option value="America/Chicago">
              America/Chicago
            </option>
            <option value="America/New_York">
              America/New_York
            </option>
            <option value="America/Los_Angeles">
              America/Los_Angeles
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Preferred Currency
          </label>

          <select
            value={profile.currency}
            onChange={(e) =>
              update("currency", e.target.value)
            }
            className="w-full rounded-xl border p-3"
          >
            <option value="USD">USD ($)</option>
            <option value="KRW">KRW (₩)</option>
          </select>
        </div>
      </div>
    </div>
  );
}