import Link from "next/link";

import { CompanySummary } from "@/lib/types";

function formatSignedPercent(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function StockCard({ company }: { company: CompanySummary }) {
  const positive = company.change_percent >= 0;

  return (
    <Link
      href={`/company/${company.ticker}`}
      className="rounded-2xl border border-white/10 bg-panel p-5 transition hover:border-accent/50 hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{company.ticker}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{company.name}</h3>
          <p className="mt-1 text-sm text-muted">{company.sector}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            positive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {formatSignedPercent(company.change_percent)}
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">Current Price</p>
          <p className="text-2xl font-semibold text-white">{company.price.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Analyst Mood</p>
          <p className="text-sm font-medium text-accent">{company.analyst_sentiment}</p>
        </div>
      </div>
    </Link>
  );
}
