"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/move": "Move Planner",
  "/future": "Future Planner",
  "/investments": "Investments",
  "/retirement": "Retirement",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();

  const title = titles[pathname] ?? "WealthOS";

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      <div>
        <h2 className="text-3xl font-bold">{title}</h2>

        <p className="text-sm text-slate-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="rounded-xl border px-4 py-2 hover:bg-slate-100">
          🔔
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          Y
        </div>

      </div>

    </header>
  );
}