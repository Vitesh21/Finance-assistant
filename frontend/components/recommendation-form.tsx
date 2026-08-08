"use client";

import { FormEvent, useState } from "react";

import { createRecommendation } from "@/lib/api";
import { Action } from "@/lib/types";

const actions: Action[] = ["BUY", "HOLD", "SELL"];

export function RecommendationForm({
  ticker,
  companyName,
  score,
  entryPrice,
  thesis
}: {
  ticker: string;
  companyName: string;
  score: number;
  entryPrice: number;
  thesis: string;
}) {
  const [action, setAction] = useState<Action>("BUY");
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const formData = new FormData(event.currentTarget);
      await createRecommendation({
        ticker,
        company_name: companyName,
        action,
        confidence: Number(formData.get("confidence")),
        score,
        entry_price: entryPrice,
        horizon_days: Number(formData.get("horizon_days")),
        reason_summary: thesis
      });
      setStatus("Recommendation saved. The backend will now track profit/loss against live or sample price updates.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save recommendation.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-canvas p-5">
      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAction(item)}
            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              action === item
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/10 bg-panel text-white hover:border-white/30"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span>Confidence</span>
          <input
            name="confidence"
            type="number"
            min="0"
            max="100"
            defaultValue="80"
            className="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:border-accent"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-200">
          <span>Horizon (days)</span>
          <input
            name="horizon_days"
            type="number"
            min="1"
            defaultValue="30"
            className="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:border-accent"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Saving..." : "Save Recommendation"}
      </button>

      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
