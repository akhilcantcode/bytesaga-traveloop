from pydantic import BaseModel
from decimal import Decimal

class DashboardStatsRead(BaseModel):
    total_trips: int
    total_countries: int
    total_spent: Decimal
    upcoming_budget: Decimal

class DashboardDestinationRead(BaseModel):
    id: str
    name: str
    country: str
    image: str

class DashboardSuggestedTripRead(BaseModel):
    id: str
    title: str
    duration: str
    price: str
    image: str
