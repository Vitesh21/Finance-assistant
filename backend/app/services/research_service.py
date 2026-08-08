from __future__ import annotations

from app.data.sample_data import COMPANIES
from app.schemas import ResearchReport
from app.services.market_data import market_data_service
from app.services.news_service import news_service


class ResearchService:
    def get_research_report(self, ticker: str) -> ResearchReport:
        key = ticker.upper()
        company = COMPANIES[key]
        metrics = market_data_service.get_metrics(key)
        news = news_service.get_company_news(key)
        price_history = market_data_service.get_price_history(key)
        company_summary = market_data_service.get_company(key)

        return ResearchReport(
            company=company_summary,
            metrics=metrics,
            bull_case=company["bull_case"],
            bear_case=company["bear_case"],
            risks=company["risks"],
            catalysts=company["catalysts"],
            news=news,
            price_history=price_history,
            overall_score=company["overall_score"],
            recommendation=company["recommendation"],
            confidence=company["confidence"],
            thesis=company["thesis"],
        )


research_service = ResearchService()
