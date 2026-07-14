"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Item = {
  ticker: string;
  balance: number;
};

type Props = {
  data?: Item[];
};

const colors = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#0891b2",
  "#dc2626",
  "#ca8a04",
];

export default function AllocationChart({
  data = [],
}: Props) {

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Asset Allocation
      </h2>

      <div className="mt-8 h-96">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="balance"
              nameKey="ticker"
              outerRadius={130}
              label
            >

              {data.map((_, index) => (

                <Cell
                  key={index}
                  fill={colors[index % colors.length]}
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