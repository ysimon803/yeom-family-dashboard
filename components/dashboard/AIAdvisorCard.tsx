"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  analyzeSpending,
  type SpendingCategoryData,
} from "@/services/ai/spendingAnalyzer";

interface Transaction {
  id?: string;
  transaction_id?: string;
  name?: string | null;
  merchant_name?: string | null;
  amount: number | string;

  date?: string;
  transaction_date?: string;

  category?: string | string[] | null;

  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  personal_finance_primary?: string | null;
  personal_finance_detailed?: string | null;

  pending?: boolean;
  is_removed?: boolean;
}

interface Budget {
  id?: string;
  category?: string | null;
  amount?: number | string | null;
  budget_amount?: number | string | null;
  monthly_limit?: number | string | null;
}

interface TransactionsResponse {
  success?: boolean;
  transactions?: Transaction[];
  data?: Transaction[];
  error?: string;
}

interface BudgetsResponse {
  success?: boolean;
  budgets?: Budget[];
  data?: Budget[];
  error?: string;
}

interface AIAdvice {
  headline: string;
  summary: string;
  recommendations: string[];
}

interface AIAdviceResponse {
  success?: boolean;
  advice?: AIAdvice;
  error?: string;
}

interface AIAdvisorCardProps {
  monthlyIncome?: number;
}

const AI_ADVISOR_ENABLED =
  process.env.NEXT_PUBLIC_AI_ADVISOR_ENABLED ===
  "true";

function toSafeNumber(
  value: number | string | null | undefined,
): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function formatCurrency(
  amount: number,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(
  value: number,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(Math.abs(value) / 100);
}

function normalizeCategoryName(
  category: string,
): string {
  return category
    .replaceAll("_", " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getTransactionCategory(
  transaction: Transaction,
): string {
  const primaryCategory =
    transaction.personal_finance_primary ??
    transaction.personal_finance_category
      ?.primary;

  if (primaryCategory) {
    return normalizeCategoryName(
      primaryCategory,
    );
  }

  if (
    Array.isArray(transaction.category)
  ) {
    const firstCategory =
      transaction.category[0];

    return firstCategory
      ? normalizeCategoryName(
          firstCategory,
        )
      : "Other";
  }

  if (
    typeof transaction.category ===
      "string" &&
    transaction.category.trim()
  ) {
    return normalizeCategoryName(
      transaction.category,
    );
  }

  return "Other";
}

function isExcludedCategory(
  category: string,
): boolean {
  const normalized =
    category.toLowerCase();

  return [
    "income",
    "transfer",
    "payment",
    "payroll",
    "deposit",
    "credit card payment",
    "loan payment",
  ].some((excludedCategory) =>
    normalized.includes(
      excludedCategory,
    ),
  );
}

function getTransactionDate(
  transaction: Transaction,
): string | null {
  return (
    transaction.transaction_date ??
    transaction.date ??
    null
  );
}

function parseTransactionDate(
  date: string,
): Date | null {
  const parsedDate = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `${date}T12:00:00`
      : date,
  );

  return Number.isNaN(
    parsedDate.getTime(),
  )
    ? null
    : parsedDate;
}

function isSameMonth(
  date: Date,
  targetDate: Date,
): boolean {
  return (
    date.getFullYear() ===
      targetDate.getFullYear() &&
    date.getMonth() ===
      targetDate.getMonth()
  );
}

function getLatestTransactionDate(
  transactions: Transaction[],
): Date | null {
  let latestDate: Date | null = null;

  transactions.forEach(
    (transaction) => {
      const rawDate =
  getTransactionDate(transaction);

if (!rawDate) {
  return;
}

const parsedDate =
  parseTransactionDate(rawDate);

      if (!parsedDate) {
        return;
      }

      if (
        latestDate === null ||
        parsedDate.getTime() >
          latestDate.getTime()
      ) {
        latestDate = parsedDate;
      }
    },
  );

  return latestDate;
}

function getPreviousMonthDate(
  referenceDate: Date,
): Date {
  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() - 1,
    1,
  );
}

function getBudgetAmount(
  budget: Budget,
): number {
  return Math.max(
    0,
    toSafeNumber(
      budget.amount ??
        budget.budget_amount ??
        budget.monthly_limit,
    ),
  );
}

