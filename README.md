# OperationFInance

## Backend setup

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Provide environment variables (example values for local development):

```bash
cp backend/.env backend/.env.local
# or create backend/.env with
# DATABASE_URL=sqlite+aiosqlite:///./tradesphere.db
# SECRET_KEY=change-me
# FINNHUB_API_KEY=dummy
# STOCKGRO_CLIENT_ID=dummy
# STOCKGRO_CLIENT_SECRET=dummy
# CORS_ORIGINS=http://localhost:6969
```

Initialize the database (SQLite by default):

```bash
python -c "import asyncio; from backend.models import Base; from backend.database import engine; async def main():\n    async with engine.begin() as conn:\n        await conn.run_sync(Base.metadata.create_all)\nasyncio.run(main())"
```

Run the API:

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8001 --env-file backend/.env
```

## Frontend setup

The UI lives under `Frontend/material-kit-react-main/` and uses Next.js 15 with MUI 7.

### Install dependencies

```bash
npm install --prefix Frontend/material-kit-react-main
```

### Run the development server

```bash
PORT=6969 npm run dev --prefix Frontend/material-kit-react-main
```

Create a `.env.local` file under `Frontend/material-kit-react-main` (you can copy from `.env.local.example`) and set the backend URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
```

Once the server is running, open `http://localhost:6969` to view the TradeSphere interface. Use `Ctrl+C` in the terminal to stop the dev server when you are done.