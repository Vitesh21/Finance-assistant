from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.repository import create_recommendation, list_recommendations
from app.schemas import RecommendationCreate, RecommendationRead
from app.services.recommendation_service import enrich_recommendation

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[RecommendationRead])
def get_recommendations(db: Session = Depends(get_db)):
    return list_recommendations(db)


@router.post("", response_model=RecommendationRead, status_code=201)
def create_recommendation_entry(payload: RecommendationCreate, db: Session = Depends(get_db)):
    latest_price, return_percent = enrich_recommendation(payload)
    return create_recommendation(db, payload, latest_price=latest_price, return_percent=return_percent)
