"use client";

import PortfolioSummary from "./PortfolioSummary";
import SummaryCards from "./SummaryCards";

import type { Investment } from "@/types/investment";

type PortfolioSummaryInvestment = {
  account_name: string;
  ticker: string;
  balance: number;
};

type Props = {
  netWorth: number;
  assets: number;
  investments: number;
  cash: number;
  investmentsData: Investment[];
};

export default function OverviewSection({
  netWorth,
  assets,
  investments,
  cash,
  investmentsData,
}: Props) {
  const portfolioSummaryInvestments: PortfolioSummaryInvestment[] =
    investmentsData.map((investment) => ({
      account_name:
        "account_name" in investment &&
        typeof investment.account_name === "string"
          ? investment.account_name
          : "Unknown Account",
      ticker: investment.ticker,
      balance: Number(investment.balance),
    }));

  return (
    <div className="space-y-8">
      <SummaryCards
        netWorth={netWorth}
        assets={assets}
        investments={investments}
        cash={cash}
      />

      <PortfolioSummary
        investments={portfolioSummaryInvestments}
      />
    </div>
  );
}