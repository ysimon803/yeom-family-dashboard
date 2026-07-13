import InvestmentPieChart from "./InvestmentPieChart";
import PortfolioAnalysis from "./PortfolioAnalysis";

type Allocation = {
  ticker: string;
  balance: number;
  percent: number;
};

type Investment = {
  ticker: string;
  balance: number;
};

type Props = {
  investments: Investment[];
  allocation: Allocation[];
};

export default function InvestmentSection({
  investments,
  allocation,
}: Props) {

  return (

    <div className="mt-10 grid grid-cols-2 gap-8">

      <InvestmentPieChart
        investments={investments}
      />

      <PortfolioAnalysis
        allocation={allocation}
      />

    </div>

  );

}