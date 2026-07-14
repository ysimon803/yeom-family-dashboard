"use client";

import HousePlanner from "./HousePlanner";
import MortgageCalculator from "./MortgageCalculator";
import HomeEquityForecast from "./HomeEquityForecast";

type Props = {
  homeValue: number;
  mortgage: number;
  cash: number;
  investments: number;
  targetPrice: number;
  downPercent: number;
};

export default function HouseSection({
  homeValue,
  mortgage,
  cash,
  investments,
  targetPrice,
  downPercent,
}: Props) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-8">
        <HousePlanner
          homeValue={homeValue}
          mortgage={mortgage}
          cash={cash}
          investments={investments}
          targetPrice={targetPrice}
          downPercent={downPercent}
        />

        <MortgageCalculator
          defaultPrice={targetPrice}
        />
      </div>

      <div className="mt-8">
        <HomeEquityForecast
          homeValue={homeValue}
          mortgage={mortgage}
        />
      </div>
    </div>
  );
}