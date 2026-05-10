import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models.expense import Expense
from models.trip import Trip
from schemas.expense import ExpenseCreate


async def _verify_trip_ownership(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> None:
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")


async def get_trip_expenses(db: AsyncSession, trip_id: uuid.UUID, user_id: uuid.UUID) -> list[Expense]:
    await _verify_trip_ownership(db, trip_id, user_id)
    result = await db.execute(
        select(Expense)
        .where(Expense.trip_id == trip_id)
        .order_by(Expense.date.desc())
    )
    return list(result.scalars().all())


async def create_expense(
    db: AsyncSession, trip_id: uuid.UUID, payload: ExpenseCreate, user_id: uuid.UUID
) -> Expense:
    await _verify_trip_ownership(db, trip_id, user_id)
    expense = Expense(**payload.model_dump(), trip_id=trip_id)
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense


async def _get_expense(db: AsyncSession, expense_id: uuid.UUID, user_id: uuid.UUID) -> Expense:
    result = await db.execute(
        select(Expense)
        .join(Trip, Expense.trip_id == Trip.id)
        .where(Expense.id == expense_id, Trip.user_id == user_id)
    )
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


async def delete_expense(db: AsyncSession, expense_id: uuid.UUID, user_id: uuid.UUID) -> None:
    expense = await _get_expense(db, expense_id, user_id)
    await db.delete(expense)
    await db.commit()
