import type { ReactNode } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  const showAction =
    Boolean(actionLabel) &&
    typeof onAction === "function";

  return (
    <Card className="text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl"
        >
          {icon}
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {showAction && (
          <div className="mt-6">
            <Button onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}