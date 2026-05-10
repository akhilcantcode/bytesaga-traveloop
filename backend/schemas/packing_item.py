from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional

PACKING_CATEGORIES = ["clothing", "documents", "electronics", "toiletries", "misc"]


class PackingItemBase(BaseModel):
    label: str
    category: str = "misc"
    is_packed: bool = False


class PackingItemCreate(PackingItemBase):
    pass


class PackingItemRead(PackingItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    created_at: datetime
    updated_at: datetime
