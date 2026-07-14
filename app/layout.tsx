import "./globals.css";
import type { Metadata } from "next";

import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "WealthOS",
  description: "Personal Finance Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}