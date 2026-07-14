"use client";

import { useState } from "react";

import {
  calculateHousingCost,
} from "@/services/move/calculateHousingCost";

type Props = {
  defaultPrice: number;
};

export default function HouseSimulator({
  defaultPrice,
}: Props) {

  const [price, setPrice] =
    useState(defaultPrice);

  const [rate, setRate] =
    useState(6.5);

  const [down, setDown] =
    useState(20);

  const loan =
    price * (1 - down / 100);

  const cost =
    calculateHousingCost(
      price,
      rate,
      down
    );

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏡 House Simulator
      </h2>

      <div className="mt-8 space-y-8">

        <div>

          <p>Home Price</p>

          <input
            type="range"
            min={500000}
            max={1500000}
            step={10000}
            value={price}
            onChange={(e) =>
              setPrice(Number(e.target.value))
            }
            className="w-full"
          />

          <p className="mt-2 text-xl font-bold">
            ${price.toLocaleString()}
          </p>

        </div>

        <div>

          <p>Interest Rate</p>

          <input
            type="range"
            min={4}
            max={8}
            step={0.1}
            value={rate}
            onChange={(e) =>
              setRate(Number(e.target.value))
            }
            className="w-full"
          />

          <p className="mt-2 text-xl font-bold">
            {rate.toFixed(1)}%
          </p>

        </div>

        <div>

          <p>Down Payment</p>

          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={down}
            onChange={(e) =>
              setDown(Number(e.target.value))
            }
            className="w-full"
          />

          <p className="mt-2 text-xl font-bold">
            {down}%
          </p>

        </div>

        <div className="rounded-xl bg-slate-100 p-6">

          <div className="mb-6 flex justify-between">

            <span>Loan Amount</span>

            <span className="font-bold">
              ${Math.round(loan).toLocaleString()}
            </span>

          </div>

          <div className="space-y-3 rounded-xl bg-white p-6">

            <Row
              label="Principal & Interest"
              value={cost.payment}
            />

            <Row
              label="Property Tax"
              value={cost.propertyTax}
            />

            <Row
              label="Insurance"
              value={cost.insurance}
            />

            <Row
              label="HOA"
              value={cost.hoa}
            />

            <Row
              label="PMI"
              value={cost.pmi}
            />

            <hr />

            <div className="flex justify-between">

              <span className="text-xl font-bold">
                Total Monthly
              </span>

              <span className="text-2xl font-bold text-blue-600">
                ${Math.round(cost.total).toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export function estimateMonthlyHousing(
  price: number,
  rate: number,
  down: number
) {

  return calculateHousingCost(
    price,
    rate,
    down
  ).total;

}

type RowProps = {
  label: string;
  value: number;
};

function Row({
  label,
  value,
}: RowProps) {

  return (

    <div className="flex justify-between">

      <span>
        {label}
      </span>

      <span className="font-semibold">
        ${Math.round(value).toLocaleString()}
      </span>

    </div>

  );

}