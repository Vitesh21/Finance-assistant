from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class RecommendationRecord(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ticker: Mapped[str] = mapped_column(String(16), index=True)
    company_name: Mapped[str] = mapped_column(String(128))
    action: Mapped[str] = mapped_column(String(16))
    confidence: Mapped[float] = mapped_column(Float)
    score: Mapped[float] = mapped_column(Float)
    entry_price: Mapped[float] = mapped_column(Float)
    horizon_days: Mapped[int] = mapped_column(Integer, default=30)
    reason_summary: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    latest_price: Mapped[float] = mapped_column(Float, default=0.0)
    return_percent: Mapped[float] = mapped_column(Float, default=0.0)