function buildCategoryData(
  transactions: Transaction[],
  budgets: Budget[],
  referenceDate: Date,
): SpendingCategoryData[] {
  const previousMonthDate =
    getPreviousMonthDate(referenceDate);

  const categoryMap = new Map<
    string,
    SpendingCategoryData
  >();

  transactions.forEach(
    (transaction) => {
      if (transaction.pending) {
        return;
      }

      const rawDate =
  getTransactionDate(transaction);

if (!rawDate) {
  return;
}

const transactionDate =
  parseTransactionDate(rawDate);

      if (!transactionDate) {
        return;
      }

      const amount = Math.abs(
    toSafeNumber(transaction.amount)
);

      if (amount <= 0) {
        return;
      }

      const category =
        getTransactionCategory(
          transaction,
        );

      if (
        isExcludedCategory(category)
      ) {
        return;
      }

      const existingCategory =
        categoryMap.get(category) ?? {
          category,
          currentAmount: 0,
          previousAmount: 0,
          budgetAmount: 0,
        };

      if (
        isSameMonth(
          transactionDate,
          referenceDate,
        )
      ) {
        existingCategory.currentAmount +=
          amount;
      }

      if (
        isSameMonth(
          transactionDate,
          previousMonthDate,
        )
      ) {
        existingCategory.previousAmount =
          (existingCategory.previousAmount ??
            0) + amount;
      }

      categoryMap.set(
        category,
        existingCategory,
      );
    },
  );

  budgets.forEach((budget) => {
    const rawCategory =
      budget.category?.trim();

    if (!rawCategory) {
      return;
    }

    const category =
      normalizeCategoryName(
        rawCategory,
      );

    const existingCategory =
      categoryMap.get(category) ?? {
        category,
        currentAmount: 0,
        previousAmount: 0,
        budgetAmount: 0,
      };

    existingCategory.budgetAmount =
      getBudgetAmount(budget);

    categoryMap.set(
      category,
      existingCategory,
    );
  });

  return Array.from(
    categoryMap.values(),
  )
    .filter(
      (category) =>
        category.currentAmount > 0 ||
        (category.previousAmount ?? 0) >
          0 ||
        (category.budgetAmount ?? 0) >
          0,
    )
    .sort(
      (firstCategory, secondCategory) =>
        secondCategory.currentAmount -
        firstCategory.currentAmount,
    );
}

function getCurrentTransactionCount(
  transactions: Transaction[],
  referenceDate: Date,
): number {
  return transactions.filter(
    (transaction) => {
      if (transaction.pending) {
        return false;
      }

      const rawDate =
  getTransactionDate(transaction);

if (!rawDate) {
  return false;
}

const date =
  parseTransactionDate(rawDate);

      if (!date) {
        return false;
      }

      const amount = toSafeNumber(
        transaction.amount,
      );

      if (amount <= 0) {
        return false;
      }

      const category =
        getTransactionCategory(
          transaction,
        );

      return (
        !isExcludedCategory(category) &&
        isSameMonth(
          date,
          referenceDate,
        )
      );
    },
  ).length;
}

function getInsightStyles(
  type:
    | "positive"
    | "warning"
    | "critical"
    | "neutral",
): string {
  switch (type) {
    case "critical":
      return "border-red-200 bg-red-50 text-red-900";

    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900";

    case "positive":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";

    default:
      return "border-blue-200 bg-blue-50 text-blue-900";
  }
}

