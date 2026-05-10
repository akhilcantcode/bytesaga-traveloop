# Traveloop — Master Planning Document
# Classification: Internal · Hackathon MVP · Confidential
# Last updated: 2026-05-10
# Owner: Engineering Team

---

## 1. Project Overview

Traveloop is a personalized, intelligent, and collaborative travel planning platform.
Users plan multi-city trips end-to-end: building itineraries, tracking budgets,
managing packing lists, writing journals, and sharing trips publicly.

This document is the **single source of truth** for all agents and engineers working
on this codebase. Read it fully before writing a single line of code.

---

## 2. Tech Stack

| Layer        | Technology                                      | Version     |
|---|---|---|
| Frontend     | Next.js (App Router)                            | 14.x        |
| Styling      | Tailwind CSS + shadcn/ui                        | Latest      |
| State        | Zustand (global) + TanStack Query (server)      | Latest      |
| Backend      | FastAPI                                         | 0.111.x     |
| ORM          | SQLAlchemy (async) + Alembic (migrations)       | 2.x         |
| Auth         | JWT — python-jose + passlib[bcrypt]             | Latest      |
| Database     | PostgreSQL                                      | 15+         |
| Charts       | Recharts (frontend)                             | Latest      |
| HTTP Client  | Axios (frontend)                                | Latest      |

> ⚠️ Do NOT use Prisma. The backend is Python/FastAPI. ORM is SQLAlchemy.

---

## 3. Repository Structure

```
traveloop/
├── PLANNING.md                  ← THIS FILE. Read before anything else.
├── skills/
│   ├── backend.md               ← FastAPI agent conventions
│   ├── frontend.md              ← Next.js agent conventions
│   └── database.md              ← SQLAlchemy/DB agent conventions
│
├── backend/
│   ├── main.py                  ← FastAPI app entry point
│   ├── core/
│   │   ├── config.py            ← Settings from .env
│   │   ├── database.py          ← Async SQLAlchemy engine + session
│   │   └── security.py          ← JWT encode/decode, password hashing
│   ├── models/                  ← SQLAlchemy ORM models (one file per domain)
│   │   ├── base.py              ← Base model with id, created_at, updated_at
│   │   ├── user.py
│   │   ├── trip.py
│   │   ├── stop.py
│   │   ├── activity.py
│   │   ├── expense.py
│   │   ├── note.py
│   │   └── packing_item.py
│   ├── schemas/                 ← Pydantic v2 request/response schemas
│   │   ├── auth.py
│   │   ├── trip.py
│   │   ├── stop.py
│   │   ├── activity.py
│   │   ├── expense.py
│   │   ├── note.py
│   │   └── packing_item.py
│   ├── routers/                 ← One router per domain
│   │   ├── auth.py
│   │   ├── trips.py
│   │   ├── stops.py
│   │   ├── activities.py
│   │   ├── expenses.py
│   │   ├── notes.py
│   │   └── packing.py
│   ├── services/                ← Business logic (no DB calls in routers)
│   │   ├── auth_service.py
│   │   ├── trip_service.py
│   │   ├── stop_service.py
│   │   └── budget_service.py
│   ├── dependencies.py          ← Shared FastAPI Depends() — get_current_user, get_db
│   ├── alembic/                 ← DB migrations
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   └── (dashboard)/
    │       ├── layout.tsx       ← Protected layout with nav
    │       ├── page.tsx         ← Dashboard / Home
    │       ├── trips/
    │       │   ├── page.tsx     ← My Trips list
    │       │   ├── new/page.tsx ← Create Trip
    │       │   └── [id]/
    │       │       ├── page.tsx         ← Itinerary View
    │       │       ├── builder/page.tsx ← Itinerary Builder
    │       │       ├── budget/page.tsx  ← Budget Breakdown
    │       │       ├── checklist/page.tsx
    │       │       └── notes/page.tsx
    │       └── profile/page.tsx
    ├── components/
    │   ├── ui/                  ← shadcn/ui auto-generated (do not edit)
    │   ├── layout/              ← Navbar, Sidebar, PageWrapper
    │   ├── trips/               ← TripCard, TripForm, TripTimeline
    │   ├── stops/               ← StopCard, StopForm
    │   ├── activities/          ← ActivityCard, ActivitySearch
    │   └── budget/              ← BudgetChart, CostBreakdown
    ├── hooks/                   ← Custom React hooks (useTrips, useAuth, etc.)
    ├── lib/
    │   ├── api.ts               ← Axios instance with base URL + auth interceptor
    │   ├── queryKeys.ts         ← TanStack Query key constants
    │   └── utils.ts             ← cn(), formatCurrency(), formatDate()
    ├── store/
    │   ├── authStore.ts         ← Zustand: current user, token
    │   └── tripStore.ts         ← Zustand: active trip context
    ├── types/
    │   └── index.ts             ← Shared TypeScript interfaces
    └── .env.local               ← NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 4. Database Schema (Source of Truth)

All agents must follow this schema. Do not deviate without updating this file.

```
users
  id            UUID PK
  email         VARCHAR UNIQUE NOT NULL
  password_hash VARCHAR NOT NULL
  full_name     VARCHAR NOT NULL
  avatar_url    VARCHAR NULLABLE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

