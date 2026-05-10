from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct
from core.database import get_db
from dependencies import get_current_user
from models.user import User
from models.trip import Trip
from models.stop import Stop
from models.expense import Expense
from models.city import City
from schemas.dashboard import DashboardStatsRead, DashboardDestinationRead, DashboardSuggestedTripRead
from decimal import Decimal
from datetime import date

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStatsRead)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Total Trips
    result_trips = await db.execute(select(func.count(Trip.id)).where(Trip.user_id == current_user.id))
    total_trips = result_trips.scalar() or 0

    # Total Countries
    result_countries = await db.execute(
        select(func.count(distinct(Stop.country)))
        .join(Trip, Stop.trip_id == Trip.id)
        .where(Trip.user_id == current_user.id)
    )
    total_countries = result_countries.scalar() or 0

    # Total Spent
    result_spent = await db.execute(
        select(func.sum(Expense.amount))
        .join(Trip, Expense.trip_id == Trip.id)
        .where(Trip.user_id == current_user.id)
    )
    total_spent = result_spent.scalar() or Decimal("0.0")

    # Upcoming Budget (budget of trips that haven't ended yet)
    today = date.today()
    result_budget = await db.execute(
        select(func.sum(Trip.total_budget))
        .where(Trip.user_id == current_user.id, Trip.end_date >= today)
    )
    upcoming_budget = result_budget.scalar() or Decimal("0.0")

    return DashboardStatsRead(
        total_trips=total_trips,
        total_countries=total_countries,
        total_spent=total_spent,
        upcoming_budget=upcoming_budget
    )

@router.get("/destinations", response_model=list[DashboardDestinationRead])
async def get_dashboard_destinations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(City).order_by(City.popularity.desc()).limit(3)
    )
    cities = result.scalars().all()
    
    # Map high quality Unsplash images to destinations manually, or fallback to a general image
    images_map = {
        "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
        "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
        "Tokyo": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=600&auto=format&fit=crop",
        "Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop",
        "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
        "Santorini": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600&auto=format&fit=crop"
    }

    destinations = []
    for city in cities:
        # Check if we have a mapped image, otherwise use a generic travel image
        image_url = images_map.get(city.name, "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop")
        destinations.append(
            DashboardDestinationRead(
                id=str(city.id),
                name=f"{city.name}, {city.country}",
                country=city.country,
                image=image_url
            )
        )
    return destinations

@router.get("/suggested-trips", response_model=list[DashboardSuggestedTripRead])
async def get_suggested_trips(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Trip)
        .where(Trip.is_public == True)
        .order_by(Trip.created_at.desc())
        .limit(2)
    )
    public_trips = result.scalars().all()
    
    # If no public trips exist, fallback to static defaults for the dashboard UI
    if not public_trips:
        return [
            DashboardSuggestedTripRead(
                id="static-1",
                title="Bali Escape",
                duration="7 days",
                price="$899",
                image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100&h=100&fit=crop"
            ),
            DashboardSuggestedTripRead(
                id="static-2",
                title="Rome City Break",
                duration="4 days",
                price="$450",
                image="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&h=100&fit=crop"
            )
        ]
        
    suggested = []
    for trip in public_trips:
        duration_days = (trip.end_date - trip.start_date).days + 1
        suggested.append(
            DashboardSuggestedTripRead(
                id=str(trip.id),
                title=trip.title,
                duration=f"{duration_days} days",
                price=f"${trip.total_budget}" if trip.total_budget else "Varied",
                image=trip.cover_url or "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop"
            )
        )
    return suggested
