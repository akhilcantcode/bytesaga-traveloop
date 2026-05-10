import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.packing_item import PackingItemCreate, PackingItemRead
from services import packing_service

router = APIRouter(tags=["packing"])


@router.get("/trips/{trip_id}/packing", response_model=list[PackingItemRead])
async def list_packing_items(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await packing_service.get_trip_packing_items(db, trip_id, current_user.id)


@router.post("/trips/{trip_id}/packing", response_model=PackingItemRead, status_code=status.HTTP_201_CREATED)
async def create_packing_item(
    trip_id: uuid.UUID,
    payload: PackingItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await packing_service.create_packing_item(db, trip_id, payload, current_user.id)


@router.patch("/packing/{item_id}/toggle", response_model=PackingItemRead)
async def toggle_packing_item(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await packing_service.toggle_packing_item(db, item_id, current_user.id)


@router.delete("/packing/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await packing_service.delete_packing_item(db, item_id, current_user.id)
