# Automated Financial Assets Trading System

A strategy-driven bot for decision-making and performance analysis.

## Overview

This project is a full-stack application that allows users to set up and monitor automated trading bots. It includes user authentication, trading bot configuration, real-time performance monitoring, and trade logging.

## Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **Bot Logic**: Python script connected via backend API

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Python 3.7+ (for the trading bot script)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your PostgreSQL connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/tradingbot"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

### Using the Application

1. Register a new account at `/register`
2. Log in with your credentials
3. Set up your bot configuration on the Setup page
4. Navigate to the Dashboard to monitor and control your trading bot

## Features

- **Authentication**: Secure user registration and login
- **Bot Configuration**: Set up API credentials and trading parameters
- **Dashboard**: Real-time performance metrics and trade history
- **Trading Bot**: Python script that simulates trading based on a simple strategy
- **API Routes**: Secure endpoints for bot control and trade logging

## Python Bot

The trading bot logic is implemented in Python. In a production environment, this would run as a separate service, but for the MVP, it's included in the project for reference.

The script is located at `utils/trading-bot.py`. You can run it manually for testing, but in the application, the trading activity is simulated through the API endpoints.

## Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **User**: Authentication and profile information
- **BotConfig**: API credentials and trading parameters
- **TradeLog**: History of trades and their results
- **BotStatus**: Current state of the trading bot
