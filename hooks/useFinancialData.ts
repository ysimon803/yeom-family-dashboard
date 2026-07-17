"use client";

import { useCallback, useState } from "react";

import { getInvestments } from "@/services/investments/getInvestments";
import { getFinancialProfile } from "@/services/settings/getFinancialProfile";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export function useFinancialData() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileData, investmentData] =
        await Promise.all([
          getFinancialProfile(),
          getInvestments(),
        ]);

      setProfile(profileData);
      setInvestments(investmentData);
    } catch (err) {
      console.error(err);
      setError("Failed to load financial data.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    investments,
    loading,
    error,
    reload,
  };
}