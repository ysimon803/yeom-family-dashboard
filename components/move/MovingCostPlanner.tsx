"use client";

type Props = {
  movingCompany?: number;
  utilityTransfer?: number;
  cleaning?: number;
  repairs?: number;
  furniture?: number;
  miscellaneous?: number;
};

export default function MovingCostPlanner({
  movingCompany = 2500,
  utilityTransfer = 500,
  cleaning = 600,
  repairs = 3000,
  furniture = 5000,
  miscellaneous = 1500,
}: Props) {
  const total =
    movingCompany +
    utilityTransfer +
    cleaning +
    repairs +
    furniture +
    miscellaneous;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🚚 Moving Cost Planner
      </h2>

      <div className="mt-6 space-y-3">

        <Row
          label="Moving Company"
          value={movingCompany}
        />

        <Row
          label="Utility Transfer"
          value={utilityTransfer}
        />

        <Row
          label="Cleaning"
          value={cleaning}
        />

        <Row
          label="Repairs"
          value={repairs}
        />

        <Row
          label="Furniture"
          value={furniture}
        />

        <Row
          label="Miscellaneous"
          value={miscellaneous}
        />

        <hr />

        <Row
          label="Total Moving Cost"
          value={total}
        />

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