import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models.expense import Expense


async def get_budget_summary(db: AsyncSession, trip_id: uuid.UUID) -> dict:
    result = await db.execute(
        select(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .where(Expense.trip_id == trip_id)
        .group_by(Expense.category)
    )
    rows = result.all()
    breakdown: dict[str, float] = {row.category: float(row.total) for row in rows}
    total = sum(breakdown.values())
    return {
        "total": total,
        "breakdown": breakdown,
        "by_category": [
            {
                "category": k,
                "amount": v,
                "percentage": round(v / total * 100, 1) if total else 0.0,
            }
            for k, v in breakdown.items()
        ],
    }
