type Props = {
  allocation: {
    ticker: string;
    percent: number;
  }[];
};

export default function RebalanceAdvisor({
  allocation,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🤖 AI Rebalancing Advisor
      </h2>

      <div className="mt-8 space-y-4">

        {allocation.map((item) => {

          let message = "Keep";

          if (item.percent > 45) {
            message = "Reduce";
          }

          if (item.percent < 10) {
            message = "Increase";
          }

          return (

            <div
              key={item.ticker}
              className="flex justify-between border-b pb-3"
            >

              <span>
                {item.ticker}
              </span>

              <span className="font-semibold">
                {message}
              </span>

            </div>

          );

        })}

      </div>

    </div>

  );

}