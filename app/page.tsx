"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import OverviewSection from "@/components/dashboard/OverviewSection";
import PortfolioSection from "@/components/dashboard/PortfolioSection";
import HouseSection from "@/components/dashboard/HouseSection";
import HouseAffordability from "@/components/dashboard/HouseAffordability";
import AISection from "@/components/dashboard/AISection";

import {
  calculateInvestmentTotal,
  calculateAssets,
  calculateNetWorth,
  calculateAllocation,
} from "@/services/finance";

import type { FinancialProfile } from "@/types/financial";
import type { Investment } from "@/types/investment";


export default function DashboardPage() {

  const [profile, setProfile] =
    useState<FinancialProfile | null>(null);


  const [investments, setInvestments] =
    useState<Investment[]>([]);



  useEffect(() => {

    loadData();

  }, []);



  async function loadData() {

    const {
      data: profileData,
      error: profileError,
    } =
      await supabase
        .from("financial_profile")
        .select("*")
        .eq("id", 1)
        .single();


    if (profileError) {

      console.error(profileError);

      return;

    }



    const {
      data: investmentData,
      error: investmentError,
    } =
      await supabase
        .from("investments")
        .select("id,ticker,balance");



    if (investmentError) {

      console.error(investmentError);

      return;

    }



    setProfile(profileData);

    setInvestments(investmentData ?? []);

  }



  if (!profile) {

    return (

      <main className="p-10">

        Loading...

      </main>

    );

  }



  const investmentTotal =
    calculateInvestmentTotal(
      investments
    );



  const assets =
    calculateAssets(
      profile,
      investments
    );



  const netWorth =
    calculateNetWorth(
      profile,
      investments
    );



  const allocation =
    calculateAllocation(
      investments
    );



  const targetDownPayment =
    profile.target_home_price *
    (
      profile.down_payment_percent / 100
    );



  const currentDownPayment =
    profile.cash +
    investmentTotal;



  const largestHolding =
    allocation.length > 0

      ? allocation.reduce(
          (max, item) =>
            item.balance > max.balance
              ? item
              : max
        ).ticker

      : "-";



  return (

    <main className="min-h-screen bg-slate-100 p-10">


      <div>

        <h1 className="text-5xl font-bold">

          🏠 Yeom Family Dashboard

        </h1>


        <p className="mt-2 text-lg text-slate-500">

          Personal Wealth Dashboard

        </p>

      </div>



      {/* Overview */}

      <div className="mt-10">

        <OverviewSection

          netWorth={netWorth}

          assets={assets}

          investments={investmentTotal}

          cash={profile.cash}

          investmentsData={investments}

        />

      </div>



      {/* Portfolio */}

      <div className="mt-10">

        <PortfolioSection

          home={profile.home_value}

          cash={profile.cash}

          investments={investmentTotal}

          mortgage={profile.mortgage}

          monthlyIncome={profile.monthly_income}

          investmentData={investments}

          allocation={allocation}

        />

      </div>



      {/* House Planning */}

      <div className="mt-10">

        <HouseSection

          targetDownPayment={targetDownPayment}

          currentDownPayment={currentDownPayment}

          homeValue={profile.home_value}

          mortgage={profile.mortgage}

          cash={profile.cash}

          investments={investmentTotal}

          targetPrice={profile.target_home_price}

          downPercent={profile.down_payment_percent}

        />

      </div>



      {/* House Affordability */}

      <div className="mt-10">

        <HouseAffordability

          homePrice={profile.target_home_price}

          downPayment={targetDownPayment}

          interestRate={profile.interest_rate}

          propertyTaxRate={profile.property_tax_rate}

          insurance={profile.insurance}

          hoa={profile.hoa}

          monthlyIncome={profile.monthly_income}
        />

      </div>



      {/* AI */}

      <div className="mt-10">

        <AISection

          netWorth={netWorth}

          investmentTotal={investmentTotal}

          monthlyIncome={profile.monthly_income}

          currentDownPayment={currentDownPayment}

          targetDownPayment={targetDownPayment}

          largestHolding={largestHolding}

        />

      </div>


    </main>

  );

}