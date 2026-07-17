"use client";

import { useTheme } from "next-themes";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: string;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: "☀️",
  },
  {
    value: "dark",
    label: "Dark",
    icon: "🌙",
  },
  {
    value: "system",
    label: "System",
    icon: "💻",
  },
];

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
    resolvedTheme,
  } = useTheme();

  const currentTheme =
    theme === "system"
      ? resolvedTheme
      : theme;

  return (
    <div
      className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-label="Theme selector"
    >
      {themeOptions.map((option) => {
        const active =
          option.value === "system"
            ? theme === "system"
            : currentTheme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-label={option.label}
            aria-pressed={active}
            className={[
              "flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
              active
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            <span>{option.icon}</span>

            <span className="hidden sm:inline">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}