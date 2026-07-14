"use client";


type Props = {

  currentNetWorth: number;

  homePrice: number;

  downPaymentPercent: number;

  mortgageRate?: number;

};



export default function HomePurchaseImpact({

  currentNetWorth,

  homePrice,

  downPaymentPercent,

  mortgageRate = 6,

}: Props) {


  const downPayment =
    homePrice *
    (downPaymentPercent / 100);


  const newMortgage =
    homePrice -
    downPayment;


  const remainingAssets =
    currentNetWorth -
    downPayment;



  const monthlyMortgage =
    (newMortgage *
      (mortgageRate / 100 / 12)) /
    (
      1 -
      Math.pow(
        1 + mortgageRate / 100 / 12,
        -360
      )
    );



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🏠 Home Purchase Impact

      </h2>



      <div className="mt-6 space-y-4">


        <Row

          label="Down Payment"

          value={downPayment}

        />


        <Row

          label="New Mortgage"

          value={newMortgage}

        />


        <Row

          label="Assets After Purchase"

          value={remainingAssets}

        />


        <Row

          label="Estimated Mortgage / Month"

          value={monthlyMortgage}

        />


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