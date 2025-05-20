#!/usr/bin/env python3
"""
Trading Bot Simulator for the Automated Financial Assets Trading System

This script simulates a trading bot that:
1. Connects to the API using saved credentials
2. Simulates trading based on a simple strategy
3. Logs trades by calling a secure backend API
4. Can be started and stopped via API endpoints
"""

import json
import time
import random
import datetime
import requests
from typing import Dict, Any, List, Tuple

# Configuration
API_URL = "http://localhost:3000/api"
USER_ID = ""  # This would be provided by the app

class TradingBot:
    def __init__(self, api_key: str, api_secret: str, currency_pair: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.currency_pair = currency_pair
        self.running = False
        self.auth_headers = {
            "Content-Type": "application/json",
            # In production, this would be a proper session cookie or token
            "Authorization": f"Bearer {api_key}"
        }
    
    def start(self):
        """Start the trading bot."""
        self.running = True
        print(f"Bot started for {self.currency_pair}")
        
        try:
            while self.running:
                # Check if we should still be running
                if not self.check_status():
                    self.running = False
                    break
                
                # Simulate trading logic
                result, profit = self.execute_trade_strategy()
                
                # Log the trade
                self.log_trade(result, profit)
                
                # Wait before next trade
                time.sleep(random.uniform(5, 15))  # Random interval between trades
        except Exception as e:
            print(f"Error in trading loop: {str(e)}")
            self.running = False
    
    def stop(self):
        """Stop the trading bot."""
        self.running = False
        print("Bot stopped")
    
    def check_status(self) -> bool:
        """Check if the bot should be running."""
        try:
            response = requests.get(f"{API_URL}/bot/status", headers=self.auth_headers)
            if response.status_code == 200:
                data = response.json()
                return data.get("isRunning", False)
            return False
        except Exception as e:
            print(f"Error checking status: {str(e)}")
            return False
    
    def execute_trade_strategy(self) -> Tuple[str, float]:
        """
        Simulate a simple trading strategy.
        
        Returns:
            Tuple containing (result, profit)
            result: 'win' or 'loss'
            profit: float value (positive for win, negative for loss)
        """
        # Simple random strategy for demonstration
        is_win = random.random() > 0.4  # 60% win rate
        
        if is_win:
            profit = random.uniform(10, 110)  # Win between $10 and $110
            result = "win"
        else:
            profit = -1 * random.uniform(5, 85)  # Loss between $-5 and $-85
            result = "loss"
        
        print(f"Trade executed: {result.upper()} with profit ${profit:.2f}")
        return result, profit
    
    def log_trade(self, result: str, profit: float):
        """Log a trade to the API."""
        try:
            trade_data = {
                "currencyPair": self.currency_pair,
                "result": result,
                "profit": profit
            }
            
            response = requests.post(
                f"{API_URL}/log-trade",
                headers=self.auth_headers,
                json=trade_data
            )
            
            if response.status_code == 201:
                print(f"Trade logged successfully: {result} ${profit:.2f}")
            else:
                print(f"Failed to log trade: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error logging trade: {str(e)}")


def main():
    """Main function to demonstrate bot usage."""
    print("Trading Bot Simulator")
    print("-" * 50)
    print("This script simulates the trading bot functionality.")
    print("In a production environment, this would be integrated with the Next.js app.")
    print("For now, you can test manually with these commands:")
    print("\n1. To simulate starting the bot:")
    print("   - Make a POST request to /api/bot/start")
    print("\n2. To simulate stopping the bot:")
    print("   - Make a POST request to /api/bot/stop")
    print("\n3. To check bot status:")
    print("   - Make a GET request to /api/bot/status")
    print("-" * 50)
    
    # For manual testing:
    api_key = "demo_key"
    api_secret = "demo_secret"
    currency_pair = "BTC/USD"
    
    bot = TradingBot(api_key, api_secret, currency_pair)
    
    try:
        print("Starting bot...")
        bot.start()
    except KeyboardInterrupt:
        print("\nBot manually stopped")
        bot.stop()


if __name__ == "__main__":
    main()