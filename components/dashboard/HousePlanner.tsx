type Props = {
  homeValue: number;
  mortgage: number;
  cash: number;
  investments: number;

  targetPrice: number;
  downPercent: number;
};

export default function HousePlanner({
  homeValue,
  mortgage,
  cash,
  investments,
  targetPrice,
  downPercent,
}: Props) {
  const equity = homeValue - mortgage;

  const available =
    equity + cash + investments;

  const downPayment =
    targetPrice * (downPercent / 100);

  const progress = Math.min(
    Math.round((available / downPayment) * 100),
    100
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏡 2028 House Planner
      </h2>

      <div className="mt-8 space-y-5">

        <Row
          label="Current Home Value"
          value={homeValue}
        />

        <Row
          label="Mortgage Balance"
          value={mortgage}
          negative
        />

        <Row
          label="Home Equity"
          value={equity}
        />

        <Row
          label="Cash"
          value={cash}
        />

        <Row
          label="Investments"
          value={investments}
        />

        <Row
          label="Target Home Price"
          value={targetPrice}
        />

        <Row
          label="Required Down Payment"
          value={downPayment}
        />

      </div>

      <div className="mt-10">

        <div className="text-slate-500">
          Available Down Payment
        </div>

        <div className="mt-2 text-4xl font-bold text-green-600">
          ${available.toLocaleString()}
        </div>

      </div>

      <div className="mt-10">

        <div className="text-slate-500">
          Progress
        </div>

        <div className="mt-3 h-5 rounded-full bg-slate-200">

          <div
            className="h-5 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-3 text-xl font-bold">

          {progress}% Ready

        </div>

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
    <div className="flex justify-between border-b pb-3">

      <div>{label}</div>

      <div
        className={
          negative
            ? "font-bold text-red-600"
            : "font-bold"
        }
      >
        {negative ? "-" : ""}
        ${Math.abs(value).toLocaleString()}
      </div>

    </div>
  );
}