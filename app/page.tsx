import Sidebar from "@/components/dashboard/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <section className="flex-1 p-8">
        <Dashboard />
      </section>
    </main>
  );
}