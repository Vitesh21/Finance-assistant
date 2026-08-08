# AI Stock Research Assistant

A full-stack portfolio project that explains why a stock moved instead of only showing prices.

This MVP includes:

- `FastAPI` backend with research, news, and recommendation-tracking APIs
- `Next.js` frontend with a dashboard and company research pages
- sample data for instant demoability
- optional live provider hooks for `Finnhub` and `NewsAPI`
- a recommendation tracker that measures profit/loss after a thesis is saved

## Project Structure

```text
backend/
  app/
    api/routes/
    core/
    data/
    db/
    services/
  requirements.txt

frontend/
  app/
  components/
  lib/
  package.json
```

## What It Does

For each supported stock, the app can show:

- company overview
- key financial metrics
- AI-style bull case and bear case
- risk factors and catalysts
- summarized finance news
- price trend visualization
- recommendation score and confidence

It also lets you save a recommendation such as `BUY`, `HOLD`, or `SELL`, then compares the saved entry price with newer prices to estimate strategy performance.

## Backend

The backend exposes:

- `GET /api/v1/health`
- `GET /api/v1/stocks`
- `GET /api/v1/stocks/dashboard`
- `GET /api/v1/stocks/{ticker}`
- `GET /api/v1/recommendations`
- `POST /api/v1/recommendations`

The current MVP persists recommendations in `SQLite` through `SQLAlchemy`.

## Frontend

The frontend includes:

- dashboard with featured stocks
- AI-summarized news cards
- recommendation tracker section
- per-company report pages
- price chart
- thesis saving flow

## Real-World Data

The project is designed to work in two modes:

1. `Demo mode`
   - uses built-in sample data
   - works without any API keys

2. `Live mode`
   - uses `FINNHUB_API_KEY` for live company and quote data
   - uses `NEWSAPI_API_KEY` for finance news
   - falls back to sample data if the provider is unavailable

## Local Setup

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Environment Variables

### Backend

```bash
APP_NAME=AI Stock Research Assistant
APP_ENV=development
API_PREFIX=/api/v1
DATABASE_URL=sqlite:///./finance_assistant.db
CORS_ORIGINS=http://localhost:3000
SCHEDULER_ENABLED=true
FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=
NEWSAPI_API_KEY=
```

### Frontend

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## How Recommendation Tracking Works

When a user saves a thesis:

1. the frontend posts the recommendation to the backend
2. the backend stores the entry price, action, score, and reason
3. the backend compares the entry price with the latest known price
4. a return percentage is stored so the dashboard can later show:
   - win rate
   - average return
   - best and worst calls
   - portfolio simulation

Current scoring rules are intentionally simple:

- `BUY`: positive price move helps performance
- `SELL`: negative price move helps performance
- `HOLD`: large moves are treated as a miss

## Suggested Next Steps

To take this from MVP to production-quality:

- add PostgreSQL instead of SQLite
- add Redis + Celery for scheduled ingestion
- ingest filings, earnings transcripts, and investor presentations
- add vector search with `Qdrant`
- add `FinBERT` sentiment classification
- add citation-aware RAG answers
- add watchlists, alerts, and portfolio simulations

## Notes

- This repository is for educational and research purposes.
- It should not be treated as financial advice.