trips
  id            UUID PK
  user_id       UUID FK → users.id
  title         VARCHAR NOT NULL
  description   TEXT NULLABLE
  cover_url     VARCHAR NULLABLE
  start_date    DATE NOT NULL
  end_date      DATE NOT NULL
  is_public     BOOLEAN DEFAULT false
  total_budget  NUMERIC(10,2) NULLABLE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

trip_stops
  id            UUID PK
  trip_id       UUID FK → trips.id
  city_name     VARCHAR NOT NULL
  country       VARCHAR NOT NULL
  order_index   INTEGER NOT NULL        ← for drag-to-reorder
  start_date    DATE NOT NULL
  end_date      DATE NOT NULL
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

activities
  id            UUID PK
  stop_id       UUID FK → trip_stops.id
  title         VARCHAR NOT NULL
  description   TEXT NULLABLE
  category      VARCHAR                 ← sightseeing | food | adventure | transport | accommodation
  cost          NUMERIC(10,2) DEFAULT 0
  currency      VARCHAR(3) DEFAULT 'USD'
  scheduled_at  TIMESTAMP NULLABLE
  duration_mins INTEGER NULLABLE
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

expenses
  id            UUID PK
  trip_id       UUID FK → trips.id
  stop_id       UUID FK NULLABLE → trip_stops.id
  label         VARCHAR NOT NULL
  amount        NUMERIC(10,2) NOT NULL
  category      VARCHAR                 ← transport | stay | food | activity | misc
  currency      VARCHAR(3) DEFAULT 'USD'
  date          DATE NOT NULL
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

packing_items
  id            UUID PK
  trip_id       UUID FK → trips.id
  label         VARCHAR NOT NULL
  category      VARCHAR                 ← clothing | documents | electronics | toiletries | misc
  is_packed     BOOLEAN DEFAULT false
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

trip_notes
  id            UUID PK
  trip_id       UUID FK → trips.id
  stop_id       UUID FK NULLABLE → trip_stops.id
  content       TEXT NOT NULL
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
```

---

## 5. API Contract

Base URL: `http://localhost:8000/api/v1`

All protected routes require header: `Authorization: Bearer <jwt_token>`

