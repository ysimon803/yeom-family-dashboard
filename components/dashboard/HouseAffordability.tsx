"use client";

import {
  calculateHousingCost,
} from "@/services/house";

import {
  calculateDTI,
  getAffordabilityStatus,
  getAffordabilityMessage,
} from "@/services/affordability";

import {
  calculateDownPaymentScore,
  calculateDTIScore,
  calculateCashFlowScore,
  calculatePurchaseReadiness,
} from "@/services/houseReadiness";


type Props = {

  homePrice: number;

  downPayment: number;

  interestRate: number;

  propertyTaxRate: number;

  insurance: number;

  hoa: number;

  monthlyIncome: number;

};



export default function HouseAffordability({

  homePrice,

  downPayment,

  interestRate,

  propertyTaxRate,

  insurance,

  hoa,

  monthlyIncome,

}: Props) {


  const result =
    calculateHousingCost({

      homePrice,

      downPayment,

      interestRate,

      propertyTaxRate,

      insurance,

      hoa,

    });



  const dti =
    calculateDTI(
      result.total,
      monthlyIncome
    );



  const status =
    getAffordabilityStatus(
      dti
    );



  const message =
    getAffordabilityMessage(
      status
    );



  // House Readiness

  const targetDownPayment =
    homePrice *
    0.2;



  const currentDownPayment =
    downPayment;



  const remainingCash =
    monthlyIncome -
    result.total;



  const downScore =
    calculateDownPaymentScore(
      currentDownPayment,
      targetDownPayment
    );


  const dtiScore =
    calculateDTIScore(
      dti
    );


  const cashFlowScore =
    calculateCashFlowScore(
      remainingCash
    );


  const readiness =
    calculatePurchaseReadiness(
      downScore,
      dtiScore,
      cashFlowScore
    );



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🏡 House Affordability

      </h2>



      <div className="mt-8 space-y-4">


        <Row
          label="Home Price"
          value={homePrice}
        />


        <Row
          label="Down Payment"
          value={downPayment}
        />


        <Row
          label="Loan Amount"
          value={result.loanAmount}
        />


        <Row
          label="Mortgage"
          value={result.mortgage}
        />


        <Row
          label="Property Tax"
          value={result.tax}
        />


        <Row
          label="Insurance"
          value={result.insurance}
        />


        <Row
          label="HOA"
          value={result.hoa}
        />

      </div>



      <div className="mt-10 border-t pt-6">

        <p className="text-slate-500">

          Monthly Housing Cost

        </p>


        <p className="mt-2 text-4xl font-bold text-blue-600">

          ${Math.round(result.total).toLocaleString()}

        </p>

      </div>



      <div className="mt-8 rounded-xl bg-slate-100 p-5">


        <p className="text-slate-500">

          Monthly Income

        </p>


        <p className="mt-2 text-2xl font-bold">

          ${monthlyIncome.toLocaleString()}

        </p>


      </div>



      <div className="mt-6 rounded-xl bg-slate-100 p-5">


        <p className="text-slate-500">

          Debt To Income Ratio (DTI)

        </p>


        <p className="mt-2 text-3xl font-bold">

          {dti.toFixed(1)}%

        </p>


        <p className="mt-2 font-bold">

          {status === "Comfortable" && "✅ "}

          {status === "Moderate" && "🟡 "}

          {status === "High" && "🔴 "}

          {status}

        </p>


      </div>



      {/* Purchase Readiness */}


      <div className="mt-8 rounded-2xl border p-6">


        <h3 className="text-xl font-bold">

          🏠 2028 House Purchase Readiness

        </h3>


        <div className="mt-5">


          <p className="text-slate-500">

            Score

          </p>


          <p className="mt-2 text-5xl font-bold">

            {readiness.score}/100

          </p>


          <p className="mt-2 text-xl font-bold">

            {readiness.level === "Excellent" && "🟢 "}

            {readiness.level === "Good" && "🟡 "}

            {readiness.level === "Risk" && "🔴 "}

            {readiness.level}

          </p>


        </div>


        <div className="mt-5 space-y-2 text-slate-600">


          <p>
            Down Payment Score:
            <b> {downScore}/40</b>
          </p>


          <p>
            DTI Score:
            <b> {dtiScore}/40</b>
          </p>


          <p>
            Cash Flow Score:
            <b> {cashFlowScore}/20</b>
          </p>


          <p className="pt-3 border-t">

            Remaining Monthly Cash:

            <b>
              ${Math.round(remainingCash).toLocaleString()}
            </b>

          </p>


        </div>


      </div>



      <div className="mt-6 rounded-xl border p-5">

        <p className="font-medium">

          {message}

        </p>

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

    <div className="flex justify-between border-b pb-2">


      <span>

        {label}

      </span>


      <span className="font-bold">

        ${Math.round(value).toLocaleString()}

      </span>


    </div>

  );

}