"use client";


type Props = {

  currentValue: number;

  mortgage: number;

  annualGrowth?: number;

  sellingCostPercent?: number;

};



export default function HomeSaleForecast({

  currentValue,

  mortgage,

  annualGrowth = 3,

  sellingCostPercent = 6,

}: Props) {


  const years = [];


  let value = currentValue;


  for (
    let year = 2026;
    year <= 2028;
    year++
  ) {


    years.push({

      year,

      value,

    });


    value =
      value *
      (1 + annualGrowth / 100);


  }



  const saleValue =
    years[2].value;



  const sellingCost =
    saleValue *
    (sellingCostPercent / 100);



  const netProceeds =

    saleValue
    -
    sellingCost
    -
    mortgage;



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🏠 Home Sale Forecast

      </h2>



      <div className="mt-6 space-y-4">


        {years.map((item)=>(


          <div

            key={item.year}

            className="flex justify-between border-b py-3"

          >

            <span>

              {item.year}

            </span>


            <span className="font-bold">

              ${Math.round(
                item.value
              ).toLocaleString()}

            </span>


          </div>


        ))}



        <hr />



        <Row

          label="2028 Selling Cost"

          value={sellingCost}

        />



        <Row

          label="Mortgage Payoff"

          value={mortgage}

        />



        <Row

          label="Net Sale Proceeds"

          value={netProceeds}

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