```
AUTH
  POST   /auth/register          body: { email, password, full_name }
  POST   /auth/login             body: { email, password } → { access_token, token_type }
  GET    /auth/me                → current user

TRIPS
  GET    /trips                  → list user's trips
  POST   /trips                  body: TripCreate → Trip
  GET    /trips/{id}             → Trip with stops
  PUT    /trips/{id}             body: TripUpdate → Trip
  DELETE /trips/{id}
  GET    /trips/{id}/budget      → BudgetSummary (aggregated expenses by category)

STOPS
  GET    /trips/{trip_id}/stops  → list stops ordered by order_index
  POST   /trips/{trip_id}/stops  body: StopCreate → Stop
  PUT    /stops/{id}             body: StopUpdate → Stop
  DELETE /stops/{id}
  PATCH  /stops/reorder          body: [{ id, order_index }]

ACTIVITIES
  GET    /stops/{stop_id}/activities
  POST   /stops/{stop_id}/activities  body: ActivityCreate → Activity
  PUT    /activities/{id}
  DELETE /activities/{id}

EXPENSES
  GET    /trips/{trip_id}/expenses
  POST   /trips/{trip_id}/expenses   body: ExpenseCreate → Expense
  DELETE /expenses/{id}

PACKING
  GET    /trips/{trip_id}/packing
  POST   /trips/{trip_id}/packing    body: PackingItemCreate → PackingItem
  PATCH  /packing/{id}/toggle        → toggles is_packed
  DELETE /packing/{id}

NOTES
  GET    /trips/{trip_id}/notes
  POST   /trips/{trip_id}/notes      body: NoteCreate → Note
  PUT    /notes/{id}
  DELETE /notes/{id}
```

---

## 6. MVP Screen Priority

Build in this order. Do not skip ahead.

| Priority | Screen               | Route                        | Complexity |
|---|---|---|---|
| P0       | Login / Signup       | /login, /signup              | Low        |
| P0       | Dashboard            | /                            | Medium     |
| P0       | My Trips             | /trips                       | Low        |
| P0       | Create Trip          | /trips/new                   | Low        |
| P0       | Itinerary Builder    | /trips/[id]/builder          | High       |
| P0       | Itinerary View       | /trips/[id]                  | Medium     |
| P1       | Budget Breakdown     | /trips/[id]/budget           | Medium     |
| P1       | Packing Checklist    | /trips/[id]/checklist        | Low        |
| P1       | Trip Notes           | /trips/[id]/notes            | Low        |
| P2       | Public Share View    | /share/[id]                  | Low        |
| P2       | User Profile         | /profile                     | Low        |

---

## 7. Environment Variables

```bash
# backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/traveloop
SECRET_KEY=your-256-bit-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 8. Naming Conventions (Non-Negotiable)

| Context          | Convention     | Example                    |
|---|---|---|
| DB tables        | snake_case plural | `trip_stops`, `packing_items` |
| DB columns       | snake_case     | `user_id`, `start_date`    |
| API routes       | kebab-case     | `/trip-stops`, `/auth/me`  |
| Python files     | snake_case     | `trip_service.py`          |
| Python classes   | PascalCase     | `TripCreate`, `UserRead`   |
| React components | PascalCase     | `TripCard`, `StopForm`     |
| React hooks      | camelCase + use | `useTrips`, `useAuth`     |
| TS interfaces    | PascalCase     | `Trip`, `Stop`, `User`     |
| Zustand stores   | camelCase      | `authStore`, `tripStore`   |

---

## 9. Non-Negotiables

- Never return `password_hash` in any API response
- Never hardcode secrets — read from `.env`
- All timestamps stored as UTC
- All monetary values stored as `NUMERIC(10,2)` — never floats
- Every API response must match its Pydantic schema exactly
- Frontend never calls the DB directly — always via the API
- Do not use `any` type in TypeScript
- All forms must have client-side validation before API calls
- CORS must be enabled for `http://localhost:3000` from day one

---

## 10. Definition of Done

A feature is done when:
1. Backend route exists and returns correct schema
2. Frontend screen renders correctly on both mobile and desktop
3. Error states are handled (loading spinner, empty state, error message)
4. Antigravity browser validation passes (agent self-tests in browser)
