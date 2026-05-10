# seed.py — run with: python seed.py
import asyncio
from datetime import date
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
