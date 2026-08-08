from __future__ import annotations

import httpx

from app.core.config import settings
from app.data.sample_data import COMPANIES
from app.schemas import NewsItem


class NewsService:
    def get_company_news(self, ticker: str) -> list[NewsItem]:
        key = ticker.upper()
        if settings.newsapi_api_key:
            live_news = self._fetch_newsapi_news(key)
            if live_news:
                return live_news

        company = COMPANIES[key]
        return [NewsItem(**item) for item in company["news"]]

    def get_market_news(self) -> list[NewsItem]:
        items: list[NewsItem] = []
        for company in COMPANIES.values():
            items.extend(NewsItem(**item) for item in company["news"])
        return sorted(items, key=lambda item: item.published_at, reverse=True)[:5]

    def _fetch_newsapi_news(self, ticker: str) -> list[NewsItem]:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": ticker,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 5,
            "apiKey": settings.newsapi_api_key,
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.get(url, params=params)
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError:
            return []

        articles = payload.get("articles", [])
        news_items: list[NewsItem] = []
        for article in articles:
            description = article.get("description") or "Market article captured from the configured live news provider."
            news_items.append(
                NewsItem(
                    title=article.get("title") or f"{ticker} update",
                    source=(article.get("source") or {}).get("name", "NewsAPI"),
                    published_at=(article.get("publishedAt") or "")[:10],
                    sentiment="neutral",
                    impact="medium",
                    confidence=70,
                    summary=description,
                    url=article.get("url") or "https://newsapi.org",
                )
            )

        return news_items


news_service = NewsService()
