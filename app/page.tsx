"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import OverviewSection from "@/components/dashboard/OverviewSection";
import PortfolioSection from "@/components/dashboard/PortfolioSection";
import HouseSection from "@/components/dashboard/HouseSection";
import AISection from "@/components/dashboard/AISection";

import {
  calculateInvestmentTotal,
  calculateAssets,
  calculateNetWorth,
  calculateAllocation,
} from "@/services/finance";


type FinancialProfile = {
  id: number;

  home_value: number;
  mortgage: number;
  cash: number;

  monthly_income: number;

  target_home_price: number;
  down_payment_percent: number;
};


type Investment = {
  id: number;

  ticker: string;

  balance: number;
};


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

    } = await supabase

      .from("financial_profile")

      .select("*")

      .eq("id",1)

      .single();



    if(profileError){

      console.error(profileError);

      return;

    }



    const {
      data: investmentData,
      error: investmentError,

    } = await supabase

      .from("investments")

      .select("id,ticker,balance");



    if(investmentError){

      console.error(investmentError);

      return;

    }



    setProfile(profileData);

    setInvestments(investmentData ?? []);

  }



  if(!profile){

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
          (max,item)=>
            item.balance > max.balance
            ? item
            : max
        ).ticker

      : "-";



  return (

    <main className="space-y-10">


      <div>

        <h1 className="text-5xl font-bold">

          🏠 Yeom Family Dashboard

        </h1>


        <p className="mt-2 text-lg text-slate-500">

          Personal Wealth Dashboard

        </p>

      </div>



      <OverviewSection

        netWorth={netWorth}

        assets={assets}

        investments={investmentTotal}

        cash={profile.cash}

        investmentsData={investments}

      />



      <PortfolioSection

        home={profile.home_value}

        cash={profile.cash}

        investments={investmentTotal}

        mortgage={profile.mortgage}

        monthlyIncome={profile.monthly_income}

        investmentData={investments}

        allocation={allocation}

      />



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



      <AISection

        netWorth={netWorth}

        investmentTotal={investmentTotal}

        monthlyIncome={profile.monthly_income}

        currentDownPayment={currentDownPayment}

        targetDownPayment={targetDownPayment}

        largestHolding={largestHolding}

      />


    </main>

  );

}