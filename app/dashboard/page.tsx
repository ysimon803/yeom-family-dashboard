import AccountCards from "@/components/dashboard/AccountCards";
import AssetAllocation from "@/components/dashboard/AssetAllocation";
import CashFlowCard from "@/components/dashboard/CashFlowCard";
import FinancialGoalsCard from "@/components/dashboard/FinancialGoalsCard";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import InvestmentSummaryCard from "@/components/dashboard/InvestmentSummaryCard";
import MonthlyCashFlow from "@/components/dashboard/MonthlyCashFlow";
import NetWorthCard from "@/components/dashboard/NetWorthCard";
import NetWorthSummary from "@/components/dashboard/NetWorthSummary";
import NetWorthTrend from "@/components/dashboard/NetWorthTrend";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingByCategory from "@/components/dashboard/SpendingByCategory";
import SpendingByCategoryChart from "@/components/dashboard/SpendingByCategoryChart";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import AIAdvisorCard from "@/components/dashboard/AIAdvisorCard";
import BudgetProgress from "@/components/dashboard/BudgetProgress";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Yeom Family WealthOS
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Financial Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-gray-500">
                Connected accounts, net worth trends, asset allocation,
                spending, cash flow, and recent financial activity.
              </p>
            </div>

            <div className="shrink-0">
              <PlaidLinkButton />
            </div>
          </div>
        </header>

        <div className="space-y-10">
          <section aria-label="Net worth summary">
            <NetWorthSummary />
          </section>

          <section
            className="space-y-6"
            aria-label="Financial overview"
          >
            <FinancialOverview />

            <NetWorthTrend />

            <FinancialGoalsCard />

            <div className="grid gap-6 xl:grid-cols-2">
              <InvestmentSummaryCard />
              <SpendingByCategoryChart />
              <CashFlowCard />
              <NetWorthCard />
            </div>
          </section>

          <section aria-label="Connected accounts">
            <AccountCards />
          </section>

          <section aria-label="Asset allocation">
            <AssetAllocation />
          </section>

          <section aria-label="Monthly cash flow">
            <MonthlyCashFlow />
          </section>

          <section aria-label="Spending by category">
            <SpendingByCategory />
          </section>

          <section aria-label="Recent transactions">
            <RecentTransactions />
            <AIAdvisorCard />
            <BudgetProgress />
          </section>
        </div>
      </div>
    </main>
  );
}