import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.expense import ExpenseCreate, ExpenseRead
from services import expense_service

router = APIRouter(tags=["expenses"])


@router.get("/trips/{trip_id}/expenses", response_model=list[ExpenseRead])
async def list_expenses(
    trip_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await expense_service.get_trip_expenses(db, trip_id, current_user.id)


@router.post("/trips/{trip_id}/expenses", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
async def create_expense(
    trip_id: uuid.UUID,
    payload: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await expense_service.create_expense(db, trip_id, payload, current_user.id)


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await expense_service.delete_expense(db, expense_id, current_user.id)