function LoadingState() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-gray-200" />

        <div className="mt-3 h-8 w-60 rounded bg-gray-200" />

        <div className="mt-2 h-4 w-80 max-w-full rounded bg-gray-100" />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AIAdvisorCard({
  monthlyIncome = 12041,
}: AIAdvisorCardProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [budgets, setBudgets] =
    useState<Budget[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [aiAdvice, setAiAdvice] =
    useState<AIAdvice | null>(null);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiError, setAiError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let active = true;

    async function loadFinancialData() {
      try {
        setError(null);

        const [
          transactionsResponse,
          budgetsResponse,
        ] = await Promise.all([
          fetch(
            "/api/transactions?limit=500",
            {
              method: "GET",
              cache: "no-store",
            },
          ),
          fetch("/api/budgets", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const transactionsResult =
          (await transactionsResponse.json()) as
            | TransactionsResponse
            | Transaction[];

        const budgetsResult =
          (await budgetsResponse.json()) as
            | BudgetsResponse
            | Budget[];

        if (!transactionsResponse.ok) {
          const message = Array.isArray(
            transactionsResult,
          )
            ? null
            : transactionsResult.error;

          throw new Error(
            message ??
              "Unable to load transaction data",
          );
        }

        if (!budgetsResponse.ok) {
          const message = Array.isArray(
            budgetsResult,
          )
            ? null
            : budgetsResult.error;

          throw new Error(
            message ??
              "Unable to load budget data",
          );
        }

        const loadedTransactions =
          Array.isArray(
            transactionsResult,
          )
            ? transactionsResult
            : transactionsResult.transactions ??
              transactionsResult.data ??
              [];

        const loadedBudgets =
          Array.isArray(budgetsResult)
            ? budgetsResult
            : budgetsResult.budgets ??
              budgetsResult.data ??
              [];

        if (active) {
          setTransactions(
            loadedTransactions,
          );

          setBudgets(loadedBudgets);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load financial data",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFinancialData();

    return () => {
      active = false;
    };
  }, []);

  const latestTransactionDate =
    useMemo(
      () =>
        getLatestTransactionDate(
          transactions,
        ),
      [transactions],
    );

  const analysisReferenceDate =
    useMemo(
      () =>
        latestTransactionDate ??
        new Date(),
      [latestTransactionDate],
    );

  const categories = useMemo(
    () =>
      buildCategoryData(
        transactions,
        budgets,
        analysisReferenceDate,
      ),
    [
      analysisReferenceDate,
      budgets,
      transactions,
    ],
  );

  const totalSpending = useMemo(
    () =>
      categories.reduce(
        (total, category) =>
          total +
          category.currentAmount,
        0,
      ),
    [categories],
  );

  const previousTotalSpending =
    useMemo(
      () =>
        categories.reduce(
          (total, category) =>
            total +
            (category.previousAmount ??
              0),
          0,
        ),
      [categories],
    );

  const analysis = useMemo(
    () =>
      analyzeSpending({
        categories,
        monthlyIncome,
        totalSpending,
        previousTotalSpending,
      }),
    [
      categories,
      monthlyIncome,
      previousTotalSpending,
      totalSpending,
    ],
  );

  const transactionCount =
    useMemo(
      () =>
        getCurrentTransactionCount(
          transactions,
          analysisReferenceDate,
        ),
      [
        analysisReferenceDate,
        transactions,
      ],
    );

  const analysisMonth = useMemo(
    () =>
      new Intl.DateTimeFormat(
        "en-US",
        {
          month: "long",
          year: "numeric",
        },
      ).format(
        analysisReferenceDate,
      ),
    [analysisReferenceDate],
  );

  useEffect(() => {
  if (
    !AI_ADVISOR_ENABLED ||
    loading ||
    error ||
    transactions.length === 0 ||
    analysis.totalSpending <= 0
  ) {
    return;
  }

    const controller =
      new AbortController();

    let active = true;

    async function loadAiAdvice() {
      try {
        setAiLoading(true);
        setAiError(null);
        setAiAdvice(null);

        const response = await fetch(
          "/api/ai/spending-advice",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              analysis,
              analysisMonth,
            }),
            signal: controller.signal,
          },
        );

        const result =
          (await response.json()) as
            AIAdviceResponse;

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to generate AI advice.",
          );
        }

        if (
          !result.success ||
          !result.advice
        ) {
          throw new Error(
            result.error ??
              "AI advice was not returned.",
          );
        }

        if (active) {
          setAiAdvice(result.advice);
        }
      } catch (loadError) {
        if (
          loadError instanceof Error &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        if (active) {
          setAiError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to generate AI advice.",
          );
        }
      } finally {
        if (active) {
          setAiLoading(false);
        }
      }
    }

    void loadAiAdvice();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    analysis,
    analysisMonth,
    error,
    loading,
    transactions.length,
  ]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">
          WealthOS AI
        </p>

        <h2 className="mt-1 text-xl font-semibold text-red-900">
          AI Advisor unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">
          WealthOS AI
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          AI Financial Advisor
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          No transactions were found.
          Connect an account and synchronize
          transactions to generate financial
          insights.
        </p>
      </section>
    );
  }

  const spendingChange =
    analysis.spendingChangePercentage;

  const spendingIncreased =
    analysis.previousTotalSpending > 0 &&
    spendingChange > 0;

  const spendingDecreased =
    analysis.previousTotalSpending > 0 &&
    spendingChange < 0;

  const highestCategory =
    analysis.highestSpendingCategory;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            WealthOS AI
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            AI Financial Advisor
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Personalized insights generated
            from connected transaction and
            budget data.
          </p>
        </div>

        <div className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          AI Analysis
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            This Month
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(
              analysis.totalSpending,
            )}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {transactionCount} completed
            expense
            {transactionCount === 1
              ? ""
              : "s"}
          </p>
        </article>

        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Monthly Change
          </p>

          <p
            className={[
              "mt-2 text-2xl font-bold",
              spendingIncreased
                ? "text-red-600"
                : spendingDecreased
                  ? "text-emerald-600"
                  : "text-gray-900",
            ].join(" ")}
          >
            {analysis.previousTotalSpending <=
            0
              ? "Not available"
              : `${
                  spendingIncreased
                    ? "+"
                    : spendingDecreased
                      ? "-"
                      : ""
                }${formatPercentage(
                  spendingChange,
                )}`}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Compared with{" "}
            {formatCurrency(
              analysis.previousTotalSpending,
            )}{" "}
            last month
          </p>
        </article>

        <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            Top Category
          </p>

          <p className="mt-2 text-xl font-bold text-gray-900">
            {highestCategory?.category ??
              "Not available"}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {highestCategory
              ? `${formatCurrency(
                  highestCategory.currentAmount,
                )} spent this month`
              : "No categorized spending found"}
          </p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">
            Estimated Savings
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-950">
            {formatCurrency(
              analysis.savingsAmount,
            )}
          </p>

          <p className="mt-2 text-sm text-emerald-800">
            Estimated savings rate:{" "}
            {analysis.savingsRate.toFixed(1)}
            %
          </p>
        </article>

        <article className="rounded-xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-sm font-medium text-violet-700">
            Budget Status
          </p>

          <p className="mt-2 text-2xl font-bold text-violet-950">
            {
              analysis
                .overBudgetCategories
                .length
            }
          </p>

          <p className="mt-2 text-sm text-violet-800">
            categories currently over budget
          </p>
        </article>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Briefing
        </h3>

        {aiLoading && (
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="animate-pulse">
              <div className="h-5 w-48 rounded bg-blue-200" />

              <div className="mt-3 h-4 w-full rounded bg-blue-100" />

              <div className="mt-2 h-4 w-4/5 rounded bg-blue-100" />

              <div className="mt-5 space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-4 w-11/12 rounded bg-blue-100"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!aiLoading && aiAdvice && (
          <article className="mt-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="text-xl"
              >
                ✨
              </span>

              <h4 className="text-lg font-bold text-blue-950">
                {aiAdvice.headline}
              </h4>
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-900">
              {aiAdvice.summary}
            </p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-blue-950">
                Recommended Actions
              </p>

              <ol className="mt-3 space-y-3">
                {aiAdvice.recommendations.map(
                  (
                    recommendation,
                    index,
                  ) => (
                    <li
                      key={`${index}-${recommendation}`}
                      className="flex gap-3 text-sm leading-6 text-blue-900"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>

                      <span>
                        {recommendation}
                      </span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </article>
        )}
        {!AI_ADVISOR_ENABLED && (
          <article className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900">
              Generative AI briefing is paused
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Rule-based WealthOS insights are active.
              Generative AI recommendations will be
              enabled during the final deployment
              stage.
            </p>
          </article>
        )}
        {!aiLoading && aiError && (
          <article className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Generative AI briefing is
              temporarily unavailable
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              {aiError} The rule-based
              WealthOS insights below are
              still available.
            </p>
          </article>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Personalized Insights
        </h3>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {analysis.insights
            .slice(0, 6)
            .map((insight) => (
              <article
                key={insight.id}
                className={[
                  "rounded-xl border p-4",
                  getInsightStyles(
                    insight.type,
                  ),
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold">
                    {insight.title}
                  </h4>

                  <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
                    {insight.type}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6">
                  {insight.description}
                </p>
              </article>
            ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Analysis month: {analysisMonth}.
        AI-generated guidance is based only
        on the displayed spending analysis
        and is provided for informational
        purposes.
      </p>
    </section>
  );
}