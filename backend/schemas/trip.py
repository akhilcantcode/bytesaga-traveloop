from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal
from typing import Optional


class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    start_date: date
    end_date: date
    is_public: bool = False
    total_budget: Optional[Decimal] = None


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: Optional[bool] = None
    total_budget: Optional[Decimal] = None


class TripRead(TripBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


class BudgetCategoryItem(BaseModel):
    category: str
    amount: float
    percentage: float


class BudgetSummary(BaseModel):
    total: float
    breakdown: dict[str, float]
    by_category: list[BudgetCategoryItem]
