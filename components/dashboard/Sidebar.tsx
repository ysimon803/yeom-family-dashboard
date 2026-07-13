const menus = [
  "Dashboard",
  "Investments",
  "House",
  "RSU",
  "Cash Flow",
  "Reports",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">
        🏠 Yeom Family
      </h1>

      <nav className="space-y-2">
        {menus.map((menu) => (
          <button
            key={menu}
            className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-slate-800"
          >
            {menu}
          </button>
        ))}
      </nav>
    </aside>
  );
}