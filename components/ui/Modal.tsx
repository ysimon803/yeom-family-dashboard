"use client";

import type { ReactNode } from "react";

type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

type Props = {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: ModalSize;
};

const sizes: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  size = "md",
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={[
          "w-full rounded-2xl bg-white shadow-2xl",
          sizes[size],
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-2xl text-slate-500 transition hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 border-t p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}