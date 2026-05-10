from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal
from typing import Optional

EXPENSE_CATEGORIES = ["transport", "stay", "food", "activity", "misc"]


class ExpenseBase(BaseModel):
    label: str
    amount: Decimal
    category: str = "misc"
    currency: str = "USD"
    date: date
    stop_id: Optional[UUID] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseRead(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    created_at: datetime
    updated_at: datetime
