"use client";


type Props = {

  monthlyIncome: number;

  mortgagePayment: number;

  otherExpenses?: number;

};



export default function PostMoveCashflow({

  monthlyIncome,

  mortgagePayment,

  otherExpenses = 4000,

}: Props) {


  const remaining =

    monthlyIncome -

    mortgagePayment -

    otherExpenses;



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        💰 Post Move Cash Flow

      </h2>



      <div className="mt-6 space-y-4">


        <Row

          label="Monthly Income"

          value={monthlyIncome}

        />


        <Row

          label="Mortgage Payment"

          value={mortgagePayment}

        />


        <Row

          label="Other Expenses"

          value={otherExpenses}

        />



        <hr />



        <Row

          label="Available Savings"

          value={remaining}

        />


      </div>



      <div className="mt-6 text-xl font-bold">

        {remaining >= 0

          ? "✅ Positive Cash Flow"

          : "⚠️ Cash Flow Deficit"}

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

        ${Math.round(
          value
        ).toLocaleString()}

      </span>


    </div>

  );

}