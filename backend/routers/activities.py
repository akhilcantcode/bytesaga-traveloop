import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.activity import ActivityCreate, ActivityRead, ActivityUpdate
from services import activity_service

router = APIRouter(tags=["activities"])


@router.get("/stops/{stop_id}/activities", response_model=list[ActivityRead])
async def list_activities(
    stop_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await activity_service.get_stop_activities(db, stop_id, current_user.id)


@router.post("/stops/{stop_id}/activities", response_model=ActivityRead, status_code=status.HTTP_201_CREATED)
async def create_activity(
    stop_id: uuid.UUID,
    payload: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await activity_service.create_activity(db, stop_id, payload, current_user.id)


@router.put("/activities/{activity_id}", response_model=ActivityRead)
async def update_activity(
    activity_id: uuid.UUID,
    payload: ActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await activity_service.update_activity(db, activity_id, payload, current_user.id)


@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await activity_service.delete_activity(db, activity_id, current_user.id)
