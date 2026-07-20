"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SpendingInsightsCard from "@/components/dashboard/SpendingInsightsCard";
import SpendingInsightsDebugPanel from "@/components/dashboard/SpendingInsightsDebugPanel";
import {
  analyzeSpending,
  type SpendingAnalysisResult,
} from "@/services/ai/spendingAnalyzer";
import {
  createSpendingAnalyzerInput,
  getLatestTransactionDate,
  type SpendingBudget,
  type SpendingTransaction,
} from "@/services/ai/spendingDataAdapter";

interface SpendingInsightsSectionProps {
  monthlyIncome: number;
  maxInsights?: number;
}

interface TransactionApiItem {
  id?: string;
  transaction_id?: string;
  amount?: number | string | null;
  date?: string | null;
  name?: string | null;
  merchant_name?: string | null;
  merchantName?: string | null;
  category?: string | null;
  primary_category?: string | null;
  primaryCategory?: string | null;
  detailed_category?: string | null;
  detailedCategory?: string | null;
  transaction_type?: string | null;
  transactionType?: string | null;
  type?: string | null;
  pending?: boolean | null;
}

interface BudgetApiItem {
  category?: string | null;
  amount?: number | string | null;
  budget_amount?: number | string | null;
  budgetAmount?: number | string | null;
  monthly_limit?: number | string | null;
  monthlyLimit?: number | string | null;
}

interface TransactionsApiResponse {
  transactions?: TransactionApiItem[];
  data?: TransactionApiItem[];
}

interface BudgetsApiResponse {
  budgets?: BudgetApiItem[];
  data?: BudgetApiItem[];
}

interface SpendingDebugData {
  transactionApiCount: number;
  budgetApiCount: number;
  invalidTransactionCount: number;
  invalidBudgetCount: number;
}

function toSafeNumber(
  value: number | string | null | undefined,
): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
}

function parseDateValue(
  value: string,
): Date | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const dateOnlyPattern =
    /^\d{4}-\d{2}-\d{2}$/;

  const parsedDate = dateOnlyPattern.test(
    normalizedValue,
  )
    ? new Date(
        `${normalizedValue}T00:00:00`,
      )
    : new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getTransactionItems(
  response:
    | TransactionsApiResponse
    | TransactionApiItem[],
): TransactionApiItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.transactions)) {
    return response.transactions;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

function getBudgetItems(
  response:
    | BudgetsApiResponse
    | BudgetApiItem[],
): BudgetApiItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.budgets)) {
    return response.budgets;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

function normalizeTransaction(
  transaction: TransactionApiItem,
): SpendingTransaction | null {
  if (
    !transaction.date ||
    !parseDateValue(transaction.date)
  ) {
    return null;
  }

  const transactionId =
    transaction.id ??
    transaction.transaction_id;

  return {
    id: transactionId,
    amount: toSafeNumber(transaction.amount),
    date: transaction.date,
    name: transaction.name ?? null,
    merchant_name:
      transaction.merchant_name ??
      transaction.merchantName ??
      null,
    category:
      transaction.category ?? null,
    primary_category:
      transaction.primary_category ??
      transaction.primaryCategory ??
      null,
    detailed_category:
      transaction.detailed_category ??
      transaction.detailedCategory ??
      null,
    transaction_type:
      transaction.transaction_type ??
      transaction.transactionType ??
      transaction.type ??
      null,
    pending: transaction.pending ?? false,
  };
}

function normalizeBudget(
  budget: BudgetApiItem,
): SpendingBudget | null {
  const category = budget.category?.trim();

  if (!category) {
    return null;
  }

  const amount = toSafeNumber(
    budget.amount ??
      budget.budget_amount ??
      budget.budgetAmount ??
      budget.monthly_limit ??
      budget.monthlyLimit,
  );

  return {
    category,
    amount: Math.max(0, amount),
  };
}

function getMonthKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(
      2,
      "0",
    ),
  ].join("-");
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

function countTransactionsForMonth(
  transactions: SpendingTransaction[],
  referenceDate: Date,
): number {
  const expectedMonthKey =
    getMonthKey(referenceDate);

  return transactions.filter(
    (transaction) => {
      const transactionDate =
        parseDateValue(transaction.date);

      return (
        transactionDate !== null &&
        getMonthKey(transactionDate) ===
          expectedMonthKey
      );
    },
  ).length;
}

function getDuplicateCount(
  transactions: SpendingTransaction[],
): number {
  const seenKeys = new Set<string>();
  let duplicateCount = 0;

  transactions.forEach((transaction) => {
    const amount = toSafeNumber(transaction.amount);

const key = transaction.id
  ? `id:${transaction.id}`
  : [
      transaction.date,
      transaction.name ?? "",
      transaction.merchant_name ?? "",
      amount.toFixed(2),
    ]
      .join("|")
      .toLowerCase();

    if (seenKeys.has(key)) {
      duplicateCount += 1;
      return;
    }

    seenKeys.add(key);
  });

  return duplicateCount;
}

function LoadingCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="h-4 w-36 rounded bg-slate-200" />

        <div className="mt-3 h-8 w-64 rounded bg-slate-200" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-xl bg-slate-200" />
        </div>
      </div>
    </section>
  );
}

function ErrorCard({
  message,
}: {
  message: string;
}) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <p className="text-sm font-semibold text-red-700">
        AI Spending Analyzer
      </p>

      <h2 className="mt-1 text-xl font-bold text-slate-950">
        Spending analysis unavailable
      </h2>

      <p className="mt-2 text-sm text-red-600">
        {message}
      </p>
    </section>
  );
}

export default function SpendingInsightsSection({
  monthlyIncome,
  maxInsights = 5,
}: SpendingInsightsSectionProps) {
  const [transactions, setTransactions] =
    useState<SpendingTransaction[]>([]);

  const [budgets, setBudgets] = useState<
    SpendingBudget[]
  >([]);

  const [debugData, setDebugData] =
    useState<SpendingDebugData>({
      transactionApiCount: 0,
      budgetApiCount: 0,
      invalidTransactionCount: 0,
      invalidBudgetCount: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSpendingData() {
      try {
        setError(null);

        const [
          transactionsResponse,
          budgetsResponse,
        ] = await Promise.all([
          fetch("/api/transactions", {
            cache: "no-store",
          }),
          fetch("/api/budgets", {
            cache: "no-store",
          }),
        ]);

        if (!transactionsResponse.ok) {
          throw new Error(
            `Transactions request failed: ${transactionsResponse.status}`,
          );
        }

        if (!budgetsResponse.ok) {
          throw new Error(
            `Budgets request failed: ${budgetsResponse.status}`,
          );
        }

        const transactionsJson =
          (await transactionsResponse.json()) as
            | TransactionsApiResponse
            | TransactionApiItem[];

        const budgetsJson =
          (await budgetsResponse.json()) as
            | BudgetsApiResponse
            | BudgetApiItem[];

        const transactionItems =
          getTransactionItems(
            transactionsJson,
          );

        const budgetItems =
          getBudgetItems(budgetsJson);

        const normalizedTransactions =
          transactionItems
            .map(normalizeTransaction)
            .filter(
              (
                transaction,
              ): transaction is SpendingTransaction =>
                transaction !== null,
            );

        const normalizedBudgets =
          budgetItems
            .map(normalizeBudget)
            .filter(
              (
                budget,
              ): budget is SpendingBudget =>
                budget !== null,
            );

        if (!cancelled) {
          setTransactions(
            normalizedTransactions,
          );

          setBudgets(normalizedBudgets);

          setDebugData({
            transactionApiCount:
              transactionItems.length,
            budgetApiCount:
              budgetItems.length,
            invalidTransactionCount:
              transactionItems.length -
              normalizedTransactions.length,
            invalidBudgetCount:
              budgetItems.length -
              normalizedBudgets.length,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load spending data",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSpendingData();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestTransactionDate = useMemo(
  () => getLatestTransactionDate(transactions),
  [transactions],
);

const analysisReferenceDate = useMemo(
  () => latestTransactionDate ?? new Date(),
  [latestTransactionDate],
);

  const analysis =
    useMemo<SpendingAnalysisResult>(() => {
      const analyzerInput =
        createSpendingAnalyzerInput({
          transactions,
          monthlyIncome,
          budgets,
          referenceDate:
            analysisReferenceDate,
        });

      return analyzeSpending(analyzerInput);
    }, [
      analysisReferenceDate,
      budgets,
      monthlyIncome,
      transactions,
    ]);

  const currentMonthTransactionCount =
    useMemo(
      () =>
        countTransactionsForMonth(
          transactions,
          analysisReferenceDate,
        ),
      [
        analysisReferenceDate,
        transactions,
      ],
    );

  const previousMonthTransactionCount =
    useMemo(
      () =>
        countTransactionsForMonth(
          transactions,
          getPreviousMonthDate(
            analysisReferenceDate,
          ),
        ),
      [
        analysisReferenceDate,
        transactions,
      ],
    );

  const duplicateTransactionCount =
    useMemo(
      () =>
        getDuplicateCount(transactions),
      [transactions],
    );

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  return (
    <div className="grid gap-4">
      <SpendingInsightsCard
        analysis={analysis}
        maxInsights={maxInsights}
      />

      <SpendingInsightsDebugPanel
        transactionApiCount={
          debugData.transactionApiCount
        }
        normalizedTransactionCount={
          transactions.length
        }
        budgetApiCount={
          debugData.budgetApiCount
        }
        normalizedBudgetCount={
          budgets.length
        }
        latestTransactionDate={
          latestTransactionDate
        }
        analysisReferenceDate={
          analysisReferenceDate
        }
        currentMonthTransactionCount={
          currentMonthTransactionCount
        }
        previousMonthTransactionCount={
          previousMonthTransactionCount
        }
        ignoredTransactionCount={
          debugData.invalidTransactionCount +
          debugData.invalidBudgetCount
        }
        duplicateTransactionCount={
          duplicateTransactionCount
        }
      />
    </div>
  );
}