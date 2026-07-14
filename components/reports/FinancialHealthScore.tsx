"use client";

type Props = {
  netWorth: number;
  investments: number;
  cash: number;
  mortgage: number;
};

export default function FinancialHealthScore({
  netWorth,
  investments,
  cash,
  mortgage,
}: Props) {

  let score = 0;


  // Net Worth 기준
  if (netWorth > 500000) {
    score += 30;
  } else if (netWorth > 250000) {
    score += 20;
  } else {
    score += 10;
  }


  // Investment 비중
  const investmentRatio =
    netWorth > 0
      ? investments / netWorth
      : 0;


  if (investmentRatio > 0.5) {
    score += 30;
  } else if (investmentRatio > 0.3) {
    score += 20;
  } else {
    score += 10;
  }


  // Cash reserve
  if (cash >= 30000) {
    score += 20;
  } else if (cash >= 15000) {
    score += 15;
  } else {
    score += 5;
  }


  // Debt
  const debtRatio =
    netWorth > 0
      ? mortgage / (netWorth + mortgage)
      : 1;


  if (debtRatio < 0.4) {
    score += 20;
  } else if (debtRatio < 0.6) {
    score += 15;
  } else {
    score += 5;
  }


  let status = "Needs Improvement";

  if (score >= 80) {
    status = "Excellent";
  } else if (score >= 60) {
    status = "Healthy";
  }


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🩺 Financial Health Score
      </h2>


      <div className="mt-8 text-center">

        <div className="text-6xl font-bold text-blue-600">
          {score}
        </div>


        <div className="mt-4 text-3xl font-bold">
          {status}
        </div>


      </div>


    </div>

  );

}