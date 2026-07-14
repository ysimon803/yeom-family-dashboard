"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import RetirementForecast from "@/components/retirement/RetirementForecast";
import AccountBreakdown from "@/components/retirement/AccountBreakdown";
import FIProgress from "@/components/retirement/FIProgress";
import RetirementIncome from "@/components/retirement/RetirementIncome";


export default function RetirementPage() {

  const [accounts, setAccounts] =
    useState<
      {
        name: string;
        balance: number;
      }[]
    >([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    const { data } =
      await supabase
        .from("investments")
        .select("*");


    const retirementAccounts = [

      {
        name: "TI 401(k)",
        balance:
          data
            ?.filter(
              (item) =>
                item.account === "TI 401k"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.balance),
              0
            ) ?? 0,
      },


      {
        name: "AA 401(k)",
        balance:
          data
            ?.filter(
              (item) =>
                item.account === "AA 401k"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.balance),
              0
            ) ?? 0,
      },


      {
        name: "Roth IRA",
        balance:
          data
            ?.filter(
              (item) =>
                item.account === "Roth IRA"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.balance),
              0
            ) ?? 0,
      },


      {
        name: "HSA",
        balance:
          data
            ?.filter(
              (item) =>
                item.account === "HSA"
            )
            .reduce(
              (sum, item) =>
                sum + Number(item.balance),
              0
            ) ?? 0,
      },

    ];


    setAccounts(
      retirementAccounts
    );

    setLoading(false);

  }


  if (loading) {

    return (
      <div className="p-8">
        Loading...
      </div>
    );

  }


  const totalAssets =
    accounts.reduce(
      (sum, item) =>
        sum + item.balance,
      0
    );


  const fiTarget =
    2000000;


  return (

    <div className="space-y-8 p-8">


      <h1 className="text-4xl font-bold">

        💰 Retirement Planner

      </h1>



      <AccountBreakdown

        accounts={accounts}

      />



      <FIProgress

        currentAssets={totalAssets}

        targetAssets={fiTarget}

      />



      <RetirementIncome

        retirementAssets={totalAssets}

        withdrawalRate={4}

        socialSecurity={3000}

      />



      <RetirementForecast

        currentAssets={totalAssets}

        monthlyContribution={3000}

        yearlyGrowth={7}

        years={30}

      />


    </div>

  );

}