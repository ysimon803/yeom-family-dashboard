"use client";

import AssetBreakdown from "./AssetBreakdown";
import InvestmentPieChart from "./InvestmentPieChart";
import PortfolioAnalysis from "./PortfolioAnalysis";
import MonthlySummary from "./MonthlySummary";

type Props = {
  home: number;
  cash: number;
  investments: number;
  mortgage: number;

  monthlyIncome: number;

  investmentData: any[];

  allocation: any[];
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

      <div className="grid grid-cols-2 gap-8">

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


      <div className="grid grid-cols-2 gap-8">

        <InvestmentPieChart
          investments={investmentData}
        />

        <PortfolioAnalysis
          allocation={allocation}
        />

      </div>

    </div>
  );
}