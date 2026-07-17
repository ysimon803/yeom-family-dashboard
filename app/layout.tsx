import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import AppLayout from "@/components/layout/AppLayout";
import ThemeProvider from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "WealthOS",
  description: "Personal Finance Dashboard",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: Props) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}