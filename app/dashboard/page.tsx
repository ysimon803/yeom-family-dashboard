"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import WealthSummary from "@/components/dashboard/WealthSummary";
import GoalProgress from "@/components/dashboard/GoalProgress";
import AICommentary from "@/components/dashboard/AICommentary";

import {
  calculateInvestmentTotal,
  calculateNetWorth,
} from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";


export default function DashboardPage() {

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


  const homeEquity =
    profile.home_value -
    profile.mortgage;


  const moveTarget =
    profile.target_home_price *
    (
      profile.down_payment_percent /
      100
    );


  const moveCurrent =
    profile.cash +
    investmentTotal;


  const moveProgress =
    Math.min(
      (moveCurrent / moveTarget) * 100,
      100
    );


  const fiTarget =
    2000000;


  const fiProgress =
    Math.min(
      (netWorth / fiTarget) * 100,
      100
    );


  const investmentRatio =
    netWorth > 0
      ? investmentTotal / netWorth
      : 0;


  const goals = [

    {
      title: "2028 Home Move",
      icon: "🏠",
      current: moveCurrent,
      target: moveTarget,
    },


    {
      title: "Financial Independence",
      icon: "🔥",
      current: netWorth,
      target: fiTarget,
    },

  ];


  return (

    <div className="space-y-8 p-8">


      <h1 className="text-4xl font-bold">

        🏠 WealthOS Dashboard

      </h1>



      <WealthSummary

        netWorth={netWorth}

        investments={investmentTotal}

        cash={profile.cash}

        homeEquity={homeEquity}

      />



      <GoalProgress

        goals={goals}

      />



      <AICommentary

        netWorth={netWorth}

        investmentRatio={investmentRatio}

        moveProgress={moveProgress}

        fiProgress={fiProgress}

      />



      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="text-2xl font-bold">

          Financial Overview

        </h2>


        <p className="mt-4 text-slate-600">

          Your complete financial operating system.

        </p>


      </div>


    </div>

  );

}