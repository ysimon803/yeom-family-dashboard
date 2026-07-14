"use client";

const activities = [
  {
    title: "Updated Investment Portfolio",
    time: "Today",
  },
  {
    title: "House Fund Increased",
    time: "Yesterday",
  },
  {
    title: "Mortgage Balance Updated",
    time: "2 days ago",
  },
  {
    title: "Dashboard Synced",
    time: "This Week",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex items-center justify-between border-b pb-3"
          >

            <span>{item.title}</span>

            <span className="text-sm text-slate-500">
              {item.time}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}