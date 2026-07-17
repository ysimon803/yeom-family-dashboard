"use client";

import { useCallback, useEffect } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import type { FinancialGoal } from "@/lib/services/financialGoals";

type DeleteFinancialGoalModalProps = {
  goal: FinancialGoal;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: (goalId: string) => Promise<void> | void;
};

export default function DeleteFinancialGoalModal({
  goal,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteFinancialGoalModalProps) {
  const handleClose = useCallback(() => {
    if (!isDeleting) {
      onClose();
    }
  }, [isDeleting, onClose]);

  useEffect(() => {
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
  }, [handleClose]);

  async function handleConfirm() {
    await onConfirm(goal.id);
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
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-financial-goal-title"
        aria-describedby="delete-financial-goal-description"
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close delete confirmation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <h2
            id="delete-financial-goal-title"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Delete financial goal?
          </h2>

          <p
            id="delete-financial-goal-description"
            className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
          >
            You are about to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {goal.name}
            </span>
            . This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={isDeleting}
              className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Goal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}