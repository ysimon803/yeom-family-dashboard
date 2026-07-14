"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import MissionCard from "./MissionCard";

type Props = {
  missionCurrent?: number;
  missionTarget?: number;
};

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
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
  {
    title: "Reports",
    href: "/reports",
    icon: "📄",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
];

export default function Sidebar({
  missionCurrent = 0,
  missionTarget = 1,
}: Props) {

  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white p-6 shadow-sm">

      <div className="mb-10">

        <h1 className="text-3xl font-bold">
          WealthOS
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Financial Operating System
        </p>

      </div>

      <nav className="flex flex-col gap-2">

        {menus.map((menu) => {

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`rounded-xl px-4 py-3 text-lg transition ${
                active
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="mr-3">
                {menu.icon}
              </span>

              {menu.title}

            </Link>
          );

        })}

      </nav>

      <MissionCard
        current={missionCurrent}
        target={missionTarget}
      />

    </aside>
  );
}