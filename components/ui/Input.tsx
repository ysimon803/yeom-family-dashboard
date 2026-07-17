import type {
  InputHTMLAttributes,
} from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: Props) {
  const inputId =
    id ??
    props.name ??
    undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-600"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        {...props}
        className={[
          "w-full rounded-xl border border-slate-300",
          "bg-white px-4 py-3",
          "transition-colors",
          "focus:border-blue-500",
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-blue-200",
          "disabled:bg-slate-100",
          "disabled:text-slate-500",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}