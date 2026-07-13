import NetWorthChart from "@/components/charts/NetWorthChart";
import AssetAllocation from "@/components/charts/AssetAllocation";

export default function ChartsSection() {
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-2">
      <NetWorthChart />

      <AssetAllocation />
    </div>
  );
}