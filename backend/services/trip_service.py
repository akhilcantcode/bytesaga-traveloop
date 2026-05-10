import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.trip import Trip
from schemas.trip import TripCreate, TripUpdate


async def get_user_trips(db: AsyncSession, user_id: uuid.UUID) -> list[Trip]:
    result = await db.execute(
        select(Trip)
        .where(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
    )
    return list(result.scalars().all())


async def create_trip(db: AsyncSession, payload: TripCreate, user_id: uuid.UUID) -> Trip:
    trip = Trip(**payload.model_dump(), user_id=user_id)
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip


async def get_trip(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> Trip:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


async def update_trip(
    db: AsyncSession, trip_id: uuid.UUID, payload: TripUpdate, user_id: uuid.UUID
) -> Trip:
    trip = await get_trip(db, trip_id, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)
    await db.commit()
    await db.refresh(trip)
    return trip


async def delete_trip(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> None:
    trip = await get_trip(db, trip_id, user_id)
    await db.delete(trip)
    await db.commit()
