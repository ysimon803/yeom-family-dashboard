"use client";

type Props = {
  current: number;
  target: number;
};

export default function MissionProgress({
  current,
  target,
}: Props) {

  const progress = Math.min(
    Math.round((current / target) * 100),
    100
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🎯 Current Mission
      </h2>

      <p className="mt-5 text-slate-500">
        Craig Ranch Down Payment
      </p>

      <div className="mt-5 h-3 rounded-full bg-slate-200">

        <div
          className="h-3 rounded-full bg-green-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-5 flex justify-between">

        <span>
          ${Math.round(current).toLocaleString()}
        </span>

        <span>
          ${Math.round(target).toLocaleString()}
        </span>

      </div>

      <p className="mt-4 text-xl font-bold text-green-600">

        {progress}% Complete

      </p>

    </div>
  );
}