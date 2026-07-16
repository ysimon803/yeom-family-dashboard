"use client";

import { useEffect, useState } from "react";

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

  async function reload() {
    try {
      const profileData =
        await getFinancialProfile();

      const investmentData =
        await getInvestments();

      setProfile(profileData);
      setInvestments(investmentData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    profile,
    investments,
    loading,
    reload,
  };
}