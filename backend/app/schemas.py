from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class CompanySummary(BaseModel):
    ticker: str
    name: str
    sector: str
    market_cap: str
    price: float
    change_percent: float
    analyst_sentiment: str


class MetricItem(BaseModel):
    label: str
    value: str
    trend: Literal["positive", "negative", "neutral"]


class NewsItem(BaseModel):
    title: str
    source: str
    published_at: str
    sentiment: Literal["positive", "negative", "neutral"]
    impact: Literal["high", "medium", "low"]
    confidence: int = Field(ge=0, le=100)
    summary: str
    url: str


class PricePoint(BaseModel):
    date: str
    close: float


class RecommendationCreate(BaseModel):
    ticker: str
    company_name: str
    action: Literal["BUY", "HOLD", "SELL"]
    confidence: float = Field(ge=0, le=100)
    score: float = Field(ge=0, le=10)
    entry_price: float
    horizon_days: int = 30
    reason_summary: str


class RecommendationRead(RecommendationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    latest_price: float
    return_percent: float
    created_at: datetime


class ResearchReport(BaseModel):
    company: CompanySummary
    metrics: list[MetricItem]
    bull_case: list[str]
    bear_case: list[str]
    risks: list[str]
    catalysts: list[str]
    news: list[NewsItem]
    price_history: list[PricePoint]
    overall_score: float = Field(ge=0, le=10)
    recommendation: Literal["BUY", "HOLD", "SELL"]
    confidence: int = Field(ge=0, le=100)
    thesis: str


class DashboardResponse(BaseModel):
    featured_companies: list[CompanySummary]
    latest_recommendations: list[RecommendationRead]
    top_news: list[NewsItem]
