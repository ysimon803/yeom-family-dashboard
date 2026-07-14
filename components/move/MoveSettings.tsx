"use client";


type Props = {

  homePrice: number;

  monthlySavings: number;

  returnRate: number;

  onChange: (
    key: string,
    value: number
  ) => void;

};


export default function MoveSettings({

  homePrice,

  monthlySavings,

  returnRate,

  onChange,

}: Props) {


  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        ⚙️ Move Assumptions

      </h2>



      <div className="mt-6 grid grid-cols-3 gap-6">


        <Input

          label="Target Home Price"

          value={homePrice}

          onChange={(v) =>
            onChange(
              "homePrice",
              v
            )
          }

        />



        <Input

          label="Monthly Savings"

          value={monthlySavings}

          onChange={(v) =>
            onChange(
              "monthlySavings",
              v
            )
          }

        />



        <Input

          label="Investment Return %"

          value={returnRate}

          onChange={(v) =>
            onChange(
              "returnRate",
              v
            )
          }

        />


      </div>


    </div>

  );

}



function Input({

  label,

  value,

  onChange,

}: {

  label:string;

  value:number;

  onChange:(value:number)=>void;

}) {


  return (

    <div>


      <label className="text-sm text-slate-500">

        {label}

      </label>



      <input

        type="number"

        value={value}

        onChange={(e)=>
          onChange(
            Number(e.target.value)
          )
        }

        className="mt-2 w-full rounded-xl border p-3"

      />


    </div>

  );

}