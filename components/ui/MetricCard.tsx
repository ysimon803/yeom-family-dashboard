import { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        {icon}
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        {value}
      </h2>

      {subtitle && (
        <p className="mt-3 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}