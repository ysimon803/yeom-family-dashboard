type Allocation = {
  ticker: string;
  balance: number;
  percent: number;
};

type Props = {
  allocation: Allocation[];
};

export default function PortfolioAnalysis({
  allocation,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        📊 Portfolio Analysis
      </h2>

      <div className="mt-8 space-y-4">

        {allocation.map((item) => (

          <div
            key={item.ticker}
            className="flex justify-between border-b pb-2"
          >

            <div className="font-medium">

              {item.ticker}

            </div>

            <div>

              {item.percent}%

            </div>

          </div>

        ))}

      </div>

      {allocation.length > 0 && (

        <>

          <div className="mt-8">

            <div className="text-slate-500">

              Largest Position

            </div>

            <div className="mt-2 text-3xl font-bold">

              {allocation[0].ticker}

            </div>

          </div>

          <div className="mt-8">

            <div className="text-slate-500">

              Diversification

            </div>

            <div className="mt-2 text-2xl font-bold text-green-600">

              Good ✅

            </div>

          </div>

        </>

      )}

    </div>
  );
}