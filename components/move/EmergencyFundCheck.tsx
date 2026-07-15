"use client";

type Props = {
  availableCash: number;
  downPayment: number;
  closingCost: number;
  movingCost: number;
  monthlyExpense: number;
};

export default function EmergencyFundCheck({
  availableCash,
  downPayment,
  closingCost,
  movingCost,
  monthlyExpense,
}: Props) {

  const remainingCash =
    availableCash -
    downPayment -
    closingCost -
    movingCost;

  const monthsCovered =
    monthlyExpense > 0
      ? remainingCash / monthlyExpense
      : 0;

  const status =
    monthsCovered >= 6
      ? "Excellent"
      : monthsCovered >= 3
      ? "Good"
      : "Low";

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        🛟 Emergency Fund

      </h2>

      <div className="mt-6 space-y-4">

        <Row
          label="Available Cash"
          value={availableCash}
        />

        <Row
          label="Down Payment"
          value={downPayment}
        />

        <Row
          label="Closing Cost"
          value={closingCost}
        />

        <Row
          label="Moving Cost"
          value={movingCost}
        />

        <hr />

        <Row
          label="Remaining Cash"
          value={remainingCash}
        />

        <div className="pt-4">

          <div className="text-lg font-bold">

            {monthsCovered.toFixed(1)} Months

          </div>

          <div className="text-slate-500">

            Emergency Fund Coverage

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-lg font-bold">

        {status === "Excellent" &&
          "✅ Excellent Emergency Fund"}

        {status === "Good" &&
          "🟡 Acceptable Emergency Fund"}

        {status === "Low" &&
          "⚠️ Emergency Fund Too Low"}

      </div>

    </div>

  );

}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">

      <span>{label}</span>

      <span className="font-bold">
        ${Math.round(value).toLocaleString()}
      </span>

    </div>
  );
}