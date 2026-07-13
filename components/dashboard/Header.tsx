export default function Header() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          👋 Welcome, Seungwon
        </h1>

        <p className="mt-2 text-slate-500">
          Yeom Family Wealth Dashboard
        </p>
      </div>

      <div className="rounded-xl bg-white px-5 py-3 shadow">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Last Updated
        </p>

        <p className="font-semibold text-slate-700">
          {formattedDate}
        </p>
      </div>
    </header>
  );
}