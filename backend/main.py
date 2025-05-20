from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json
import random
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Trading Bot Backend")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Trade(BaseModel):
    currency_pair: str
    result: str
    profit: float
    timestamp: Optional[datetime] = None

class BotConfig(BaseModel):
    api_key: str
    api_secret: str
    currency_pair: str

# In-memory storage (replace with database in production)
active_bots = {}
bot_configs = {}

@app.get("/")
async def root():
    return {"status": "Trading Bot Backend is running"}

@app.post("/bot/start/{user_id}")
async def start_bot(user_id: str, config: BotConfig):
    if user_id in active_bots and active_bots[user_id]:
        raise HTTPException(status_code=400, detail="Bot is already running")
    
    bot_configs[user_id] = config
    active_bots[user_id] = True
    
    return {"status": "Bot started successfully"}

@app.post("/bot/stop/{user_id}")
async def stop_bot(user_id: str):
    if user_id not in active_bots or not active_bots[user_id]:
        raise HTTPException(status_code=400, detail="Bot is not running")
    
    active_bots[user_id] = False
    return {"status": "Bot stopped successfully"}

@app.get("/bot/status/{user_id}")
async def get_bot_status(user_id: str):
    is_running = active_bots.get(user_id, False)
    return {"isRunning": is_running}

@app.post("/trade")
async def execute_trade(user_id: str):
    if not active_bots.get(user_id, False):
        raise HTTPException(status_code=400, detail="Bot is not running")
    
    config = bot_configs.get(user_id)
    if not config:
        raise HTTPException(status_code=400, detail="Bot configuration not found")
    
    # Simulate trading logic
    is_win = random.random() > 0.4  # 60% win rate
    
    if is_win:
        profit = random.uniform(10, 110)
        result = "win"
    else:
        profit = -1 * random.uniform(5, 85)
        result = "loss"
    
    trade = Trade(
        currency_pair=config.currency_pair,
        result=result,
        profit=profit,
        timestamp=datetime.now()
    )
    
    return trade

@app.get("/health")
async def health_check():
    return {"status": "healthy"}