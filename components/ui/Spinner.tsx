import type { HTMLAttributes } from "react";

type SpinnerSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

type Props = HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize;
  label?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
  xl: "h-12 w-12 border-4",
};

export default function Spinner({
  size = "md",
  label = "Loading",
  className = "",
  ...props
}: Props) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={[
        "inline-block animate-spin rounded-full",
        "border-current border-r-transparent",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="sr-only">
        {label}
      </span>
    </span>
  );
}