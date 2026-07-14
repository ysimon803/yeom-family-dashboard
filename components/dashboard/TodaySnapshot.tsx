"use client";

type Props = {
  netWorth: number;
  investments: number;
  houseFund: number;
};

export default function TodaySnapshot({
  netWorth,
  investments,
  houseFund,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">

      <Card
        title="Net Worth"
        value={`$${Math.round(netWorth).toLocaleString()}`}
        color="text-blue-600"
      />

      <Card
        title="Investments"
        value={`$${Math.round(investments).toLocaleString()}`}
        color="text-green-600"
      />

      <Card
        title="House Fund"
        value={`$${Math.round(houseFund).toLocaleString()}`}
        color="text-orange-500"
      />

    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </p>

    </div>
  );
}