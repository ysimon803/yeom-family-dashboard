"use client";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger";

type Props = {
  score: number;
};

export default function FinancialHealthScoreCard({
  score,
}: Props) {
  const normalizedScore = Math.min(
    Math.max(score, 0),
    100
  );

  let scoreColor = "text-red-600";
  let progressColor = "bg-red-500";
  let label = "Needs Improvement";
  let badgeVariant: BadgeVariant = "danger";

  if (normalizedScore >= 80) {
    scoreColor = "text-green-600";
    progressColor = "bg-green-500";
    label = "Excellent";
    badgeVariant = "success";
  } else if (normalizedScore >= 60) {
    scoreColor = "text-amber-600";
    progressColor = "bg-amber-500";
    label = "Good";
    badgeVariant = "warning";
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            ❤️ Financial Health Score
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Overall financial condition
          </p>
        </div>

        <Badge variant={badgeVariant}>
          {label}
        </Badge>
      </div>

      <div className="mt-10 text-center">
        <div
          className={[
            "text-7xl font-bold",
            scoreColor,
          ].join(" ")}
        >
          {normalizedScore}
        </div>

        <div className="mt-8 h-5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              progressColor,
            ].join(" ")}
            style={{
              width: `${normalizedScore}%`,
            }}
            role="progressbar"
            aria-label="Financial health score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={normalizedScore}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    </Card>
  );
}