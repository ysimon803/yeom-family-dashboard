import AccountCards from "@/components/dashboard/AccountCards";
import AIAdvisorCard from "@/components/dashboard/AIAdvisorCard";
import AssetAllocation from "@/components/dashboard/AssetAllocation";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import CashFlowCard from "@/components/dashboard/CashFlowCard";
import FinancialGoalsCard from "@/components/dashboard/FinancialGoalsCard";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import HousePlannerCard from "@/components/dashboard/HousePlannerCard";
import InvestmentSummaryCard from "@/components/dashboard/InvestmentSummaryCard";
import MonthlyCashFlow from "@/components/dashboard/MonthlyCashFlow";
import NetWorthCard from "@/components/dashboard/NetWorthCard";
import NetWorthSummary from "@/components/dashboard/NetWorthSummary";
import NetWorthTrend from "@/components/dashboard/NetWorthTrend";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingByCategory from "@/components/dashboard/SpendingByCategory";
import SpendingByCategoryChart from "@/components/dashboard/SpendingByCategoryChart";
import SpendingInsightsSection from "@/components/dashboard/SpendingInsightsSection";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-8 rounded-2xl border border-gray-200 bg-white px-5 py-6 shadow-sm sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide text-blue-600">
                Yeom Family WealthOS
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Financial Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Monitor your connected accounts, net worth, investments,
                spending, cash flow, goals, and recent financial activity.
              </p>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <PlaidLinkButton />
            </div>
          </div>
        </header>

        <div className="space-y-8 lg:space-y-10">
          <section
            aria-labelledby="wealth-summary-heading"
            className="space-y-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Overview
              </p>

              <h2
                id="wealth-summary-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Wealth Summary
              </h2>
            </div>

            <NetWorthSummary />
          </section>

          <section
            aria-labelledby="financial-overview-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Financial health
              </p>

              <h2
                id="financial-overview-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Financial Overview
              </h2>
            </div>

            <FinancialOverview />
          </section>

          <section
            aria-labelledby="planning-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Planning
              </p>

              <h2
                id="planning-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Goals and Home Planning
              </h2>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-2">
              <HousePlannerCard
                currentSavings={100000}
                targetHomePrice={850000}
                downPaymentPercent={20}
                monthlySavings={3000}
                expectedAnnualReturn={7}
                monthsUntilPurchase={24}
              />

              <FinancialGoalsCard />
            </div>
          </section>

          <section
            aria-labelledby="net-worth-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Performance
              </p>

              <h2
                id="net-worth-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Net Worth Trend
              </h2>
            </div>

            <NetWorthTrend />
          </section>

          <section
            aria-labelledby="key-metrics-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Key metrics
              </p>

              <h2
                id="key-metrics-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Financial Metrics
              </h2>
            </div>

            <div className="grid items-stretch gap-6 md:grid-cols-2">
              <InvestmentSummaryCard />
              <SpendingByCategoryChart />
              <CashFlowCard />
              <NetWorthCard />
            </div>
          </section>

          <section
            aria-labelledby="accounts-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Accounts
              </p>

              <h2
                id="accounts-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Connected Accounts
              </h2>
            </div>

            <AccountCards />
          </section>

          <section
            aria-labelledby="portfolio-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Portfolio
              </p>

              <h2
                id="portfolio-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Asset Allocation
              </h2>
            </div>

            <AssetAllocation />
          </section>

          <section
            aria-labelledby="cash-flow-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Monthly activity
              </p>

              <h2
                id="cash-flow-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Cash Flow and Spending
              </h2>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-2">
              <MonthlyCashFlow />
              <SpendingByCategory />
            </div>
          </section>

          <section
            aria-labelledby="insights-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Intelligence
              </p>

              <h2
                id="insights-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Spending Insights
              </h2>
            </div>

            <SpendingInsightsSection
              monthlyIncome={12041}
              maxInsights={5}
            />
          </section>

          <section
            aria-labelledby="activity-heading"
            className="space-y-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Activity
              </p>

              <h2
                id="activity-heading"
                className="mt-1 text-lg font-semibold text-gray-900"
              >
                Recent Activity and Recommendations
              </h2>
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
              <RecentTransactions />

              <div className="space-y-6">
                <AIAdvisorCard />
                <BudgetProgress />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}