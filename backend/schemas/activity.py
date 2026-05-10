from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from typing import Optional

ACTIVITY_CATEGORIES = ["sightseeing", "food", "adventure", "transport", "accommodation"]


class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "sightseeing"
    cost: Decimal = Decimal("0.00")
    currency: str = "USD"
    scheduled_at: Optional[datetime] = None
    duration_mins: Optional[int] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    cost: Optional[Decimal] = None
    currency: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_mins: Optional[int] = None


class ActivityRead(ActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    stop_id: UUID
    created_at: datetime
    updated_at: datetime
