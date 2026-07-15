"use client";

import { useMemo } from "react";

import { useMovePlanner } from "@/hooks/useMovePlanner";
import {
  calculateCurrentNetWorth,
  calculateFutureHomeValue,
  calculateHomeSaleProceeds,
} from "@/services/move/calculations";

import {
  getMortgageSummary,
} from "@/services/move/mortgageSummary";
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
import SellBuyGapSimulator from "@/components/move/SellBuyGapSimulator";

import {
  calculateInvestmentTotal,
} from "@/services/finance";

import {
  calculateMonthlyMortgage,
} from "@/components/move/mortgage";


import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";


export default function MovePage() {
  const {
  profile,
  investments,
  loading,

  homePrice,
  setHomePrice,

  monthlySavings,
  setMonthlySavings,

  returnRate,
  setReturnRate,

  saveScenario,
} = useMovePlanner();
  if (loading || !profile) {
    return (
      <div className="p-8 text-lg">
        Loading...
      </div>
    );
  }
  const investmentTotal =
    calculateInvestmentTotal(
      investments
    );

  

  // 2028 예상 Home Sale Proceeds
  // 현재 집 3% 성장 + 판매비 6% - Mortgage

  const currentNetWorth =
  calculateCurrentNetWorth(
    profile.home_value,
    profile.mortgage,
    profile.cash,
    investmentTotal
  );
  const {
    monthlyMortgage,
  } = getMortgageSummary(
    homePrice,
    profile.down_payment_percent
  );

const futureHomeValue =
  calculateFutureHomeValue(
    profile.home_value
  );

const homeSaleProceeds =
  calculateHomeSaleProceeds(
    futureHomeValue,
    profile.mortgage
  );



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
          <SellBuyGapSimulator
            homeSaleProceeds={homeSaleProceeds}
            targetHomePrice={homePrice}
            downPaymentPercent={profile.down_payment_percent}
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