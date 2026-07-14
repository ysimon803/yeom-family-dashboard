"use client";


type Props = {
  moveDate: string;
};


const items = [

  "Emergency Fund 확보",

  "Down Payment 준비",

  "Current Home Sale Planning",

  "New Home Search",

  "Mortgage Pre Approval",

  "Moving Company 예약",

];



export default function MoveChecklist({

  moveDate,

}: Props) {


  const target =
    new Date(moveDate);


  const today =
    new Date();


  const diff =
    target.getTime() -
    today.getTime();


  const months =
    Math.max(
      0,
      Math.floor(
        diff /
        (1000 * 60 * 60 * 24 * 30)
      )
    );



  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        📅 Move Countdown

      </h2>



      <div className="mt-4 text-4xl font-bold text-blue-600">

        {months} Months

      </div>



      <div className="mt-8">


        <h3 className="text-xl font-bold">

          ✅ Preparation Checklist

        </h3>



        <div className="mt-4 space-y-3">


          {items.map((item) => (

            <div

              key={item}

              className="rounded-xl bg-slate-100 p-4"

            >

              ☐ {item}

            </div>

          ))}


        </div>


      </div>


    </div>

  );

}