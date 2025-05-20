# Trading Bot Backend

This is the Python backend service for the Automated Financial Assets Trading System.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update the values.

4. Run the server:
```bash
uvicorn main:app --reload
```

## API Endpoints

- `GET /`: Health check
- `POST /bot/start/{user_id}`: Start the trading bot
- `POST /bot/stop/{user_id}`: Stop the trading bot
- `GET /bot/status/{user_id}`: Get bot status
- `POST /trade`: Execute a trade
- `GET /health`: Health check endpoint

## Docker Support

To run with Docker:

```bash
docker-compose up --build
```