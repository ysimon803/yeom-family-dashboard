import "./globals.css";
import type { Metadata } from "next";

import Sidebar from "@/components/layout/Sidebar";

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

        <div className="flex min-h-screen">

          <Sidebar />

          <main className="flex-1 p-8">

            {children}

          </main>

        </div>

      </body>

    </html>
  );
}