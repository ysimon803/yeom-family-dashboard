export default function SettingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        ⚙️ Settings
      </h1>

      <p className="mt-2 text-slate-500">
        Manage your financial information.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          House
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">
              Current Value
            </label>

            <input
              className="w-full rounded-lg border p-2"
              defaultValue={430000}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Mortgage
            </label>

            <input
              className="w-full rounded-lg border p-2"
              defaultValue={410000}
            />
          </div>
        </div>
      </div>
    </main>
  );
}