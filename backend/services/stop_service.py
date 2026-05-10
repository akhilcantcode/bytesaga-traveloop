import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.stop import Stop
from models.trip import Trip
from schemas.stop import StopCreate, StopUpdate, StopReorderItem


async def _verify_trip_ownership(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")


async def get_trip_stops(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> list[Stop]:
    await _verify_trip_ownership(db, trip_id, user_id)
    result = await db.execute(
        select(Stop)
        .where(Stop.trip_id == trip_id)
        .order_by(Stop.order_index)
    )
    return list(result.scalars().all())


async def create_stop(
    db: AsyncSession, trip_id: uuid.UUID, payload: StopCreate, user_id: uuid.UUID
) -> Stop:
    await _verify_trip_ownership(db, trip_id, user_id)
    stop = Stop(**payload.model_dump(), trip_id=trip_id)
    db.add(stop)
    await db.commit()
    await db.refresh(stop)
    return stop


async def _get_stop(db: AsyncSession, stop_id: uuid.UUID, user_id: uuid.UUID) -> Stop:
    result = await db.execute(
        select(Stop)
        .join(Trip, Stop.trip_id == Trip.id)
        .where(Stop.id == stop_id, Trip.user_id == user_id)
    )
    stop = result.scalar_one_or_none()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    return stop


async def update_stop(
    db: AsyncSession, stop_id: uuid.UUID, payload: StopUpdate, user_id: uuid.UUID
) -> Stop:
    stop = await _get_stop(db, stop_id, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(stop, field, value)
    await db.commit()
    await db.refresh(stop)
    return stop


async def delete_stop(db: AsyncSession, stop_id: uuid.UUID, user_id: uuid.UUID) -> None:
    stop = await _get_stop(db, stop_id, user_id)
    await db.delete(stop)
    await db.commit()


async def reorder_stops(
    db: AsyncSession, items: list[StopReorderItem], user_id: uuid.UUID
) -> None:
    for item in items:
        stop = await _get_stop(db, item.id, user_id)
        stop.order_index = item.order_index
    await db.commit()
