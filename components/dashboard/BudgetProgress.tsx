"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CATEGORY_MAP } from "@/lib/categoryMapping";

interface Budget {
  id: string;
  category: string;
  monthly_limit: number | string;
  warning_percent: number | null;
}

interface Transaction {
  id?: string;
  transaction_id?: string;
  amount: number | string;
  transaction_date?: string;
  date?: string;
  category?: string | string[] | null;
  personal_finance_primary?: string | null;
  personal_finance_detailed?: string | null;

  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  pending?: boolean;
}

interface BudgetsResponse {
  success?: boolean;
  budgets?: Budget[];
  budget?: Budget;
  error?: string;
}

interface TransactionsResponse {
  success?: boolean;
  transactions?: Transaction[];
  error?: string;
}

interface BudgetUsage {
  budget: Budget;
  spent: number;
  limit: number;
  percentage: number;
  remaining: number;
}

interface BudgetFormValues {
  category: string;
  monthlyLimit: string;
  warningPercent: string;
}

const EMPTY_FORM: BudgetFormValues = {
  category: "",
  monthlyLimit: "",
  warningPercent: "80",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function cleanCategory(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function mapCategory(value: string): string {
  const normalized = cleanCategory(value);

  return CATEGORY_MAP[normalized] ?? normalized;
}

function getTransactionCategory(
  transaction: Transaction
): string {
  const primary =
    transaction.personal_finance_primary ??
    transaction.personal_finance_category?.primary;

  if (primary?.trim()) {
    return mapCategory(primary);
  }

  const detailed =
    transaction.personal_finance_detailed ??
    transaction.personal_finance_category?.detailed;

  if (detailed?.trim()) {
    return mapCategory(detailed);
  }

  if (Array.isArray(transaction.category)) {
    const categories = transaction.category
      .filter(
        (category): category is string =>
          typeof category === "string" &&
          category.trim().length > 0
      )
      .map(mapCategory);

    for (const category of categories) {
      if (CATEGORY_MAP[category]) {
        return CATEGORY_MAP[category];
      }

      if (
        [
          "food",
          "shopping",
          "travel",
          "transportation",
          "entertainment",
          "healthcare",
        ].includes(category)
      ) {
        return category;
      }
    }

    return categories[0] ?? "other";
  }

  if (
    typeof transaction.category === "string" &&
    transaction.category.trim()
  ) {
    return mapCategory(transaction.category);
  }

  return "other";
}

function getTransactionAmount(
  transaction: Transaction
): number {
  const amount = Number(transaction.amount);

  if (!Number.isFinite(amount)) {
    return 0;
  }

  return amount;
}

function getTransactionDate(
  transaction: Transaction
): string | null {
  return (
    transaction.transaction_date ??
    transaction.date ??
    null
  );
}

function isCurrentMonth(
  dateValue: string | null
): boolean {
  if (!dateValue) {
    return false;
  }

  const date = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
}

function getProgressClass(
  percentage: number,
  warningPercent: number
): string {
  if (percentage >= 100) {
    return "bg-red-500";
  }

  if (percentage >= warningPercent) {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
}

function getStatusText(
  percentage: number,
  warningPercent: number
): string {
  if (percentage >= 100) {
    return "Over budget";
  }

  if (percentage >= warningPercent) {
    return "Near limit";
  }

  return "On track";
}

async function readJsonResponse<T>(
  response: Response,
  fallbackError: string
): Promise<T> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();

    throw new Error(
      `${fallbackError}: ${responseText.slice(0, 120)}`
    );
  }

  return (await response.json()) as T;
}

function LoadingState() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded bg-gray-100" />

        <div className="mt-6 space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>

              <div className="mt-3 h-3 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface BudgetFormModalProps {
  mode: "add" | "edit";
  values: BudgetFormValues;
  saving: boolean;
  error: string | null;
  onChange: (
    field: keyof BudgetFormValues,
    value: string
  ) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function BudgetFormModal({
  mode,
  values,
  saving,
  error,
  onChange,
  onClose,
  onSubmit,
}: BudgetFormModalProps) {
  const isEditing = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-form-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="budget-form-title"
              className="text-xl font-semibold text-gray-900"
            >
              {isEditing ? "Edit Budget" : "Add Budget"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Update the category limit and warning level."
                : "Create a new monthly spending category."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close budget form"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="budget-category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <input
              id="budget-category"
              type="text"
              value={values.category}
              onChange={(event) => {
                onChange("category", event.target.value);
              }}
              placeholder="Example: Utilities"
              disabled={saving}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="budget-monthly-limit"
              className="text-sm font-medium text-gray-700"
            >
              Monthly limit
            </label>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>

              <input
                id="budget-monthly-limit"
                type="number"
                min="0.01"
                step="0.01"
                value={values.monthlyLimit}
                onChange={(event) => {
                  onChange(
                    "monthlyLimit",
                    event.target.value
                  );
                }}
                placeholder="500"
                disabled={saving}
                className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="budget-warning-percent"
              className="text-sm font-medium text-gray-700"
            >
              Warning percentage
            </label>

            <div className="relative mt-2">
              <input
                id="budget-warning-percent"
                type="number"
                min="1"
                max="100"
                step="1"
                value={values.warningPercent}
                onChange={(event) => {
                  onChange(
                    "warningPercent",
                    event.target.value
                  );
                }}
                disabled={saving}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                %
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              The progress bar turns amber after this
              percentage.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteBudgetModalProps {
  budget: Budget;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteBudgetModal({
  budget,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteBudgetModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-budget-title"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <h2
          id="delete-budget-title"
          className="text-xl font-semibold text-gray-900"
        >
          Delete Budget
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Are you sure you want to delete the{" "}
          <span className="font-semibold text-gray-900">
            {budget.category}
          </span>{" "}
          budget? Transaction data will not be deleted.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BudgetProgress() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  const [formMode, setFormMode] = useState<
    "add" | "edit" | null
  >(null);

  const [selectedBudget, setSelectedBudget] =
    useState<Budget | null>(null);

  const [deleteBudget, setDeleteBudget] =
    useState<Budget | null>(null);

  const [formValues, setFormValues] =
    useState<BudgetFormValues>(EMPTY_FORM);

  const [formError, setFormError] = useState<
    string | null
  >(null);

  const [deleteError, setDeleteError] = useState<
    string | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadBudgetData() {
    try {
      setLoading(true);
      setError(null);

      const [budgetsResponse, transactionsResponse] =
        await Promise.all([
          fetch("/api/budgets", {
            method: "GET",
            cache: "no-store",
          }),
          fetch("/api/transactions?limit=500", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

      const budgetsResult =
        await readJsonResponse<BudgetsResponse>(
          budgetsResponse,
          "Budget API returned a non-JSON response"
        );

      const transactionsResult =
        await readJsonResponse<TransactionsResponse>(
          transactionsResponse,
          "Transactions API returned a non-JSON response"
        );

      if (!budgetsResponse.ok || !budgetsResult.success) {
        throw new Error(
          budgetsResult.error ??
            "Unable to load budgets"
        );
      }

      if (
        !transactionsResponse.ok ||
        !transactionsResult.success
      ) {
        throw new Error(
          transactionsResult.error ??
            "Unable to load transactions"
        );
      }

      setBudgets(budgetsResult.budgets ?? []);
      setTransactions(
        transactionsResult.transactions ?? []
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load budget data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial client-side data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBudgetData();
  }, []);

  function openAddModal() {
    setSelectedBudget(null);
    setFormValues(EMPTY_FORM);
    setFormError(null);
    setFormMode("add");
  }

  function openEditModal(budget: Budget) {
    setSelectedBudget(budget);

    setFormValues({
      category: budget.category,
      monthlyLimit: String(budget.monthly_limit),
      warningPercent: String(
        budget.warning_percent ?? 80
      ),
    });

    setFormError(null);
    setFormMode("edit");
  }

  function closeFormModal() {
    if (saving) {
      return;
    }

    setFormMode(null);
    setSelectedBudget(null);
    setFormValues(EMPTY_FORM);
    setFormError(null);
  }

  function openDeleteModal(budget: Budget) {
    setDeleteError(null);
    setDeleteBudget(budget);
  }

  function closeDeleteModal() {
    if (deleting) {
      return;
    }

    setDeleteBudget(null);
    setDeleteError(null);
  }

  function updateFormValue(
    field: keyof BudgetFormValues,
    value: string
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function handleBudgetSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const category = formValues.category.trim();
    const monthlyLimit = Number(
      formValues.monthlyLimit
    );

    const warningPercent = Number(
      formValues.warningPercent
    );

    if (!category) {
      setFormError("Category is required.");
      return;
    }

    if (
      !Number.isFinite(monthlyLimit) ||
      monthlyLimit <= 0
    ) {
      setFormError(
        "Monthly limit must be greater than zero."
      );
      return;
    }

    if (
      !Number.isFinite(warningPercent) ||
      warningPercent < 1 ||
      warningPercent > 100
    ) {
      setFormError(
        "Warning percentage must be between 1 and 100."
      );
      return;
    }

    if (formMode === "edit" && !selectedBudget) {
      setFormError("No budget was selected.");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const isEditing = formMode === "edit";

      const response = await fetch("/api/budgets", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing
            ? {
                id: selectedBudget?.id,
              }
            : {}),
          category,
          monthly_limit: monthlyLimit,
          warning_percent: warningPercent,
        }),
      });

      const result =
        await readJsonResponse<BudgetsResponse>(
          response,
          "Budget API returned a non-JSON response"
        );

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            `Unable to ${
              isEditing ? "update" : "create"
            } budget`
        );
      }

      closeFormModal();
      await loadBudgetData();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save budget"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBudget() {
    if (!deleteBudget) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError(null);

      const response = await fetch(
        `/api/budgets?id=${encodeURIComponent(
          deleteBudget.id
        )}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await readJsonResponse<BudgetsResponse>(
          response,
          "Budget API returned a non-JSON response"
        );

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ?? "Unable to delete budget"
        );
      }

      setDeleteBudget(null);
      await loadBudgetData();
    } catch (deleteRequestError) {
      setDeleteError(
        deleteRequestError instanceof Error
          ? deleteRequestError.message
          : "Unable to delete budget"
      );
    } finally {
      setDeleting(false);
    }
  }

  const budgetUsage = useMemo<BudgetUsage[]>(() => {
    const categoryTotals = new Map<string, number>();

    transactions.forEach((transaction) => {
      const transactionDate =
        getTransactionDate(transaction);

      if (
        transaction.pending ||
        !isCurrentMonth(transactionDate)
      ) {
        return;
      }

      const amount =
        getTransactionAmount(transaction);

      if (amount <= 0) {
        return;
      }

      const category =
        getTransactionCategory(transaction);

      if (category === "other") {
        return;
      }

      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) + amount
      );
    });

    return budgets.map((budget) => {
      const rawLimit = Number(
        budget.monthly_limit
      );

      const limit =
        Number.isFinite(rawLimit) && rawLimit > 0
          ? rawLimit
          : 0;

      const normalizedBudgetCategory =
        mapCategory(budget.category);

      const spent =
        categoryTotals.get(
          normalizedBudgetCategory
        ) ?? 0;

      const percentage =
        limit > 0 ? (spent / limit) * 100 : 0;

      return {
        budget,
        spent,
        limit,
        percentage,
        remaining: limit - spent,
      };
    });
  }, [budgets, transactions]);

  const totals = useMemo(() => {
    return budgetUsage.reduce(
      (result, item) => ({
        spent: result.spent + item.spent,
        limit: result.limit + item.limit,
      }),
      {
        spent: 0,
        limit: 0,
      }
    );
  }, [budgetUsage]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Budget tracking unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            void loadBudgetData();
          }}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </section>
    );
  }

  const totalPercentage =
    totals.limit > 0
      ? (totals.spent / totals.limit) * 100
      : 0;

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Spending Plan
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Monthly Budget
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current spending compared with your
              monthly category limits.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">
                Total budget usage
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totals.spent)}{" "}
                <span className="text-base font-medium text-gray-400">
                  / {formatCurrency(totals.limit)}
                </span>
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {totalPercentage.toFixed(0)}% used
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Add Budget
            </button>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
            <h3 className="font-medium text-gray-900">
              No budgets yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your first monthly spending limit.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add Budget
            </button>
          </div>
        ) : (
          <div className="mt-7 space-y-6">
            {budgetUsage.map((item) => {
              const warningPercent =
                item.budget.warning_percent ?? 80;

              const progressWidth = Math.min(
                Math.max(item.percentage, 0),
                100
              );

              const status = getStatusText(
                item.percentage,
                warningPercent
              );

              return (
                <article
                  key={item.budget.id}
                  className="rounded-2xl border border-gray-100 p-4 transition hover:border-gray-200 hover:bg-gray-50/50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.budget.category}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {status} · Warning at{" "}
                        {warningPercent}%
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm sm:text-right">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.spent)}
                        </span>

                        <span className="text-gray-400">
                          {" "}
                          / {formatCurrency(item.limit)}
                        </span>

                        <span className="ml-2 font-medium text-gray-600">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            openEditModal(
                              item.budget
                            );
                          }}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            openDeleteModal(
                              item.budget
                            );
                          }}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressClass(
                        item.percentage,
                        warningPercent
                      )}`}
                      style={{
                        width: `${progressWidth}%`,
                      }}
                    />
                  </div>

                  <p
                    className={[
                      "mt-2 text-xs",
                      item.remaining < 0
                        ? "text-red-600"
                        : "text-gray-500",
                    ].join(" ")}
                  >
                    {item.remaining >= 0
                      ? `${formatCurrency(
                          item.remaining
                        )} remaining`
                      : `${formatCurrency(
                          Math.abs(item.remaining)
                        )} over budget`}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {formMode && (
        <BudgetFormModal
          mode={formMode}
          values={formValues}
          saving={saving}
          error={formError}
          onChange={updateFormValue}
          onClose={closeFormModal}
          onSubmit={handleBudgetSubmit}
        />
      )}

      {deleteBudget && (
        <DeleteBudgetModal
          budget={deleteBudget}
          deleting={deleting}
          error={deleteError}
          onClose={closeDeleteModal}
          onConfirm={() => {
            void handleDeleteBudget();
          }}
        />
      )}
    </>
  );
}