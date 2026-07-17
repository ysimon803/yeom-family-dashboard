import AccountCards from "@/components/dashboard/AccountCards";
import AssetAllocation from "@/components/dashboard/AssetAllocation";
import MonthlyCashFlow from "@/components/dashboard/MonthlyCashFlow";
import NetWorthSummary from "@/components/dashboard/NetWorthSummary";
import NetWorthTrend from "@/components/dashboard/NetWorthTrend";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingByCategory from "@/components/dashboard/SpendingByCategory";
import InvestmentSummaryCard from "@/components/dashboard/InvestmentSummaryCard";
import SpendingByCategoryChart from "@/components/dashboard/SpendingByCategoryChart";
import CashFlowCard from "@/components/dashboard/CashFlowCard";
import NetWorthCard from "@/components/dashboard/NetWorthCard";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import FinancialGoalsCard from "@/components/dashboard/FinancialGoalsCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Yeom Family WealthOS
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Financial Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Connected accounts, net worth trends,
            asset allocation, spending, cash flow,
            and recent financial activity.
          </p>
        </header>

        <div className="space-y-10">
          <NetWorthSummary />

          <main className="space-y-6">
            <FinancialOverview />

            <NetWorthTrend />

            <FinancialGoalsCard />

            <div className="grid gap-6 xl:grid-cols-2">
              <InvestmentSummaryCard />
              <SpendingByCategoryChart />
              <CashFlowCard />
              <NetWorthCard />
            </div>
          </main>
          <AccountCards />

          <AssetAllocation />

          <MonthlyCashFlow />

          <SpendingByCategory />

          <RecentTransactions />
        </div>
      </div>
    </main>
  );
}