"use client";

import { useMemo, useState } from "react";

type Props = {
  defaultPrice?: number;
};

export default function MortgageCalculator({
  defaultPrice = 950000,
}: Props) {

  const [price, setPrice] = useState(defaultPrice);
  const [downPercent, setDownPercent] = useState(20);
  const [interest, setInterest] = useState(5.5);
  const [years, setYears] = useState(30);

  const result = useMemo(() => {

    const loan =
      price * (1 - downPercent / 100);

    const monthlyRate =
      interest / 100 / 12;

    const payments =
      years * 12;

    const payment =
      loan *
      (
        monthlyRate *
        Math.pow(1 + monthlyRate, payments)
      ) /
      (
        Math.pow(1 + monthlyRate, payments) - 1
      );

    return {
      loan,
      payment,
    };

  }, [
    price,
    downPercent,
    interest,
    years,
  ]);

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏡 Mortgage Calculator
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <Input
          label="Home Price"
          value={price}
          setValue={setPrice}
        />

        <Input
          label="Down %"
          value={downPercent}
          setValue={setDownPercent}
        />

        <Input
          label="Interest %"
          value={interest}
          setValue={setInterest}
        />

        <Input
          label="Years"
          value={years}
          setValue={setYears}
        />

      </div>

      <div className="mt-10 space-y-4">

        <Row
          label="Loan Amount"
          value={result.loan}
        />

        <Row
          label="Estimated Monthly Payment"
          value={result.payment}
        />

      </div>

    </div>

  );

}

function Input({
  label,
  value,
  setValue,
}:{
  label:string;
  value:number;
  setValue:(v:number)=>void;
}){

  return(

    <div>

      <div className="mb-2 text-slate-500">

        {label}

      </div>

      <input
        type="number"
        className="w-full rounded border p-3"
        value={value}
        onChange={(e)=>setValue(Number(e.target.value))}
      />

    </div>

  )

}

function Row({
  label,
  value,
}:{
  label:string;
  value:number;
}){

  return(

    <div className="flex justify-between border-b pb-3">

      <div>{label}</div>

      <div className="font-bold">

        ${Math.round(value).toLocaleString()}

      </div>

    </div>

  )

}