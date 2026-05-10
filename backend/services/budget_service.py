import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models.expense import Expense
from models.activity import Activity
from models.stop import Stop


async def get_budget_summary(db: AsyncSession, trip_id: uuid.UUID) -> dict:
    # 1. Sum expenses grouped by category
    expense_result = await db.execute(
        select(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .where(Expense.trip_id == trip_id)
        .group_by(Expense.category)
    )
    breakdown: dict[str, float] = {
        row.category: float(row.total) for row in expense_result.all()
    }

    # 2. Sum activity costs (via stop → trip join), roll into "activity" category
    activity_result = await db.execute(
        select(func.sum(Activity.cost).label("total"))
        .join(Stop, Activity.stop_id == Stop.id)
        .where(Stop.trip_id == trip_id)
        .where(Activity.cost > 0)
    )
    activity_total = activity_result.scalar_one_or_none()
    if activity_total:
        existing = breakdown.get("activity", 0.0)
        breakdown["activity"] = existing + float(activity_total)

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
