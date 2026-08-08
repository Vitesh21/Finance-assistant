import { DashboardResponse, Recommendation, ResearchReport } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/stocks/dashboard");
}

export function getResearchReport(ticker: string): Promise<ResearchReport> {
  return request<ResearchReport>(`/stocks/${ticker}`);
}

export function createRecommendation(payload: {
  ticker: string;
  company_name: string;
  action: "BUY" | "HOLD" | "SELL";
  confidence: number;
  score: number;
  entry_price: number;
  horizon_days: number;
  reason_summary: string;
}): Promise<Recommendation> {
  return request<Recommendation>("/recommendations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
