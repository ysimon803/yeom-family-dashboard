type Props = {
  home: number;
  cash: number;
  investments: number;
  mortgage: number;
};

export default function AssetBreakdown({
  home,
  cash,
  investments,
  mortgage,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Assets Breakdown
      </h2>

      <div className="mt-8 space-y-5">

        <Row
          label="🏠 Home"
          value={home}
        />

        <Row
          label="💵 Cash"
          value={cash}
        />

        <Row
          label="📈 Investments"
          value={investments}
        />

        <Row
          label="🏦 Mortgage"
          value={mortgage}
          negative
        />

      </div>

    </div>
  );
}

type RowProps = {
  label: string;
  value: number;
  negative?: boolean;
};

function Row({
  label,
  value,
  negative,
}: RowProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <div className="text-lg">
        {label}
      </div>

      <div
        className={`text-xl font-bold ${
          negative ? "text-red-600" : "text-slate-900"
        }`}
      >
        {negative ? "-" : ""}$
        {Math.abs(value).toLocaleString()}
      </div>

    </div>
  );
}