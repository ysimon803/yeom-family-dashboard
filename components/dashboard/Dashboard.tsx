import Header from "./Header";
import SummaryCards from "./SummaryCards";
import ChartsSection from "./ChartsSection";
import HouseCard from "@/components/house/HouseCard";

export default function Dashboard() {
  return (
    <>
      <Header />

      <SummaryCards />

      <ChartsSection />
      <div className="mt-8">
        <HouseCard />
      </div>
    </>
  );
}