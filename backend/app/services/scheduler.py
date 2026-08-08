from __future__ import annotations

import logging

from apscheduler.schedulers.background import BackgroundScheduler

from app.core.config import settings
from app.services.market_data import market_data_service
from app.services.news_service import news_service

logger = logging.getLogger(__name__)
_scheduler: BackgroundScheduler | None = None


def warm_market_cache() -> None:
    companies = list(market_data_service.supported_tickers())
    logger.info("Refreshing market snapshot for %s tickers", len(companies))
    for ticker in companies:
        market_data_service.get_company(ticker)
        news_service.get_company_news(ticker)


def start_scheduler() -> None:
    global _scheduler

    if _scheduler or not settings.scheduler_enabled:
        return

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(warm_market_cache, "interval", minutes=15, id="market-refresh", replace_existing=True)
    _scheduler.start()
    logger.info("Background scheduler started")


def stop_scheduler() -> None:
    global _scheduler

    if _scheduler:
        _scheduler.shutdown(wait=False)
        _scheduler = None
