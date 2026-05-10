---
name: backend
description: FastAPI backend conventions for Traveloop. Use when building routes, services, models, schemas, or anything in the backend/ folder. Covers SQLAlchemy async patterns, Pydantic v2, JWT auth, and error handling standards.
---

# Skill: Backend — FastAPI + SQLAlchemy
# Agent: Backend Agent (Agent 2)
# Read PLANNING.md first. This file extends it with backend-specific conventions.

---

## 1. Project Setup Checklist

Before writing any route, verify these exist:
- [ ] `backend/core/config.py` — Settings class with DATABASE_URL, SECRET_KEY
- [ ] `backend/core/database.py` — async engine, AsyncSession, get_db dependency
- [ ] `backend/core/security.py` — hash_password, verify_password, create_token, decode_token
- [ ] `backend/dependencies.py` — get_current_user using Depends(oauth2_scheme)
- [ ] `backend/models/base.py` — Base class with UUID id, created_at, updated_at
- [ ] `backend/main.py` — app with CORS, all routers mounted at `/api/v1`

---

## 2. Mandatory App Setup Pattern

```python
# main.py — copy this exactly
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database import engine
from models import base
from routers import auth, trips, stops, activities, expenses, notes, packing

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(base.Base.metadata.create_all)
    yield

app = FastAPI(title="Traveloop API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")
app.include_router(stops.router, prefix="/api/v1")
app.include_router(activities.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(notes.router, prefix="/api/v1")
app.include_router(packing.router, prefix="/api/v1")
```

---

## 3. Database Session Pattern

```python
# core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

---

## 4. Base Model Pattern

```python
# models/base.py
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
```

---

## 5. Router Pattern (follow for every domain)

```python
# routers/trips.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.trip import TripCreate, TripRead, TripUpdate
from services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("/", response_model=list[TripRead])
async def list_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.get_user_trips(db, current_user.id)

@router.post("/", response_model=TripRead, status_code=status.HTTP_201_CREATED)
async def create_trip(
    payload: TripCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.create_trip(db, payload, current_user.id)

@router.get("/{trip_id}", response_model=TripRead)
async def get_trip(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    trip = await trip_service.get_trip(db, trip_id, current_user.id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
```

---

## 6. Service Layer Pattern

Business logic lives here, not in routers. Routers only handle HTTP concerns.

```python
# services/trip_service.py
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.trip import Trip
from schemas.trip import TripCreate

async def get_user_trips(db: AsyncSession, user_id: uuid.UUID) -> list[Trip]:
    result = await db.execute(
        select(Trip).where(Trip.user_id == user_id).order_by(Trip.created_at.desc())
    )
    return result.scalars().all()

async def create_trip(db: AsyncSession, payload: TripCreate, user_id: uuid.UUID) -> Trip:
    trip = Trip(**payload.model_dump(), user_id=user_id)
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip

async def get_trip(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> Trip | None:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    return result.scalar_one_or_none()
```

---

## 7. Pydantic Schema Pattern

```python
# schemas/trip.py
from pydantic import BaseModel, ConfigDict
from datetime import date
from uuid import UUID
from typing import Optional

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    total_budget: Optional[float] = None
    is_public: bool = False

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = None
    is_public: Optional[bool] = None

class TripRead(TripBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
```

---

## 8. Auth Pattern

```python
# core/security.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(
        {"sub": subject, "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise ValueError("Invalid token")
```

---

## 9. Error Handling Standards

| Situation              | HTTP Code | Detail message              |
|---|---|---|
| Resource not found     | 404       | `"{Resource} not found"`    |
| Unauthorized access    | 401       | `"Not authenticated"`       |
| Forbidden (not owner)  | 403       | `"Not authorized"`          |
| Duplicate (e.g. email) | 409       | `"Email already registered"`|
| Invalid input          | 422       | Auto-handled by Pydantic    |

Always use `raise HTTPException(status_code=..., detail="...")`.
Never return error details in a 200 response.

---

## 10. Budget Aggregation (Special Case)

```python
# services/budget_service.py
from sqlalchemy import select, func, case
from models.expense import Expense

async def get_budget_summary(db: AsyncSession, trip_id: uuid.UUID) -> dict:
    result = await db.execute(
        select(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        .where(Expense.trip_id == trip_id)
        .group_by(Expense.category)
    )
    rows = result.all()
    breakdown = {row.category: float(row.total) for row in rows}
    total = sum(breakdown.values())
    return {
        "total": total,
        "breakdown": breakdown,
        "by_category": [
            {"category": k, "amount": v, "percentage": round(v / total * 100, 1) if total else 0}
            for k, v in breakdown.items()
        ]
    }
```

---

## 11. Requirements

```
# requirements.txt
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy[asyncio]==2.0.29
asyncpg==0.29.0
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic[email]==2.7.1
pydantic-settings==2.2.1
python-multipart==0.0.9
```

---

## 12. Hard Rules — Never Violate

- Never return `password_hash` in any response schema
- Never put DB queries directly in a router — use services
- Never use `sync` SQLAlchemy — this is a fully async codebase
- Never use `float` for money — use `NUMERIC(10,2)` in DB and `Decimal` in Python
- Never skip `Depends(get_current_user)` on a protected route
- Never commit to DB without a subsequent `await db.refresh(obj)`
- Always validate ownership: check `obj.user_id == current_user.id` before returning data
