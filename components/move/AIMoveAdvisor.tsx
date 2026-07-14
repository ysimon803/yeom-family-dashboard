type Props = {
  houseFund: number;
  targetFund: number;
  monthlyHousing: number;
  monthlyIncome: number;
};

export default function AIMoveAdvisor({
  houseFund,
  targetFund,
  monthlyHousing,
  monthlyIncome,
}: Props) {

  const progress =
    (houseFund / targetFund) * 100;

  const ratio =
    (monthlyHousing / monthlyIncome) * 100;

  const messages: string[] = [];

  if (progress >= 100) {
    messages.push(
      "✅ Down payment goal is already achieved."
    );
  } else if (progress >= 80) {
    messages.push(
      "🟡 Down payment goal is almost complete."
    );
  } else {
    messages.push(
      "🔴 Increase savings before purchasing."
    );
  }

  if (ratio <= 28) {
    messages.push(
      "✅ Monthly housing cost looks comfortable."
    );
  } else if (ratio <= 36) {
    messages.push(
      "🟡 Housing payment is acceptable but should be monitored."
    );
  } else {
    messages.push(
      "🔴 Monthly payment may be too high."
    );
  }

  messages.push(
    "💡 Continue selling vested RSUs according to your long-term plan and build your house fund."
  );

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        🤖 AI Move Advisor

      </h2>

      <div className="mt-6 space-y-4">

        {messages.map((message, index) => (

          <div
            key={index}
            className="rounded-lg bg-slate-100 p-4"
          >

            {message}

          </div>

        ))}

      </div>

    </div>

  );

}