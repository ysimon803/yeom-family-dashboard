"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import AssetSummary from "@/components/reports/AssetSummary";
import AllocationSummary from "@/components/reports/AllocationSummary";
import FinancialHealthScore from "@/components/reports/FinancialHealthScore";

import {
  calculateInvestmentTotal,
  calculateNetWorth,
} from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";


export default function ReportsPage() {

  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    const { data: profileData } =
      await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();


    const { data: investmentData } =
      await supabase
        .from("investments")
        .select("*");


    setProfile(profileData);

    setInvestments(
      investmentData ?? []
    );

    setLoading(false);

  }


  if (loading || !profile) {

    return (
      <div className="p-8">
        Loading...
      </div>
    );

  }


  const investmentTotal =
    calculateInvestmentTotal(
      investments
    );


  const netWorth =
    calculateNetWorth(
      profile,
      investments
    );


  const assets = [

    {
      name: "🏠 Home Equity",
      value:
        profile.home_value -
        profile.mortgage,
    },

    {
      name: "💼 Investments",
      value:
        investmentTotal,
    },

    {
      name: "💵 Cash",
      value:
        profile.cash,
    },

  ];


  const allocationData =
    investments.map((item) => ({

      name: item.ticker,

      value:
        Number(item.balance),

    }));


  return (

    <div className="space-y-8 p-8">


      <h1 className="text-4xl font-bold">

        📄 Financial Reports

      </h1>



      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="text-2xl font-bold">

          Net Worth

        </h2>


        <p className="mt-6 text-5xl font-bold text-blue-600">

          ${Math.round(
            netWorth
          ).toLocaleString()}

        </p>


      </div>



      <div className="grid grid-cols-2 gap-6">


        <AssetSummary

          assets={assets}

        />


        <AllocationSummary

          data={allocationData}

        />


      </div>



      <FinancialHealthScore

        netWorth={netWorth}

        investments={investmentTotal}

        cash={profile.cash}

        mortgage={profile.mortgage}

      />


    </div>

  );

}