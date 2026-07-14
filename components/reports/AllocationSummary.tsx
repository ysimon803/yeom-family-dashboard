"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


type Item = {
  name: string;
  value: number;
};


type Props = {
  data: Item[];
};


const colors = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
];


export default function AllocationSummary({
  data,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        📊 Asset Allocation

      </h2>


      <div className="mt-8 h-96">


        <ResponsiveContainer>

          <PieChart>


            <Pie

              data={data}

              dataKey="value"

              nameKey="name"

              outerRadius={130}

              label

            >

              {data.map((item, index) => (

                <Cell

                  key={`${item.name}-${index}`}

                  fill={
                    colors[
                      index %
                      colors.length
                    ]
                  }

                />

              ))}


            </Pie>


            <Tooltip />


          </PieChart>


        </ResponsiveContainer>


      </div>


    </div>

  );

}