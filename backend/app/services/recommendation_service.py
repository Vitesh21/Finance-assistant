from __future__ import annotations

from app.schemas import RecommendationCreate
from app.services.market_data import market_data_service


def calculate_return_percent(action: str, entry_price: float, latest_price: float) -> float:
    if entry_price == 0:
        return 0.0

    movement = ((latest_price - entry_price) / entry_price) * 100
    if action == "SELL":
        return round(-movement, 2)
    if action == "HOLD":
        return round(-abs(movement), 2)
    return round(movement, 2)


def enrich_recommendation(payload: RecommendationCreate) -> tuple[float, float]:
    latest_price = market_data_service.get_latest_price(payload.ticker)
    return_percent = calculate_return_percent(payload.action, payload.entry_price, latest_price)
    return latest_price, return_percent
