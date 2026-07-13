"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    href: "/",
    label: "🏠 Dashboard",
  },
  {
    href: "/investments",
    label: "📈 Investments",
  },
  {
    href: "/settings",
    label: "⚙️ Settings",
  },
  {
  href: "/rsu",
  label: "💼 RSU Planner",
},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">

      <div className="p-8">

        <h1 className="text-2xl font-bold">

          💰 WealthOS

        </h1>

      </div>

      <nav className="space-y-2 px-4">

        {menus.map((menu) => (

          <Link
            key={menu.href}
            href={menu.href}
            className={`block rounded-xl px-4 py-3 transition ${
              pathname === menu.href
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            {menu.label}
          </Link>

        ))}

      </nav>

    </aside>
  );
}