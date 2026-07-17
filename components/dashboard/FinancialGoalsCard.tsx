"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Loader2,
  Pencil,
  Plus,
  Target,
  Trash2,
} from "lucide-react";

import AddFinancialGoalModal from "@/components/dashboard/AddFinancialGoalModal";
import EditFinancialGoalModal from "@/components/dashboard/EditFinancialGoalModal";
import DeleteFinancialGoalModal from "@/components/dashboard/DeleteFinancialGoalModal";

import {
  createFinancialGoal,
  deleteFinancialGoal,
  getFinancialGoals,
  updateFinancialGoal,
  type CreateFinancialGoalInput,
  type FinancialGoal,
  type UpdateFinancialGoalInput,
} from "@/lib/services/financialGoals";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTargetDate(date: string | null) {
  if (!date) {
    return "No target date";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No target date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function calculateProgress(currentAmount: number, targetAmount: number) {
  if (targetAmount <= 0) {
    return 0;
  }

  return Math.min(
    Math.max((currentAmount / targetAmount) * 100, 0),
    100,
  );
}

function sortGoalsByTargetDate(goals: FinancialGoal[]) {
  return [...goals].sort((firstGoal, secondGoal) => {
    if (!firstGoal.target_date && !secondGoal.target_date) {
      return 0;
    }

    if (!firstGoal.target_date) {
      return 1;
    }

    if (!secondGoal.target_date) {
      return -1;
    }

    return firstGoal.target_date.localeCompare(secondGoal.target_date);
  });
}

type FinancialGoalsContentProps = {
  initialGoals: FinancialGoal[];
};

function FinancialGoalsContent({
  initialGoals,
}: FinancialGoalsContentProps) {
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedGoal, setSelectedGoal] =
    useState<FinancialGoal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [goalToDelete, setGoalToDelete] =
    useState<FinancialGoal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState("");

  async function handleReloadGoals() {
    try {
      setError("");

      const data = await getFinancialGoals();

      setGoals(sortGoalsByTargetDate(data));
    } catch (loadError) {
      console.error("Failed to load financial goals:", loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load financial goals.",
      );
    }
  }

  async function handleCreateGoal(input: CreateFinancialGoalInput) {
    try {
      setIsCreating(true);
      setError("");

      const createdGoal = await createFinancialGoal(input);

      setGoals((previousGoals) =>
        sortGoalsByTargetDate([...previousGoals, createdGoal]),
      );

      setIsAddModalOpen(false);
    } catch (createError) {
      console.error("Failed to create financial goal:", createError);

      throw createError;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateGoal(
    goalId: string,
    input: UpdateFinancialGoalInput,
  ) {
    try {
      setIsUpdating(true);
      setError("");

      const updatedGoal = await updateFinancialGoal(goalId, input);

      setGoals((previousGoals) =>
        sortGoalsByTargetDate(
          previousGoals.map((goal) =>
            goal.id === updatedGoal.id ? updatedGoal : goal,
          ),
        ),
      );

      setSelectedGoal(null);
    } catch (updateError) {
      console.error("Failed to update financial goal:", updateError);

      throw updateError;
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteGoal(goalId: string) {
    try {
      setIsDeleting(true);
      setError("");

      await deleteFinancialGoal(goalId);

      setGoals((previousGoals) =>
        previousGoals.filter((goal) => goal.id !== goalId),
      );

      setGoalToDelete(null);
    } catch (deleteError) {
      console.error("Failed to delete financial goal:", deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the financial goal.",
      );

      throw deleteError;
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Financial Goals
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track progress toward your family&apos;s major financial
              milestones.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
        </div>

        {error ? (
          <div
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div className="flex-1">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void handleReloadGoals()}
                className="mt-2 font-medium underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        ) : null}

        {goals.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              No financial goals yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Add your first goal to begin tracking your emergency fund, house
              down payment, retirement, or other financial priorities.
            </p>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create First Goal
            </button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress = calculateProgress(
                goal.current_amount,
                goal.target_amount,
              );

              const remainingAmount = Math.max(
                goal.target_amount - goal.current_amount,
                0,
              );

              return (
                <article
                  key={goal.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className="mt-1 h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: goal.color,
                        }}
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                          {goal.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {goal.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <span className="mr-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {progress.toFixed(0)}%
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedGoal(goal)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        aria-label={`Edit ${goal.name}`}
                        title="Edit goal"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setGoalToDelete(goal)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        aria-label={`Delete ${goal.name}`}
                        title="Delete goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Saved
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(goal.current_amount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Target
                      </p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(goal.target_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatTargetDate(goal.target_date)}
                    </div>

                    <span>
                      {formatCurrency(remainingAmount)} remaining
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {isAddModalOpen ? (
        <AddFinancialGoalModal
          isOpen
          isSubmitting={isCreating}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateGoal}
        />
      ) : null}

      {selectedGoal ? (
        <EditFinancialGoalModal
          key={selectedGoal.id}
          goal={selectedGoal}
          isSubmitting={isUpdating}
          onClose={() => setSelectedGoal(null)}
          onSubmit={handleUpdateGoal}
        />
      ) : null}

      {goalToDelete ? (
        <DeleteFinancialGoalModal
          key={goalToDelete.id}
          goal={goalToDelete}
          isDeleting={isDeleting}
          onClose={() => setGoalToDelete(null)}
          onConfirm={handleDeleteGoal}
        />
      ) : null}
    </>
  );
}

export default function FinancialGoalsCard() {
  const [initialGoals, setInitialGoals] = useState<FinancialGoal[] | null>(
    null,
  );
  const [initialError, setInitialError] = useState("");

  if (initialGoals === null && !initialError) {
    void getFinancialGoals()
      .then((data) => {
        setInitialGoals(sortGoalsByTargetDate(data));
      })
      .catch((loadError: unknown) => {
        console.error("Failed to load financial goals:", loadError);

        setInitialError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load financial goals.",
        );
      });
  }

  if (initialError) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div className="flex-1">
            <p>{initialError}</p>

            <button
              type="button"
              onClick={() => {
                setInitialError("");
                setInitialGoals(null);
              }}
              className="mt-2 font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (initialGoals === null) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex min-h-48 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading financial goals...
          </div>
        </div>
      </section>
    );
  }

  return <FinancialGoalsContent initialGoals={initialGoals} />;
}