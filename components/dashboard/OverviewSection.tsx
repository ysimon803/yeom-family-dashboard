import SummaryCards from "./SummaryCards";
import AssetBreakdown from "./AssetBreakdown";
import MonthlySummary from "./MonthlySummary";
import GoalCard from "./GoalCard";
import NetWorthChart from "./NetWorthChart";

type Props = {
  netWorth: number;
  assets: number;
  investments: number;
  cash: number;

  home: number;
  mortgage: number;

  monthlyIncome: number;

  goalCurrent: number;
  goalTarget: number;
};

export default function OverviewSection({
  netWorth,
  assets,
  investments,
  cash,

  home,
  mortgage,

  monthlyIncome,

  goalCurrent,
  goalTarget,
}: Props) {
  return (
    <>

      <SummaryCards
        netWorth={netWorth}
        assets={assets}
        investments={investments}
        cash={cash}
      />

      <div className="mt-10 grid grid-cols-2 gap-8">

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

      <div className="mt-10 grid grid-cols-2 gap-8">

        <GoalCard
          current={goalCurrent}
          target={goalTarget}
        />

        <NetWorthChart />

      </div>

    </>
  );
}