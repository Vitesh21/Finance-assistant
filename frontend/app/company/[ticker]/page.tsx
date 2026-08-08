import Link from "next/link";

import { PriceChart } from "@/components/price-chart";
import { RecommendationForm } from "@/components/recommendation-form";
import { SectionCard } from "@/components/section-card";
import { getResearchReport } from "@/lib/api";

function scoreTone(score: number): string {
  if (score >= 8) {
    return "text-success";
  }
  if (score >= 6.5) {
    return "text-accent";
  }
  return "text-danger";
}

export default async function CompanyPage({
  params
}: {
  params: { ticker: string };
}) {
  const { ticker } = params;
  const report = await getResearchReport(ticker);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-accent">
            ← Back to dashboard
          </Link>
          <h2 className="mt-3 text-4xl font-semibold text-white">{report.company.name}</h2>
          <p className="mt-2 text-base text-muted">
            {report.company.ticker} · {report.company.sector} · {report.company.market_cap}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-panel px-6 py-4 text-right">
          <p className="text-sm text-muted">Overall Score</p>
          <p className={`mt-1 text-4xl font-semibold ${scoreTone(report.overall_score)}`}>{report.overall_score.toFixed(1)}</p>
          <p className="mt-2 text-sm text-slate-300">
            {report.recommendation} · {report.confidence}% confidence
          </p>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <SectionCard title="Investment Thesis" eyebrow="AI View">
          <div className="space-y-5">
            <p className="text-base leading-7 text-slate-200">{report.thesis}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {report.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-canvas p-4">
                  <p className="text-sm text-muted">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
                  <p
                    className={`mt-2 text-xs uppercase tracking-[0.24em] ${
                      metric.trend === "positive"
                        ? "text-success"
                        : metric.trend === "negative"
                          ? "text-danger"
                          : "text-muted"
                    }`}
                  >
                    {metric.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Price Trend" eyebrow="Market Snapshot">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-canvas p-5">
              <p className="text-sm text-muted">Current Price</p>
              <p className="mt-2 text-3xl font-semibold text-white">{report.company.price.toFixed(2)}</p>
              <p className={`mt-2 text-sm ${report.company.change_percent >= 0 ? "text-success" : "text-danger"}`}>
                {report.company.change_percent >= 0 ? "+" : ""}
                {report.company.change_percent.toFixed(2)}% today
              </p>
            </div>
            <PriceChart points={report.price_history} />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-8 xl:grid-cols-3">
        <SectionCard title="Bull Case" eyebrow="Upside">
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            {report.bull_case.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Bear Case" eyebrow="Downside">
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            {report.bear_case.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Key Risks" eyebrow="What To Watch">
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            {report.risks.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </SectionCard>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr,0.95fr]">
        <SectionCard title="News Summaries" eyebrow="Recent Signals">
          <div className="space-y-4">
            {report.news.map((item) => (
              <article key={`${item.title}-${item.published_at}`} className="rounded-2xl border border-white/10 bg-canvas p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs uppercase text-accent">{item.impact}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                  <span>{item.source}</span>
                  <span>{item.published_at}</span>
                  <span>{item.confidence}% confidence</span>
                  <span>{item.sentiment}</span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Track This Thesis" eyebrow="Evaluation">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-300">
              Save the current recommendation and let the backend compare the entry price with updated market prices later. This is the foundation for accuracy, win rate, and portfolio simulation dashboards.
            </p>
            <RecommendationForm
              ticker={report.company.ticker}
              companyName={report.company.name}
              score={report.overall_score}
              entryPrice={report.company.price}
              thesis={report.thesis}
            />
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
