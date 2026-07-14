"use client";

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export default function AppLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}