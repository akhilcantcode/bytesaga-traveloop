---
name: database
description: SQLAlchemy 2.x async models for Traveloop. Use when building database models, relationships, Alembic migrations, or anything in the backend/models/ folder. Covers async engine, Pydantic v2, JWT auth, and error handling standards.
---
# Skill: Database — SQLAlchemy 2.x + PostgreSQL + Alembic
# Agent: Database Agent (Agent 1) — Run this agent FIRST
# Read PLANNING.md first. This file extends it with DB-specific conventions.

---

## 1. Agent Mandate

You are responsible for the entire data layer:
1. SQLAlchemy async models (all 7 tables)
2. All relationships with `back_populates`
3. Alembic migration setup + initial migration
4. Seed script with realistic sample data

The backend and frontend agents are blocked on you. Finish fast and correct.

---

## 2. Setup Sequence (Do Exactly in This Order)

```bash
# 1. Create virtual environment
python -m venv venv && source venv/bin/activate

# 2. Install dependencies
pip install sqlalchemy[asyncio] asyncpg alembic pydantic-settings python-dotenv

# 3. Init alembic
alembic init alembic

# 4. Update alembic/env.py to use async engine (see section 4 below)

# 5. Create all model files

# 6. Generate initial migration
alembic revision --autogenerate -m "initial_schema"

# 7. Apply migration
alembic upgrade head

# 8. Run seed script
python seed.py
```

---

## 3. Full Model Definitions

### `models/base.py`
```python
import uuid
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID

class Base(DeclarativeBase):
    pass

class TimestampMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        onupdate=func.now(), nullable=False
    )
```

### `models/user.py`
```python
import uuid
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip

class User(TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    trips: Mapped[list["Trip"]] = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
```

### `models/trip.py`
```python
import uuid
from decimal import Decimal
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.user import User
    from models.stop import Stop
    from models.expense import Expense
    from models.note import TripNote
    from models.packing_item import PackingItem

class Trip(TimestampMixin, Base):
    __tablename__ = "trips"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    total_budget: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="trips")
    stops: Mapped[list["Stop"]] = relationship("Stop", back_populates="trip", cascade="all, delete-orphan", order_by="Stop.order_index")
    expenses: Mapped[list["Expense"]] = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")
    notes: Mapped[list["TripNote"]] = relationship("TripNote", back_populates="trip", cascade="all, delete-orphan")
    packing_items: Mapped[list["PackingItem"]] = relationship("PackingItem", back_populates="trip", cascade="all, delete-orphan")
```

### `models/stop.py`
```python
import uuid
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip
    from models.activity import Activity

class Stop(TimestampMixin, Base):
    __tablename__ = "trip_stops"

    trip_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="stops")
    activities: Mapped[list["Activity"]] = relationship("Activity", back_populates="stop", cascade="all, delete-orphan")
```

### `models/activity.py`
```python
import uuid
from decimal import Decimal
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Numeric, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.stop import Stop

class Activity(TimestampMixin, Base):
    __tablename__ = "activities"

    stop_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="sightseeing")
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_mins: Mapped[int | None] = mapped_column(Integer, nullable=True)

    stop: Mapped["Stop"] = relationship("Stop", back_populates="activities")
```

### `models/expense.py`
```python
import uuid
from decimal import Decimal
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip

class Expense(TimestampMixin, Base):
    __tablename__ = "expenses"

    trip_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="SET NULL"), nullable=True)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="misc")
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    date: Mapped[date] = mapped_column(Date, nullable=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="expenses")
```

### `models/packing_item.py`
```python
import uuid
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip

class PackingItem(TimestampMixin, Base):
    __tablename__ = "packing_items"

    trip_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="misc")
    is_packed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="packing_items")
```

### `models/note.py`
```python
import uuid
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip

class TripNote(TimestampMixin, Base):
    __tablename__ = "trip_notes"

    trip_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="SET NULL"), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="notes")
```

---

## 4. Alembic Async Config

Replace `alembic/env.py` entirely with this:

```python
import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
from core.config import settings
from models.base import Base
from models import user, trip, stop, activity, expense, note, packing_item

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

## 5. Seed Script

```python
# seed.py — run with: python seed.py
import asyncio
from datetime import date, datetime, timezone
from decimal import Decimal
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from core.config import settings
from core.security import hash_password
from models.base import Base
from models.user import User
from models.trip import Trip
from models.stop import Stop
from models.activity import Activity
from models.expense import Expense
from models.packing_item import PackingItem
from models.note import TripNote

