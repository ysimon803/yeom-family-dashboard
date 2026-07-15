"use client";

type Props = {
  homeSaleProceeds: number;
  targetHomePrice: number;
  downPaymentPercent: number;
};

export default function SellBuyGapSimulator({
  homeSaleProceeds,
  targetHomePrice,
  downPaymentPercent,
}: Props) {
  const downPayment =
    targetHomePrice *
    (downPaymentPercent / 100);

  const closingCost =
    targetHomePrice * 0.03;

  const totalCashNeeded =
    downPayment + closingCost;

  const remainingCash =
    homeSaleProceeds - totalCashNeeded;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🔄 Sell → Buy Gap
      </h2>

      <div className="mt-6 space-y-4">

        <Row
          label="Home Sale Proceeds"
          value={homeSaleProceeds}
        />

        <Row
          label="Down Payment"
          value={downPayment}
        />

        <Row
          label="Closing Cost"
          value={closingCost}
        />

        <hr />

        <Row
          label="Total Cash Needed"
          value={totalCashNeeded}
        />

        <Row
          label={
            remainingCash >= 0
              ? "Cash Remaining"
              : "Cash Shortfall"
          }
          value={Math.abs(remainingCash)}
        />

      </div>

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-lg font-bold">

        {remainingCash >= 0
          ? "✅ Home sale alone covers the purchase."
          : "⚠️ Additional cash is required."}

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