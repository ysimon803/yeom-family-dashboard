"use client";

type Props = {
  current: number;
  target: number;
  title?: string;
};

export default function MissionCard({
  current,
  target,
  title = "Move to Craig Ranch",
}: Props) {

  const progress = Math.min(
    Math.round((current / target) * 100),
    100
  );

  return (
    <div className="mt-auto rounded-2xl bg-slate-100 p-5">

      <p className="text-sm text-slate-500">
        Current Mission
      </p>

      <h3 className="mt-2 text-lg font-bold">
        🏠 {title}
      </h3>

      <div className="mt-5 h-3 rounded-full bg-slate-300">

        <div
          className="h-3 rounded-full bg-green-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-4 flex justify-between">

        <span className="text-sm">
          ${Math.round(current).toLocaleString()}
        </span>

        <span className="text-sm">
          ${Math.round(target).toLocaleString()}
        </span>

      </div>

      <p className="mt-4 font-bold text-green-600">

        {progress}% Complete

      </p>

    </div>
  );
}