"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    title: "Investments",
    href: "/investments",
    icon: "📈",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "⚙️",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "📊",
  },
  {
    title: "Scenarios",
    href: "/scenarios",
    icon: "🏡",
  },
  {
    title: "AI Coach",
    href: "/ai",
    icon: "🤖",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white">

      <div className="p-8 border-b border-slate-700">

        <h1 className="text-2xl font-bold">
          Yeom Family
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Wealth Dashboard
        </p>

      </div>

      <nav className="p-5 space-y-2">

        {menus.map((menu) => (

          <Link
            key={menu.href}
            href={menu.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition

            ${
              pathname === menu.href
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >

            <span className="text-xl">

              {menu.icon}

            </span>

            <span>

              {menu.title}

            </span>

          </Link>

        ))}

      </nav>

      <div className="absolute bottom-8 left-6 right-6">

        <div className="rounded-xl bg-slate-800 p-4">

          <div className="text-sm text-slate-400">

            Current Version

          </div>

          <div className="mt-2 font-bold">

            v1.0.0

          </div>

        </div>

      </div>

    </aside>
  );
}