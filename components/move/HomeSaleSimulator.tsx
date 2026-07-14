"use client";


type Props = {

  homeValue: number;

  mortgage: number;

  sellingCostPercent?: number;

};



export default function HomeSaleSimulator({

  homeValue,

  mortgage,

  sellingCostPercent = 6,

}: Props) {



  const sellingCost =

    homeValue *
    (sellingCostPercent / 100);



  const mortgagePayoff =
    mortgage;



  const netCash =

    homeValue
    -
    sellingCost
    -
    mortgagePayoff;



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🏠 Current Home Sale

      </h2>



      <div className="mt-6 space-y-4">


        <Row

          label="Estimated Home Value"

          value={homeValue}

        />


        <Row

          label="Selling Cost"

          value={sellingCost}

        />


        <Row

          label="Mortgage Payoff"

          value={mortgagePayoff}

        />



        <hr />



        <Row

          label="Net Cash From Sale"

          value={netCash}

        />


      </div>



      <div className="mt-6 text-xl font-bold">


        {netCash >= 0

          ? "✅ Positive Sale Proceeds"

          : "⚠️ Negative Equity"}

      </div>


    </div>

  );

}




function Row({

  label,

  value,

}: {

  label:string;

  value:number;

}) {


  return (

    <div className="flex justify-between">


      <span>

        {label}

      </span>



      <span className="font-bold">

        ${Math.round(value).toLocaleString()}

      </span>


    </div>

  );

}