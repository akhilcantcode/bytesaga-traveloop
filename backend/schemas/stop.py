from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from uuid import UUID
from typing import Optional


class StopBase(BaseModel):
    city_name: str
    country: str
    order_index: int
    start_date: date
    end_date: date


class StopCreate(StopBase):
    pass


class StopUpdate(BaseModel):
    city_name: Optional[str] = None
    country: Optional[str] = None
    order_index: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class StopRead(StopBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    created_at: datetime
    updated_at: datetime


class StopReorderItem(BaseModel):
    id: UUID
    order_index: int
