"use client";

import GoalCard from "./GoalCard";
import HousePlanner from "./HousePlanner";
import MortgageCalculator from "./MortgageCalculator";

type Props = {
  targetDownPayment: number;
  currentDownPayment: number;

  homeValue: number;
  mortgage: number;
  cash: number;
  investments: number;

  targetPrice: number;
  downPercent: number;
};

export default function HouseSection({
  targetDownPayment,
  currentDownPayment,
  homeValue,
  mortgage,
  cash,
  investments,
  targetPrice,
  downPercent,
}: Props) {

  return (
    <div className="space-y-8">

      <GoalCard
        target={targetDownPayment}
        current={currentDownPayment}
      />


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

    </div>
  );
}