"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Loader2, X } from "lucide-react";
import type { CreateFinancialGoalInput } from "@/lib/services/financialGoals";

type AddFinancialGoalModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (goal: CreateFinancialGoalInput) => Promise<void> | void;
};

const GOAL_CATEGORIES = [
  "Emergency Fund",
  "Home",
  "Retirement",
  "Education",
  "Vehicle",
  "Travel",
  "Investment",
  "Debt Payoff",
  "Other",
];

const GOAL_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#64748b",
];

function createInitialFormState(): CreateFinancialGoalInput {
  return {
    name: "",
    category: "Other",
    target_amount: 0,
    current_amount: 0,
    target_date: null,
    color: "#3b82f6",
  };
}

export default function AddFinancialGoalModal({
  isOpen,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AddFinancialGoalModalProps) {
  const [formData, setFormData] = useState<CreateFinancialGoalInput>(
    createInitialFormState,
  );
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setFormData(createInitialFormState());
    setError("");
  }, []);

  const handleClose = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }, [isSubmitting, onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleClose, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleNumberChange(
    field: "target_amount" | "current_amount",
    value: string,
  ) {
    const parsedValue = value === "" ? 0 : Number(value);

    setFormData((previous) => ({
      ...previous,
      [field]: Number.isNaN(parsedValue) ? 0 : parsedValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = formData.name.trim();
    const currentAmount = formData.current_amount ?? 0;

    if (!trimmedName) {
      setError("Please enter a goal name.");
      return;
    }

    if (formData.target_amount <= 0) {
      setError("Target amount must be greater than zero.");
      return;
    }

    if (currentAmount < 0) {
      setError("Current amount cannot be negative.");
      return;
    }

    try {
      await onSubmit({
        ...formData,
        name: trimmedName,
        current_amount: currentAmount,
        target_date: formData.target_date || null,
        color: formData.color ?? "#3b82f6",
      });
    } catch (submitError) {
      console.error("Failed to submit financial goal:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create the goal.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-financial-goal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2
              id="add-financial-goal-title"
              className="text-xl font-semibold text-slate-900 dark:text-white"
            >
              Add Financial Goal
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a new savings or financial milestone.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close add financial goal modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label
                htmlFor="goal-name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Goal name
              </label>

              <input
                id="goal-name"
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="2028 House Down Payment"
                autoFocus
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="goal-category"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category
              </label>

              <select
                id="goal-category"
                value={formData.category}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    category: event.target.value,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {GOAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="goal-target-amount"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Target amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    $
                  </span>

                  <input
                    id="goal-target-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      formData.target_amount === 0
                        ? ""
                        : formData.target_amount
                    }
                    onChange={(event) =>
                      handleNumberChange("target_amount", event.target.value)
                    }
                    placeholder="150000"
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="goal-current-amount"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Current amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    $
                  </span>

                  <input
                    id="goal-current-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      formData.current_amount === 0
                        ? ""
                        : formData.current_amount
                    }
                    onChange={(event) =>
                      handleNumberChange("current_amount", event.target.value)
                    }
                    placeholder="25000"
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="goal-target-date"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Target date
              </label>

              <input
                id="goal-target-date"
                type="date"
                value={formData.target_date ?? ""}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    target_date: event.target.value || null,
                  }))
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Goal color
              </legend>

              <div className="flex flex-wrap gap-3">
                {GOAL_COLORS.map((color) => {
                  const isSelected = formData.color === color;

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          color,
                        }))
                      }
                      disabled={isSubmitting}
                      className={`h-9 w-9 rounded-full border-4 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelected
                          ? "border-slate-900 dark:border-white"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select goal color ${color}`}
                      aria-pressed={isSelected}
                    />
                  );
                })}
              </div>
            </fieldset>

            {error ? (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                role="alert"
              >
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}