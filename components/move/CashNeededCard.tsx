type Props = {
  targetPrice: number;
  downPercent: number;
};

export default function CashNeededCard({
  targetPrice,
  downPercent,
}: Props) {

  const down =
    (targetPrice * downPercent) / 100;

  const closing =
    targetPrice * 0.03;

  const total =
    down + closing;

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        💵 Cash Needed
      </h2>

      <div className="mt-8 space-y-4">

        <Row
          label="Down Payment"
          value={down}
        />

        <Row
          label="Closing Cost"
          value={closing}
        />

        <Row
          label="Total Needed"
          value={total}
        />

      </div>

    </div>

  );

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

      <span>{label}</span>

      <span className="font-bold">
        ${Math.round(value).toLocaleString()}
      </span>

    </div>

  );

}