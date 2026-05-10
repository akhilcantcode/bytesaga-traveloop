import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.note import TripNote
from models.trip import Trip
from schemas.note import NoteCreate, NoteUpdate


async def _verify_trip_ownership(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")


async def get_trip_notes(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> list[TripNote]:
    await _verify_trip_ownership(db, trip_id, user_id)
    result = await db.execute(
        select(TripNote)
        .where(TripNote.trip_id == trip_id)
        .order_by(TripNote.created_at.desc())
    )
    return list(result.scalars().all())


async def create_note(
    db: AsyncSession, trip_id: uuid.UUID, payload: NoteCreate, user_id: uuid.UUID
) -> TripNote:
    await _verify_trip_ownership(db, trip_id, user_id)
    note = TripNote(**payload.model_dump(), trip_id=trip_id)
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note


async def _get_note(db: AsyncSession, note_id: uuid.UUID, user_id: uuid.UUID) -> TripNote:
    result = await db.execute(
        select(TripNote)
        .join(Trip, TripNote.trip_id == Trip.id)
        .where(TripNote.id == note_id, Trip.user_id == user_id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


async def update_note(
    db: AsyncSession, note_id: uuid.UUID, payload: NoteUpdate, user_id: uuid.UUID
) -> TripNote:
    note = await _get_note(db, note_id, user_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    await db.commit()
    await db.refresh(note)
    return note


async def delete_note(db: AsyncSession, note_id: uuid.UUID, user_id: uuid.UUID) -> None:
    note = await _get_note(db, note_id, user_id)
    await db.delete(note)
    await db.commit()
