"use client";

import WealthSummary from "@/components/dashboard/WealthSummary";
import GoalProgress from "@/components/dashboard/GoalProgress";
import AICommentary from "@/components/dashboard/AICommentary";
import { useFinancialData } from "@/hooks/useFinancialData";
import {
  calculateInvestmentTotal,
  calculateNetWorth,
} from "@/services/finance";



export default function DashboardPage() {

  const {
  profile,
  investments,
  loading,
  error,
  } = useFinancialData();

  if (loading || !profile) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

if (loading || !profile) {
  return (
    <div className="p-8">
      Loading...
    </div>
  );
}

if (error) {
  return (
    <div className="p-8 text-red-600">
      {error}
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