from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from models.city import City
from schemas.city import CityRead

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("/search", response_model=list[CityRead])
async def search_cities(
    q: str = Query(default="", min_length=0),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(City)
    if q.strip():
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            City.name.ilike(pattern) | City.country.ilike(pattern)
        )
    stmt = stmt.order_by(City.popularity.desc()).limit(20)
    result = await db.execute(stmt)
    return result.scalars().all()
