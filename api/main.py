from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
import json
from api.services.yfinance import YFinanceUtils
from api.services.finnhub import FinnhubUtils
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",   
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

class IncomeStatementResponse(BaseModel):
    symbol: str
    income_statement: dict

@app.get("/api/py/get_income_statement", response_model=IncomeStatementResponse)
async def get_income_statement(symbol: str):
    """Retrieve and format a detailed income statement of a company using its stock ticker symbol."""
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol parameter is required.")

    yfin = YFinanceUtils(symbol)
    try:
        income_stmt = yfin.get_income_stmt()
        return {"symbol": symbol, "income_statement": income_stmt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CompanyProfileResponse(BaseModel):
    symbol: str
    company_profile: str

@app.get("/api/py/get_company_profile", response_model=CompanyProfileResponse)
async def get_company_profile(symbol: str, x_finnhub_api_key: str = Header(...)):
    """Retrieve and format a detailed profile of a company using its stock ticker symbol."""
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol parameter is required.")
    
    try:
        finnhub_utils = FinnhubUtils(x_finnhub_api_key)
        profile = finnhub_utils.get_company_profile(symbol)
        return {
            "symbol": symbol,
            "company_profile": profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CompanyNewsResponse(BaseModel):
    symbol: str
    news: List[dict]

@app.get("/api/py/get_company_news", response_model=CompanyNewsResponse)
async def get_company_news(symbol: str, x_finnhub_api_key: str = Header(...), start_date: Optional[str] = None, end_date: Optional[str] = None, max_news_num: Optional[int] = 10):
    """Fetch recent news articles about a company based on its stock ticker, within a specified date range."""
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol parameter is required.")
    
    try:
        finnhub_utils = FinnhubUtils(x_finnhub_api_key)
        news = finnhub_utils.get_company_news(symbol, start_date, end_date, max_news_num)
        return {"symbol": symbol, "news": news}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BasicFinancialsResponse(BaseModel):
    symbol: str
    financials: dict

@app.get("/api/py/get_basic_financials", response_model=BasicFinancialsResponse)
async def get_basic_financials(symbol: str, x_finnhub_api_key: str = Header(...), selected_columns: Optional[List[str]] = None):
    """Get the most recent basic financial data for a company using its stock ticker symbol, with optional specific financial metrics."""
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol parameter is required.")
    
    try:
        finnhub_utils = FinnhubUtils(x_finnhub_api_key)
        financials = finnhub_utils.get_basic_financials(symbol, selected_columns)
        return {"symbol": symbol, "financials": json.loads(financials)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SecFilingResponse(BaseModel):
    symbol: str
    filing: dict

@app.get("/api/py/get_sec_filing", response_model=SecFilingResponse)
async def get_sec_filing(symbol: str, x_finnhub_api_key: str = Header(...), form: Optional[str] = "10-K", from_date: Optional[str] = None, to_date: Optional[str] = None):
    """Obtain the most recent SEC filing for a company specified by its stock ticker, within a given date range."""
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol parameter is required.")
    
    try:
        finnhub_utils = FinnhubUtils(x_finnhub_api_key)
        filing = finnhub_utils.get_sec_filing(symbol, form, from_date, to_date)
        return {"symbol": symbol, "filing": filing}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)