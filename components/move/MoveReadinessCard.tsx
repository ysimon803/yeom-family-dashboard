"use client";


type Props = {

  targetPrice: number;

  downPercent: number;

  cashAvailable: number;

  investments: number;

  homeSaleProceeds?: number;

};



export default function MoveReadinessCard({

  targetPrice,

  downPercent,

  cashAvailable,

  investments,

  homeSaleProceeds = 0,

}: Props) {



  const downPayment =

    targetPrice *
    (downPercent / 100);



  const closingCost =

    targetPrice *
    0.03;



  const totalNeeded =

    downPayment +
    closingCost;



  const available =

    cashAvailable
    +
    investments
    +
    homeSaleProceeds;



  const difference =

    available -
    totalNeeded;



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🚚 Move Readiness

      </h2>



      <div className="mt-6 space-y-4">


        <Row

          label="Cash Needed"

          value={totalNeeded}

        />


        <Row

          label="Cash"

          value={cashAvailable}

        />


        <Row

          label="Investments"

          value={investments}

        />


        <Row

          label="Home Sale Proceeds"

          value={homeSaleProceeds}

        />


        <hr />


        <Row

          label="Available Funds"

          value={available}

        />


        <Row

          label={
            difference >= 0
              ? "Remaining"
              : "Shortfall"
          }

          value={
            Math.abs(difference)
          }

        />


      </div>



      <div className="mt-6 text-xl font-bold">


        {difference >= 0

          ? "✅ Ready for Move"

          : "⚠️ Need More Savings"}


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