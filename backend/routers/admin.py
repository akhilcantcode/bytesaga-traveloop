from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from core.database import get_db
from dependencies import get_current_admin
from models.user import User
from models.trip import Trip
from models.expense import Expense
from models.stop import Stop
from schemas.auth import UserRead
from schemas.admin import PlatformStats, PopularCitiesResponse

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=PlatformStats)
async def get_platform_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    users_count = await db.scalar(select(func.count()).select_from(User))
    trips_count = await db.scalar(select(func.count()).select_from(Trip))
    total_expenses = await db.scalar(select(func.sum(Expense.amount)))
    
    return {
        "total_users": users_count or 0,
        "total_trips": trips_count or 0,
        "total_expenses": float(total_expenses or 0.0)
    }

@router.get("/cities/popular", response_model=PopularCitiesResponse)
async def get_popular_cities(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Stop.city_name, Stop.country, func.count(Stop.id).label("count"))
        .group_by(Stop.city_name, Stop.country)
        .order_by(desc("count"))
        .limit(10)
    )
    
    cities = []
    for row in result:
        cities.append({"city_name": row.city_name, "country": row.country, "count": row.count})
        
    return {"cities": cities}

@router.get("/users", response_model=list[UserRead])
async def list_users(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()
