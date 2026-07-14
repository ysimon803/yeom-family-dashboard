type Props = {
  invested: number;
  current: number;
};

export default function PerformanceCard({
  invested,
  current,
}: Props) {

  const gain = current - invested;

  const percent =
    invested === 0
      ? 0
      : (gain / invested) * 100;

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        Portfolio Performance

      </h2>

      <div className="mt-8 grid grid-cols-3 gap-6">

        <Metric
          title="Invested"
          value={invested}
        />

        <Metric
          title="Current"
          value={current}
        />

        <Metric
          title="Gain"
          value={gain}
          percent={percent}
        />

      </div>

    </div>

  );

}

type MetricProps = {
  title: string;
  value: number;
  percent?: number;
};

function Metric({
  title,
  value,
  percent,
}: MetricProps) {

  return (

    <div>

      <p className="text-slate-500">

        {title}

      </p>

      <h3 className="mt-3 text-3xl font-bold">

        ${Math.round(value).toLocaleString()}

      </h3>

      {percent !== undefined && (

        <p
          className={
            percent >= 0
              ? "mt-2 font-semibold text-green-600"
              : "mt-2 font-semibold text-red-600"
          }
        >

          {percent.toFixed(2)}%

        </p>

      )}

    </div>

  );

}