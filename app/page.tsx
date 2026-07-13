import MetricCard from "../components/ui/MetricCard";
import Sidebar from "../components/dashboard/Sidebar";

export default function Home() {
  return (
    <main
  style={{
    display: "flex",
    background: "#F3F6FB",
    minHeight: "100vh",
  }}
>
  <Sidebar />

  <div
    style={{
      flex: 1,
      padding: "40px",
    }}
  >
    <h1
      style={{
        fontSize: "42px",
        color: "#1D4ED8",
      }}
    >
      🏠 Yeom Family Wealth Dashboard
    </h1>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "20px",
        marginTop: "30px",
      }}
    >
      <MetricCard title="Net Worth" value="$707,301" />
      <MetricCard title="Retirement" value="$232,534" />
      <MetricCard title="TI Equity" value="$254,767" />
      <MetricCard title="Monthly Income" value="$12,041" />
    </div>
  </div>
</main>
  );
}