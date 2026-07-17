import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  success:
    "bg-green-100 text-green-700 border-green-200",

  warning:
    "bg-amber-100 text-amber-700 border-amber-200",

  danger:
    "bg-red-100 text-red-700 border-red-200",

  info:
    "bg-blue-100 text-blue-700 border-blue-200",

  neutral:
    "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <span
      {...props}
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}