from pydantic import BaseModel
from typing import List

class PlatformStats(BaseModel):
    total_users: int
    total_trips: int
    total_expenses: float

class PopularCity(BaseModel):
    city_name: str
    country: str
    count: int

class PopularCitiesResponse(BaseModel):
    cities: List[PopularCity]
