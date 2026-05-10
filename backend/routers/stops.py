import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.stop import StopCreate, StopRead, StopUpdate, StopReorderItem
from services import stop_service

router = APIRouter(tags=["stops"])


@router.get("/trips/{trip_id}/stops", response_model=list[StopRead])
async def list_stops(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await stop_service.get_trip_stops(db, trip_id, current_user.id)


@router.post("/trips/{trip_id}/stops", response_model=StopRead, status_code=status.HTTP_201_CREATED)
async def create_stop(
    trip_id: uuid.UUID,
    payload: StopCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await stop_service.create_stop(db, trip_id, payload, current_user.id)


@router.put("/stops/{stop_id}", response_model=StopRead)
async def update_stop(
    stop_id: uuid.UUID,
    payload: StopUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await stop_service.update_stop(db, stop_id, payload, current_user.id)


@router.delete("/stops/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stop(
    stop_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await stop_service.delete_stop(db, stop_id, current_user.id)


@router.patch("/stops/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_stops(
    payload: list[StopReorderItem],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await stop_service.reorder_stops(db, payload, current_user.id)
