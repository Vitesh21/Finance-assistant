export type Trend = "positive" | "negative" | "neutral";
export type Sentiment = "positive" | "negative" | "neutral";
export type Impact = "high" | "medium" | "low";
export type Action = "BUY" | "HOLD" | "SELL";

export interface CompanySummary {
  ticker: string;
  name: string;
  sector: string;
  market_cap: string;
  price: number;
  change_percent: number;
  analyst_sentiment: string;
}

export interface MetricItem {
  label: string;
  value: string;
  trend: Trend;
}

export interface NewsItem {
  title: string;
  source: string;
  published_at: string;
  sentiment: Sentiment;
  impact: Impact;
  confidence: number;
  summary: string;
  url: string;
}

export interface PricePoint {
  date: string;
  close: number;
}

export interface Recommendation {
  id: number;
  ticker: string;
  company_name: string;
  action: Action;
  confidence: number;
  score: number;
  entry_price: number;
  horizon_days: number;
  reason_summary: string;
  latest_price: number;
  return_percent: number;
  created_at: string;
}

export interface ResearchReport {
  company: CompanySummary;
  metrics: MetricItem[];
  bull_case: string[];
  bear_case: string[];
  risks: string[];
  catalysts: string[];
  news: NewsItem[];
  price_history: PricePoint[];
  overall_score: number;
  recommendation: Action;
  confidence: number;
  thesis: string;
}

export interface DashboardResponse {
  featured_companies: CompanySummary[];
  latest_recommendations: Recommendation[];
  top_news: NewsItem[];
}
