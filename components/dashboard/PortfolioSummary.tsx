type Investment = {
  account_name: string;
  ticker: string;
  balance: number;
};

type Props = {
  investments: Investment[];
};

export default function PortfolioSummary({
  investments,
}: Props) {

  const total =
    investments.reduce(
      (sum, item) => sum + item.balance,
      0
    );

  const tickerTotals: Record<string, number> = {};
  const accountTotals: Record<string, number> = {};

  investments.forEach((item) => {

    tickerTotals[item.ticker] =
      (tickerTotals[item.ticker] || 0) +
      item.balance;

    accountTotals[item.account_name] =
      (accountTotals[item.account_name] || 0) +
      item.balance;

  });

  const largestETF =
    Object.entries(tickerTotals)
      .sort((a,b)=>b[1]-a[1])[0];

  const largestAccount =
    Object.entries(accountTotals)
      .sort((a,b)=>b[1]-a[1])[0];

  const diversification =
    Math.max(
      40,
      100 -
      Object.keys(tickerTotals).length * 5
    );

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        📊 Portfolio Summary

      </h2>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <Item
          label="Total Investment"
          value={`$${total.toLocaleString()}`}
        />

        <Item
          label="Largest ETF"
          value={largestETF?.[0] ?? "-"}
        />

        <Item
          label="Largest Account"
          value={largestAccount?.[0] ?? "-"}
        />

        <Item
          label="Diversification"
          value={`${diversification}/100`}
        />

      </div>

    </div>

  );

}

function Item({
  label,
  value,
}:{
  label:string;
  value:string;
}){

  return(

    <div>

      <div className="text-slate-500">

        {label}

      </div>

      <div className="mt-2 text-2xl font-bold">

        {value}

      </div>

    </div>

  )

}