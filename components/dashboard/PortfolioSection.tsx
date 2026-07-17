"use client";

import AssetBreakdown from "./AssetBreakdown";
import InvestmentPieChart from "./InvestmentPieChart";
import MonthlySummary from "./MonthlySummary";
import PortfolioAnalysis from "./PortfolioAnalysis";

import type { Investment } from "@/types/investment";

type Allocation = {
  ticker: string;
  balance: number;
  percent: number;
};

type Props = {
  home: number;
  cash: number;
  investments: number;
  mortgage: number;
  monthlyIncome: number;
  investmentData: Investment[];
  allocation: Allocation[];
};

export default function PortfolioSection({
  home,
  cash,
  investments,
  mortgage,
  monthlyIncome,
  investmentData,
  allocation,
}: Props) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AssetBreakdown
          home={home}
          cash={cash}
          investments={investments}
          mortgage={mortgage}
        />

        <MonthlySummary
          monthlyIncome={monthlyIncome}
          mortgage={mortgage}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InvestmentPieChart investments={investmentData} />

        <PortfolioAnalysis allocation={allocation} />
      </div>
    </div>
  );
}