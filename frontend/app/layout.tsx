import "@/app/globals.css";

import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Stock Research Assistant",
  description: "A full-stack stock research dashboard with explainable AI recommendations and tracked outcomes."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-7xl px-6 py-8">
          <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="text-sm uppercase tracking-[0.28em] text-accent">
                Finance Assistant
              </Link>
              <h1 className="mt-2 text-3xl font-semibold text-white">AI Stock Research Assistant</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted">
              Explain why a stock moved, summarize news and filings, generate a thesis, and track whether the recommendation actually made or lost money.
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
