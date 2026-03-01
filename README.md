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
