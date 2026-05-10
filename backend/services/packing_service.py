import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.packing_item import PackingItem
from models.trip import Trip
from schemas.packing_item import PackingItemCreate


async def _verify_trip_ownership(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")


async def get_trip_packing_items(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> list[PackingItem]:
    await _verify_trip_ownership(db, trip_id, user_id)
    result = await db.execute(
        select(PackingItem)
        .where(PackingItem.trip_id == trip_id)
        .order_by(PackingItem.category, PackingItem.label)
    )
    return list(result.scalars().all())


async def create_packing_item(
    db: AsyncSession, trip_id: uuid.UUID, payload: PackingItemCreate, user_id: uuid.UUID
) -> PackingItem:
    await _verify_trip_ownership(db, trip_id, user_id)
    item = PackingItem(**payload.model_dump(), trip_id=trip_id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def _get_packing_item(db: AsyncSession, item_id: uuid.UUID, user_id: uuid.UUID) -> PackingItem:
    result = await db.execute(
        select(PackingItem)
        .join(Trip, PackingItem.trip_id == Trip.id)
        .where(PackingItem.id == item_id, Trip.user_id == user_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Packing item not found")
    return item


async def toggle_packing_item(db: AsyncSession, item_id: uuid.UUID, user_id: uuid.UUID) -> PackingItem:
    item = await _get_packing_item(db, item_id, user_id)
    item.is_packed = not item.is_packed
    await db.commit()
    await db.refresh(item)
    return item


async def delete_packing_item(db: AsyncSession, item_id: uuid.UUID, user_id: uuid.UUID) -> None:
    item = await _get_packing_item(db, item_id, user_id)
    await db.delete(item)
    await db.commit()
