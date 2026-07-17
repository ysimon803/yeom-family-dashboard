"use client";

import { useEffect } from "react";

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

type Props = {
  open: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

const toastStyles: Record<ToastType, string> = {
  success:
    "border-green-200 bg-green-50 text-green-800",
  error:
    "border-red-200 bg-red-50 text-red-800",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800",
  info:
    "border-blue-200 bg-blue-50 text-blue-800",
};

const toastIcons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export default function Toast({
  open,
  message,
  type = "info",
  duration = 3000,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={[
        "fixed right-6 top-6 z-[100]",
        "flex w-full max-w-sm items-start gap-3",
        "rounded-2xl border p-4 shadow-lg",
        "animate-in fade-in slide-in-from-top-2",
        toastStyles[type],
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="text-lg"
      >
        {toastIcons[type]}
      </span>

      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-lg leading-none opacity-60 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}