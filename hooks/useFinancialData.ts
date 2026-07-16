"use client";

import { useCallback, useEffect, useState } from "react";

import { getFinancialProfile } from "@/services/settings/getFinancialProfile";
import { getInvestments } from "@/services/investments/getInvestments";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";

export function useFinancialData() {
  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData =
        await getFinancialProfile();

      const investmentData =
        await getInvestments();

      setProfile(profileData);
      setInvestments(investmentData);
    } catch (err) {
      console.error(err);
      setError("Failed to load financial data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    profile,
    investments,
    loading,
    error,
    reload,
  };
}