# CRM Application

A simple CRM (Customer Relationship Management) system for managing customers and leads.

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database

**Frontend:**
- React 18
- Vite
- Tailwind CSS

## Features

- Customer management (CRUD operations)
- Lead pipeline tracking
- Dashboard with analytics
- Search and filtering

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## API Documentation

Once the backend is running, visit: http://localhost:8000/docs

## Deploy to Vercel

The **frontend** is set up to deploy on [Vercel](https://vercel.com).

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com/new). Vercel will use the root `vercel.json` and build from the `frontend` folder.
2. (Optional) Deploy the backend elsewhere (e.g. [Railway](https://railway.app), [Render](https://render.com)) so the live app has a working API. Then in Vercel → Project → **Settings → Environment Variables**, add:
   - **Name:** `VITE_API_URL`  
   - **Value:** `https://your-backend-url.com`
3. Redeploy the frontend so it uses the new API URL.

Live app: [project-titan-agentic-ai.vercel.app](https://project-titan-agentic-ai.vercel.app)
