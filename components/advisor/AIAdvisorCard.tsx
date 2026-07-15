"use client";

export default function AIAdvisorCard() {
  const recommendations = [
    "Continue maximizing your 401(k), Roth IRA and HSA contributions.",
    "Gradually reduce TI RSU concentration after vesting.",
    "Maintain a 6-month emergency fund before purchasing a new home.",
    "Keep saving toward your 2028 home purchase goal.",
    "Review your investment allocation every 6–12 months.",
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🤖 AI Recommendations
      </h2>

      <div className="mt-6 space-y-4">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-100 p-4"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}