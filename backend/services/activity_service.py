import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.activity import Activity
from models.stop import Stop
from models.trip import Trip
from schemas.activity import ActivityCreate, ActivityUpdate


async def _verify_stop_ownership(db: AsyncSession, stop_id: uuid.UUID, user_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Stop)
        .join(Trip, Stop.trip_id == Trip.id)
        .where(Stop.id == stop_id, Trip.user_id == user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")


async def get_stop_activities(db: AsyncSession, stop_id: uuid.UUID, user_id: uuid.UUID) -> list[Activity]:
    await _verify_stop_ownership(db, stop_id, user_id)
    result = await db.execute(
        select(Activity)
        .where(Activity.stop_id == stop_id)
        .order_by(Activity.scheduled_at.asc())
    )
    return list(result.scalars().all())


async def create_activity(
    db: AsyncSession, stop_id: uuid.UUID, payload: ActivityCreate, user_id: uuid.UUID
) -> Activity:
    await _verify_stop_ownership(db, stop_id, user_id)
    activity = Activity(**payload.model_dump(), stop_id=stop_id)
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity


async def _get_activity(db: AsyncSession, activity_id: uuid.UUID, user_id: uuid.UUID) -> Activity:
    result = await db.execute(
        select(Activity)
        .join(Stop, Activity.stop_id == Stop.id)
        .join(Trip, Stop.trip_id == Trip.id)
        .where(Activity.id == activity_id, Trip.user_id == user_id)
    )
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return activity


async def update_activity(
    db: AsyncSession, activity_id: uuid.UUID, payload: ActivityUpdate, user_id: uuid.UUID
) -> Activity:
    activity = await _get_activity(db, activity_id, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(activity, field, value)
    await db.commit()
    await db.refresh(activity)
    return activity


async def delete_activity(db: AsyncSession, activity_id: uuid.UUID, user_id: uuid.UUID) -> None:
    activity = await _get_activity(db, activity_id, user_id)
    await db.delete(activity)
    await db.commit()
