type Props = {
  netWorth: number;
  investmentTotal: number;
  monthlyIncome: number;

  currentDownPayment: number;
  targetDownPayment: number;

  largestHolding: string;
};

export default function AIFinancialCoach({
  netWorth,
  investmentTotal,
  monthlyIncome,
  currentDownPayment,
  targetDownPayment,
  largestHolding,
}: Props) {

  const progress =
    Math.round(
      currentDownPayment /
      targetDownPayment *
      100
    );

  let recommendation = "";

  if(progress >= 100){

    recommendation =
      "You are ready to purchase your target home.";

  }else if(progress >= 75){

    recommendation =
      "Excellent progress. Continue investing and saving.";

  }else if(progress >= 50){

    recommendation =
      "Increase monthly saving by about $500 if possible.";

  }else{

    recommendation =
      "Focus on building your down payment first.";

  }

  return(

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        🤖 AI Financial Coach

      </h2>

      <div className="mt-8 space-y-4">

        <Row
          label="Net Worth"
          value={netWorth}
        />

        <Row
          label="Investments"
          value={investmentTotal}
        />

        <Row
          label="Monthly Income"
          value={monthlyIncome}
        />

        <div className="border-t pt-4">

          <div className="text-slate-500">

            Down Payment Progress

          </div>

          <div className="mt-2 text-3xl font-bold text-blue-600">

            {progress}%

          </div>

        </div>

        <div className="border-t pt-4">

          <div className="text-slate-500">

            Largest Holding

          </div>

          <div className="mt-2 text-2xl font-bold">

            {largestHolding}

          </div>

        </div>

        <div className="border-t pt-4">

          <div className="text-slate-500">

            Recommendation

          </div>

          <div className="mt-2 text-lg">

            {recommendation}

          </div>

        </div>

      </div>

    </div>

  )

}

function Row({
  label,
  value,
}:{
  label:string;
  value:number;
}){

  return(

    <div className="flex justify-between">

      <div>{label}</div>

      <div className="font-bold">

        ${Math.round(value).toLocaleString()}

      </div>

    </div>

  )

}