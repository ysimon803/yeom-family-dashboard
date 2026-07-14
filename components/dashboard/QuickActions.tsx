"use client";

import Link from "next/link";

const actions = [
  {
    title: "Move Planner",
    href: "/move",
    icon: "🚚",
  },
  {
    title: "Future Planner",
    href: "/future",
    icon: "📈",
  },
  {
    title: "Investments",
    href: "/investments",
    icon: "💼",
  },
  {
    title: "Retirement",
    href: "/retirement",
    icon: "💰",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">

        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border p-6 transition hover:bg-slate-100"
          >
            <div className="text-4xl">
              {action.icon}
            </div>

            <div className="mt-3 text-lg font-semibold">
              {action.title}
            </div>
          </Link>
        ))}

      </div>

    </div>
  );
}