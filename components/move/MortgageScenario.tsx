"use client";


type Props = {

  homePrice: number;

  downPercent: number;

};



export default function MortgageScenario({

  homePrice,

  downPercent,

}: Props) {


  const rates = [6, 7, 8];


  const downPayment =
    homePrice *
    (downPercent / 100);


  const loan =
    homePrice -
    downPayment;



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🏦 Mortgage Rate Scenario

      </h2>



      <div className="mt-6 space-y-4">


        {rates.map((rate) => {


          const payment =
            calculatePayment(
              loan,
              rate
            );


          return (

            <div

              key={rate}

              className="flex justify-between border-b py-3"

            >

              <span className="font-semibold">

                {rate}% Interest

              </span>


              <span className="font-bold">

                ${Math.round(
                  payment
                ).toLocaleString()}
                /mo

              </span>


            </div>

          );


        })}



      </div>


    </div>

  );

}



function calculatePayment(

  loan:number,

  rate:number

) {


  const monthlyRate =
    rate / 100 / 12;


  const months =
    360;


  return (

    loan *
    monthlyRate *
    Math.pow(
      1 + monthlyRate,
      months
    )

  )

  /

  (

    Math.pow(
      1 + monthlyRate,
      months
    )

    - 1

  );

}