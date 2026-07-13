import Header from "./Header";
import SummaryCards from "./SummaryCards";
import ChartsSection from "./ChartsSection";
import HouseCard from "@/components/house/HouseCard";
import HousePlanner from "@/components/house/HousePlanner";
import AIInsight from "@/components/dashboard/AIInsight";
import RSUPlanner from "@/components/rsu/RSUPlanner";
import FinancialHealth from "@/components/dashboard/FinancialHealth";

export default function Dashboard() {
  return (
    <>
      <Header />

      <SummaryCards />

      <ChartsSection />
      <div className="mt-8">
        <HouseCard />
      </div>
      <div className="mt-8">
        <HousePlanner />
      </div>
      <div className="mt-8">
        <AIInsight />
      </div>
      <div className="mt-8">
        <RSUPlanner />
      </div>
      <div className="mt-8">
        <FinancialHealth/>
      </div>    
    </>
  );
}