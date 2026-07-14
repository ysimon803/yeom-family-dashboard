"use client";

type Props = {
  netWorth: number;
  investments: number;
  cash: number;
  homeEquity: number;
};

export default function WealthSummary({
  netWorth,
  investments,
  cash,
  homeEquity,
}: Props) {

  const cards = [

    {
      title: "Net Worth",
      value: netWorth,
      icon: "💎",
    },

    {
      title: "Investments",
      value: investments,
      icon: "📈",
    },

    {
      title: "Cash",
      value: cash,
      icon: "💵",
    },

    {
      title: "Home Equity",
      value: homeEquity,
      icon: "🏠",
    },

  ];


  return (

    <div className="grid grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow"
        >

          <div className="text-3xl">
            {card.icon}
          </div>


          <h3 className="mt-4 text-lg font-semibold">

            {card.title}

          </h3>


          <p className="mt-3 text-3xl font-bold text-blue-600">

            ${Math.round(
              card.value
            ).toLocaleString()}

          </p>


        </div>

      ))}

    </div>

  );

}