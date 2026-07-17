import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedClasses = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-xl",
  full: "rounded-full",
};

export default function Skeleton({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className = "",
  style,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={[
        "animate-pulse bg-slate-200",
        roundedClasses[rounded],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
}