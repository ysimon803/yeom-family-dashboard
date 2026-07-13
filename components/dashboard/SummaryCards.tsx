import MetricCard from "@/components/ui/MetricCard";
import { portfolio } from "@/data/portfolio";

export default function SummaryCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Net Worth"
        value={`$${portfolio.netWorth.toLocaleString()}`}
        subtitle="Total Family Assets"
      />

      <MetricCard
        title="Retirement"
        value={`$${portfolio.retirement.total.toLocaleString()}`}
        subtitle="401(k) • Roth • HSA"
      />

      <MetricCard
        title="TI Equity"
        value={`$${portfolio.ti.total.toLocaleString()}`}
        subtitle="RSU + Options"
      />

      <MetricCard
        title="Cash"
        value={`$${portfolio.cash.toLocaleString()}`}
        subtitle="Emergency Fund"
      />
    </div>
  );
}