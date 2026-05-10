import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.trip import TripCreate, TripRead, TripUpdate, BudgetSummary
from services import trip_service, budget_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("/", response_model=list[TripRead])
async def list_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.get_user_trips(db, current_user.id)


@router.post("/", response_model=TripRead, status_code=status.HTTP_201_CREATED)
async def create_trip(
    payload: TripCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.create_trip(db, payload, current_user.id)


@router.get("/{trip_id}", response_model=TripRead)
async def get_trip(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.get_trip(db, trip_id, current_user.id)


@router.put("/{trip_id}", response_model=TripRead)
async def update_trip(
    trip_id: uuid.UUID,
    payload: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await trip_service.update_trip(db, trip_id, payload, current_user.id)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await trip_service.delete_trip(db, trip_id, current_user.id)


@router.get("/{trip_id}/budget", response_model=BudgetSummary)
async def get_trip_budget(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify ownership via trip service first
    await trip_service.get_trip(db, trip_id, current_user.id)
    return await budget_service.get_budget_summary(db, trip_id)
