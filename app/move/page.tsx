"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import MoveTimeline from "@/components/move/MoveTimeline";
import MoveChecklist from "@/components/move/MoveChecklist";
import MoveSettings from "@/components/move/MoveSettings";

import CashNeededCard from "@/components/move/CashNeededCard";
import MoveReadinessCard from "@/components/move/MoveReadinessCard";
import MoveSavingsSimulator from "@/components/move/MoveSavingsSimulator";

import HomePurchaseImpact from "@/components/move/HomePurchaseImpact";
import MortgageScenario from "@/components/move/MortgageScenario";
import PostMoveCashflow from "@/components/move/PostMoveCashflow";

import HomeSaleSimulator from "@/components/move/HomeSaleSimulator";
import HomeSaleForecast from "@/components/move/HomeSaleForecast";

import HousePlanner from "@/components/dashboard/HousePlanner";
import MortgageCalculator from "@/components/dashboard/MortgageCalculator";
import HomeEquityForecast from "@/components/dashboard/HomeEquityForecast";

import {
  calculateInvestmentTotal,
} from "@/services/finance";

import {
  calculateMonthlyMortgage,
} from "@/components/move/mortgage";


import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";


export default function MovePage() {


  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);


  const [investments, setInvestments] =
    useState<Investment[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [homePrice, setHomePrice] =
    useState(0);


  const [monthlySavings, setMonthlySavings] =
    useState(0);


  const [returnRate, setReturnRate] =
    useState(0);



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


    setHomePrice(
      profileData.move_home_price ??
      profileData.target_home_price
    );


    setMonthlySavings(
      profileData.move_monthly_savings ??
      3000
    );


    setReturnRate(
      profileData.move_return_rate ??
      5
    );


    setLoading(false);

  }



  async function saveScenario(
    key:string,
    value:number
  ) {


    const updateData:any = {};

    updateData[key] = value;


    await supabase
      .from("financial_profile")
      .update(updateData)
      .eq("id",1);

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



  const currentNetWorth =

    (
      profile.home_value -
      profile.mortgage
    )
    +
    profile.cash
    +
    investmentTotal;



  const monthlyMortgage =
    calculateMonthlyMortgage(
      homePrice,
      profile.down_payment_percent
    );



  // 2028 예상 Home Sale Proceeds
  // 현재 집 3% 성장 + 판매비 6% - Mortgage

  const futureHomeValue =
    profile.home_value *
    Math.pow(
      1.03,
      2
    );


  const homeSaleProceeds =

    futureHomeValue
    -
    (
      futureHomeValue * 0.06
    )
    -
    profile.mortgage;



  return (

    <div className="space-y-10 p-8">


      <h1 className="text-4xl font-bold">

        🚚 Move Planner

      </h1>



      <MoveTimeline

        currentYear={2026}

        targetYear={2028}

      />



      <MoveChecklist

        moveDate="2028-08-01"

      />



      <MoveSettings

        homePrice={homePrice}

        monthlySavings={monthlySavings}

        returnRate={returnRate}


        onChange={(key,value)=>{


          if(key==="homePrice"){

            setHomePrice(value);

            saveScenario(
              "move_home_price",
              value
            );

          }



          if(key==="monthlySavings"){

            setMonthlySavings(value);

            saveScenario(
              "move_monthly_savings",
              value
            );

          }



          if(key==="returnRate"){

            setReturnRate(value);

            saveScenario(
              "move_return_rate",
              value
            );

          }


        }}

      />



      <section>

        <h2 className="mb-4 text-2xl font-bold">
          🏠 Current Position
        </h2>


        <div className="grid grid-cols-2 gap-6">


          <HousePlanner

            homeValue={
              profile.home_value
            }

            mortgage={
              profile.mortgage
            }

            cash={
              profile.cash
            }

            investments={
              investmentTotal
            }

            targetPrice={
              homePrice
            }

            downPercent={
              profile.down_payment_percent
            }

          />



          <CashNeededCard

            targetPrice={
              homePrice
            }

            downPercent={
              profile.down_payment_percent
            }

          />


        </div>



        <div className="mt-6">

          <HomeSaleSimulator

            homeValue={
              profile.home_value
            }

            mortgage={
              profile.mortgage
            }

          />

        </div>



        <div className="mt-6">

          <HomeSaleForecast

            currentValue={
              profile.home_value
            }

            mortgage={
              profile.mortgage
            }

            annualGrowth={3}

          />

        </div>


      </section>




      <section>

        <h2 className="mb-4 text-2xl font-bold">
          💰 Move Preparation
        </h2>


        <div className="grid grid-cols-2 gap-6">


          <MoveReadinessCard

            targetPrice={
              homePrice
            }

            downPercent={
              profile.down_payment_percent
            }

            cashAvailable={
              profile.cash
            }

            investments={
              investmentTotal
            }

            homeSaleProceeds={
              homeSaleProceeds
            }

          />



          <MoveSavingsSimulator

            currentSavings={
              profile.cash +
              investmentTotal
            }

            monthlySavings={
              monthlySavings
            }

            annualReturn={
              returnRate
            }

          />


        </div>


      </section>




      <section>

        <h2 className="mb-4 text-2xl font-bold">
          🏡 Purchase Planning
        </h2>


        <div className="grid grid-cols-2 gap-6">


          <HomePurchaseImpact

            currentNetWorth={
              currentNetWorth
            }

            homePrice={
              homePrice
            }

            downPaymentPercent={
              profile.down_payment_percent
            }

          />



          <MortgageScenario

            homePrice={
              homePrice
            }

            downPercent={
              profile.down_payment_percent
            }

          />


        </div>


      </section>




      <section>

        <h2 className="mb-4 text-2xl font-bold">
          📊 After Move Planning
        </h2>



        <PostMoveCashflow

          monthlyIncome={
            profile.monthly_income
          }

          mortgagePayment={
            monthlyMortgage
          }

          otherExpenses={
            4000
          }

        />



        <div className="mt-6">

          <MortgageCalculator

            defaultPrice={
              homePrice
            }

          />

        </div>



        <div className="mt-6">

          <HomeEquityForecast

            homeValue={
              profile.home_value
            }

            mortgage={
              profile.mortgage
            }

          />

        </div>


      </section>


    </div>

  );

}