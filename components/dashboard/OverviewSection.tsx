"use client";

import SummaryCards from "./SummaryCards";
import PortfolioSummary from "./PortfolioSummary";

type Props = {
  netWorth: number;
  assets: number;
  investments: number;
  cash: number;

  investmentsData: any[];
};

export default function OverviewSection({
  netWorth,
  assets,
  investments,
  cash,
  investmentsData,
}: Props) {
  return (
    <div className="space-y-8">

      <SummaryCards
        netWorth={netWorth}
        assets={assets}
        investments={investments}
        cash={cash}
      />

      <PortfolioSummary
        investments={investmentsData}
      />

    </div>
  );
}