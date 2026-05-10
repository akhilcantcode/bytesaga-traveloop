import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from core.database import get_db
from models.trip import Trip
from models.stop import Stop
from schemas.public import PublicTripRead

router = APIRouter(prefix="/public", tags=["public"])

@router.get("/trips/{trip_id}", response_model=PublicTripRead)
async def get_public_trip(trip_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Trip)
        .options(
            selectinload(Trip.stops).selectinload(Stop.activities)
        )
        .where(Trip.id == trip_id, Trip.is_public == True)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found or not public")
    return trip
