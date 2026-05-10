import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.note import NoteCreate, NoteRead, NoteUpdate
from services import note_service

router = APIRouter(tags=["notes"])


@router.get("/trips/{trip_id}/notes", response_model=list[NoteRead])
async def list_notes(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await note_service.get_trip_notes(db, trip_id, current_user.id)


@router.post("/trips/{trip_id}/notes", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(
    trip_id: uuid.UUID,
    payload: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await note_service.create_note(db, trip_id, payload, current_user.id)


@router.put("/notes/{note_id}", response_model=NoteRead)
async def update_note(
    note_id: uuid.UUID,
    payload: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await note_service.update_note(db, note_id, payload, current_user.id)


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await note_service.delete_note(db, note_id, current_user.id)
