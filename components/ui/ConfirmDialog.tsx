"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type ConfirmVariant =
  | "danger"
  | "warning"
  | "primary";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const confirmButtonVariants = {
  danger: "danger",
  warning: "primary",
  primary: "primary",
} as const;

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
      >
        {cancelLabel}
      </Button>

      <Button
        variant={confirmButtonVariants[variant]}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <p className="leading-6 text-slate-600">
        {description}
      </p>
    </Modal>
  );
}