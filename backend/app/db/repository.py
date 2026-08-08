from __future__ import annotations

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.db.models import RecommendationRecord
from app.schemas import RecommendationCreate


def list_recommendations(db: Session) -> list[RecommendationRecord]:
    query = select(RecommendationRecord).order_by(desc(RecommendationRecord.created_at))
    return list(db.scalars(query).all())


def create_recommendation(
    db: Session,
    payload: RecommendationCreate,
    latest_price: float,
    return_percent: float,
) -> RecommendationRecord:
    record = RecommendationRecord(
        ticker=payload.ticker,
        company_name=payload.company_name,
        action=payload.action,
        confidence=payload.confidence,
        score=payload.score,
        entry_price=payload.entry_price,
        horizon_days=payload.horizon_days,
        reason_summary=payload.reason_summary,
        latest_price=latest_price,
        return_percent=return_percent,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
