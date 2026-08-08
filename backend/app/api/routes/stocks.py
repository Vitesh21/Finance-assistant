from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.repository import list_recommendations
from app.schemas import CompanySummary, DashboardResponse, ResearchReport
from app.services.market_data import market_data_service
from app.services.news_service import news_service
from app.services.research_service import research_service

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("", response_model=list[CompanySummary])
def list_companies():
    return market_data_service.list_companies()


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return DashboardResponse(
        featured_companies=market_data_service.list_companies(),
        latest_recommendations=list_recommendations(db),
        top_news=news_service.get_market_news(),
    )


@router.get("/{ticker}", response_model=ResearchReport)
def get_research_report(ticker: str):
    try:
        return research_service.get_research_report(ticker)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' is not supported in the sample dataset.") from exc
