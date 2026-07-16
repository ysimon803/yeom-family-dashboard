"use client";

type Props = {
  companyRisk: number;
  emergencyMonths: number;
  houseProgress: number;
};

export default function PriorityRecommendationCard({
  companyRisk,
  emergencyMonths,
  houseProgress,
}: Props) {
  const priorities: string[] = [];

  if (emergencyMonths < 6) {
    priorities.push(
      "Increase your emergency fund to at least 6 months of expenses."
    );
  }

  if (companyRisk > 40) {
    priorities.push(
      "Gradually diversify Texas Instruments RSUs and stock options."
    );
  }

  if (houseProgress < 100) {
    priorities.push(
      "Continue building your home down payment fund."
    );
  }

  priorities.push(
    "Continue maximizing 401(k), Roth IRA and HSA contributions."
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        ⭐ Priority Recommendations
      </h2>

      <div className="mt-6 space-y-4">
        {priorities.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-100 p-4"
          >
            <span className="font-bold">
              #{index + 1}
            </span>

            {"  "}

            {item}
          </div>
        ))}
      </div>
    </div>
  );
}