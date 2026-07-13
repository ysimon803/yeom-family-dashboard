"use client";

import AIFinancialCoach from "./AIFinancialCoach";

type Props = {
  netWorth: number;
  investmentTotal: number;
  monthlyIncome: number;

  currentDownPayment: number;
  targetDownPayment: number;

  largestHolding: string;
};

export default function AISection({
  netWorth,
  investmentTotal,
  monthlyIncome,
  currentDownPayment,
  targetDownPayment,
  largestHolding,
}: Props) {

  return (
    <AIFinancialCoach

      netWorth={netWorth}

      investmentTotal={investmentTotal}

      monthlyIncome={monthlyIncome}

      currentDownPayment={currentDownPayment}

      targetDownPayment={targetDownPayment}

      largestHolding={largestHolding}

    />
  );
}