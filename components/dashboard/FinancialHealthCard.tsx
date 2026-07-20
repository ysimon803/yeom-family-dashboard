"use client";

import CountUp from "react-countup";

import Card from "@/components/ui/Card";
import {
  calculateFinancialHealth,
  type FinancialHealthInput,
} from "@/services/finance/financialHealth";

type FinancialHealthCardProps =
  FinancialHealthInput;

const gradeStyles: Record<
  ReturnType<typeof calculateFinancialHealth>["grade"],
  string
> = {
  Excellent:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Good:
    "bg-blue-50 text-blue-700 ring-blue-200",
  Fair:
    "bg-amber-50 text-amber-700 ring-amber-200",
  "Needs Attention":
    "bg-red-50 text-red-700 ring-red-200",
};

function ScoreBar({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const percentage = Math.min(
    100,
    Math.max(0, (score / maxScore) * 100)
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-900">
          {score}/{maxScore}
        </p>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-valuenow={score}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function FinancialHealthCard(
  props: FinancialHealthCardProps
) {
  const result = calculateFinancialHealth(props);

  return (
    <Card
      title="Financial Health Score"
      subtitle="A snapshot of your current financial position"
      padding="lg"
    >
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-slate-50 ring-8 ring-slate-100">
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tight text-slate-950">
                <CountUp
                  end={result.score}
                  duration={1.2}
                  preserveValue
                />
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500">
                out of 100
              </p>
            </div>
          </div>

          <span
            className={[
              "mt-5 inline-flex rounded-full px-3 py-1.5",
              "text-sm font-semibold ring-1 ring-inset",
              gradeStyles[result.grade],
            ].join(" ")}
          >
            {result.grade}
          </span>
        </div>

        <div className="space-y-5">
          <ScoreBar
            label="Savings"
            score={result.breakdown.savings}
            maxScore={30}
          />

          <ScoreBar
            label="Debt Position"
            score={result.breakdown.debt}
            maxScore={25}
          />

          <ScoreBar
            label="Cash Flow"
            score={result.breakdown.cashFlow}
            maxScore={20}
          />

          <ScoreBar
            label="Net Worth"
            score={result.breakdown.netWorth}
            maxScore={25}
          />
        </div>
      </div>
    </Card>
  );
}