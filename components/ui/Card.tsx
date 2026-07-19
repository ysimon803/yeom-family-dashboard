import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type CardPadding =
  | "none"
  | "sm"
  | "md"
  | "lg";

type Props =
  HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    padding?: CardPadding;
  };

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  title,
  subtitle,
  padding = "lg",
  className = "",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}