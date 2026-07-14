"use client";


type Props = {

  currentSavings: number;

  monthlySavings: number;

  annualReturn?: number;

};



export default function MoveSavingsSimulator({

  currentSavings,

  monthlySavings,

  annualReturn = 5,

}: Props) {


  const results = [];

  let value = currentSavings;


  for (
    let year = 2026;
    year <= 2028;
    year++
  ) {


    results.push({

      year,

      value,

    });


    value =
      value *
      (1 + annualReturn / 100);


    value +=
      monthlySavings * 12;


  }



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        📈 Move Savings Projection

      </h2>



      <div className="mt-8 space-y-4">


        {results.map((item) => (

          <div

            key={item.year}

            className="flex justify-between border-b py-3"

          >


            <span className="font-semibold">

              {item.year}

            </span>



            <span className="font-bold text-green-600">

              ${Math.round(
                item.value
              ).toLocaleString()}

            </span>



          </div>


        ))}



      </div>


    </div>

  );

}