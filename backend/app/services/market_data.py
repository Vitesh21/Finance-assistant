from __future__ import annotations

from collections.abc import Iterable

import httpx

from app.core.config import settings
from app.data.sample_data import COMPANIES
from app.schemas import CompanySummary, MetricItem, PricePoint


class MarketDataService:
    def list_companies(self) -> list[CompanySummary]:
        return [
            CompanySummary(
                ticker=payload["ticker"],
                name=payload["name"],
                sector=payload["sector"],
                market_cap=payload["market_cap"],
                price=payload["price"],
                change_percent=payload["change_percent"],
                analyst_sentiment=payload["analyst_sentiment"],
            )
            for payload in COMPANIES.values()
        ]

    def get_company(self, ticker: str) -> CompanySummary:
        key = ticker.upper()
        if settings.finnhub_api_key:
            live_company = self._fetch_finnhub_company(key)
            if live_company:
                return live_company

        company = COMPANIES[key]
        return CompanySummary(
            ticker=company["ticker"],
            name=company["name"],
            sector=company["sector"],
            market_cap=company["market_cap"],
            price=company["price"],
            change_percent=company["change_percent"],
            analyst_sentiment=company["analyst_sentiment"],
        )

    def get_metrics(self, ticker: str) -> list[MetricItem]:
        company = COMPANIES[ticker.upper()]
        return [MetricItem(**item) for item in company["metrics"]]

    def get_price_history(self, ticker: str) -> list[PricePoint]:
        company = COMPANIES[ticker.upper()]
        return [PricePoint(**item) for item in company["price_history"]]

    def get_latest_price(self, ticker: str) -> float:
        return self.get_company(ticker).price

    def supported_tickers(self) -> Iterable[str]:
        return COMPANIES.keys()

    def _fetch_finnhub_company(self, ticker: str) -> CompanySummary | None:
        quote_url = "https://finnhub.io/api/v1/quote"
        profile_url = "https://finnhub.io/api/v1/stock/profile2"
        params = {"symbol": ticker, "token": settings.finnhub_api_key}

        try:
            with httpx.Client(timeout=10.0) as client:
                quote = client.get(quote_url, params=params)
                profile = client.get(profile_url, params=params)
                quote.raise_for_status()
                profile.raise_for_status()
                quote_data = quote.json()
                profile_data = profile.json()
        except httpx.HTTPError:
            return None

        current_price = float(quote_data.get("c") or 0.0)
        if not current_price:
            return None

        previous_close = float(quote_data.get("pc") or current_price)
        change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0.0

        return CompanySummary(
            ticker=ticker,
            name=profile_data.get("name") or ticker,
            sector=profile_data.get("finnhubIndustry") or "Unknown",
            market_cap=f"${profile_data.get('marketCapitalization', 'N/A')}M",
            price=round(current_price, 2),
            change_percent=round(change_percent, 2),
            analyst_sentiment="Live Data",
        )


market_data_service = MarketDataService()
