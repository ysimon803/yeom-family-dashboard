"use client";

import AIAdvisorCard from "@/components/advisor/AIAdvisorCard";
import PortfolioAnalysisCard from "@/components/advisor/PortfolioAnalysisCard";

export default function AdvisorPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">
          🤖 AI Financial Advisor
        </h1>

        <p className="mt-2 text-slate-500">
          Personalized financial insights
        </p>
      </div>

      <AIAdvisorCard />

      <PortfolioAnalysisCard
        retirement={232534}
        rsu={162287}
        stockOptions={92480}
        cash={15000}
      />
    </div>
  );
}