engine = create_async_engine(settings.DATABASE_URL)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        user = User(
            email="demo@traveloop.com",
            password_hash=hash_password("demo1234"),
            full_name="Alex Rivera",
        )
        db.add(user)
        await db.flush()

        trip = Trip(
            user_id=user.id,
            title="Southeast Asia Adventure",
            description="Two weeks across Thailand, Vietnam, and Cambodia.",
            start_date=date(2026, 7, 1),
            end_date=date(2026, 7, 14),
            total_budget=Decimal("3000.00"),
        )
        db.add(trip)
        await db.flush()

        stop1 = Stop(trip_id=trip.id, city_name="Bangkok", country="Thailand", order_index=0, start_date=date(2026, 7, 1), end_date=date(2026, 7, 4))
        stop2 = Stop(trip_id=trip.id, city_name="Hanoi", country="Vietnam", order_index=1, start_date=date(2026, 7, 5), end_date=date(2026, 7, 9))
        stop3 = Stop(trip_id=trip.id, city_name="Siem Reap", country="Cambodia", order_index=2, start_date=date(2026, 7, 10), end_date=date(2026, 7, 14))
        db.add_all([stop1, stop2, stop3])
        await db.flush()

        db.add_all([
            Activity(stop_id=stop1.id, title="Grand Palace Tour", category="sightseeing", cost=Decimal("15.00")),
            Activity(stop_id=stop1.id, title="Street food tour — Chinatown", category="food", cost=Decimal("20.00")),
            Activity(stop_id=stop2.id, title="Hoan Kiem Lake walk", category="sightseeing", cost=Decimal("0.00")),
            Activity(stop_id=stop2.id, title="Old Quarter cooking class", category="food", cost=Decimal("35.00")),
            Activity(stop_id=stop3.id, title="Angkor Wat sunrise", category="sightseeing", cost=Decimal("37.00")),
        ])

        db.add_all([
            Expense(trip_id=trip.id, stop_id=stop1.id, label="Flight BKK→HAN", amount=Decimal("120.00"), category="transport", date=date(2026, 7, 4)),
            Expense(trip_id=trip.id, stop_id=stop1.id, label="Hotel Bangkok (3n)", amount=Decimal("180.00"), category="stay", date=date(2026, 7, 1)),
            Expense(trip_id=trip.id, stop_id=stop2.id, label="Hotel Hanoi (4n)", amount=Decimal("200.00"), category="stay", date=date(2026, 7, 5)),
            Expense(trip_id=trip.id, stop_id=stop3.id, label="Angkor pass", amount=Decimal("62.00"), category="activity", date=date(2026, 7, 10)),
        ])

        db.add_all([
            PackingItem(trip_id=trip.id, label="Passport", category="documents"),
            PackingItem(trip_id=trip.id, label="Travel adapter", category="electronics"),
            PackingItem(trip_id=trip.id, label="Sunscreen SPF 50", category="toiletries"),
            PackingItem(trip_id=trip.id, label="Light linen shirts x3", category="clothing"),
        ])

        db.add(TripNote(trip_id=trip.id, content="Visa on arrival for Cambodia — bring USD cash for the fee."))

        await db.commit()
        print("Seed complete. Login: demo@traveloop.com / demo1234")

asyncio.run(seed())
```

---

## 6. Indexes to Add (After Initial Migration)

```python
# Add these to a second migration for performance
from sqlalchemy import Index

# In models, add __table_args__:

# Trip model
__table_args__ = (
    Index("ix_trips_user_id_created_at", "user_id", "created_at"),
)

# Stop model
__table_args__ = (
    Index("ix_stops_trip_id_order", "trip_id", "order_index"),
)
```

---

## 7. Hard Rules — Never Violate

- Always use `UUID` (not `Integer`) for all primary and foreign keys
- Always use `NUMERIC(10,2)` (not `Float`) for monetary columns
- Always define both sides of every relationship with `back_populates`
- Always use `cascade="all, delete-orphan"` on parent-side relationships
- Always import models in `alembic/env.py` so autogenerate detects them
- Always `await db.flush()` before accessing a newly created object's ID
- Never call `Base.metadata.create_all` in production — use Alembic only
- Never store passwords in plain text — always use `hash_password()` from security.py
- All timestamps must be timezone-aware (`DateTime(timezone=True)`)
