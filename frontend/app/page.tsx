import Link from "next/link";

import { SectionCard } from "@/components/section-card";
import { StockCard } from "@/components/stock-card";
import { getDashboard } from "@/lib/api";

export default async function HomePage() {
  const dashboard = await getDashboard();

  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
        <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-panel to-panel p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Portfolio Project</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold text-white">
            Research stocks with explainable AI and verify the thesis with tracked profit and loss.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            This MVP combines structured market data, summarized finance news, explainable bull and bear cases, and a recommendation tracker that measures the model against real-world price changes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/10 px-4 py-2">FastAPI backend</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Next.js frontend</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Live API ready</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Recommendation tracking</span>
          </div>
        </div>

        <SectionCard title="Why This Stands Out" eyebrow="Project Value">
          <div className="space-y-4 text-sm text-slate-300">
            <p>Moves beyond a chatbot by combining AI research with measurable recommendation outcomes.</p>
            <p>Supports real providers like Finnhub and NewsAPI, while sample data keeps the project demo-ready without paid keys.</p>
            <p>Creates a clean path to add RAG over filings, transcripts, and investor presentations in the next iteration.</p>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.4fr,1fr]">
        <SectionCard title="Featured Stocks" eyebrow="Coverage">
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.featured_companies.map((company) => (
              <StockCard key={company.ticker} company={company} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Market News" eyebrow="AI Summaries">
          <div className="space-y-4">
            {dashboard.top_news.map((item) => (
              <article key={`${item.title}-${item.published_at}`} className="rounded-2xl border border-white/10 bg-canvas p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase text-accent">{item.sentiment}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{item.summary}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>{item.source}</span>
                  <span>{item.published_at}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      <SectionCard title="Recommendation Tracker" eyebrow="Measured Outcomes">
        {dashboard.latest_recommendations.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.latest_recommendations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-canvas p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">{item.ticker}</p>
                    <p className="text-lg font-semibold text-white">{item.action}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.return_percent >= 0 ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                    }`}
                  >
                    {item.return_percent >= 0 ? "+" : ""}
                    {item.return_percent.toFixed(2)}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">{item.reason_summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-canvas p-6 text-sm text-muted">
            No saved recommendations yet. Open a company report, save a thesis, and start tracking performance.
          </div>
        )}

        <div className="mt-5">
          <Link href="/company/TCS" className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950">
            Open Sample Report
          </Link>
        </div>
      </SectionCard>
    </main>
  );
}
