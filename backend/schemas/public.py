from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import date
from typing import Optional

from schemas.activity import ActivityRead
from schemas.stop import StopRead

class PublicStopRead(StopRead):
    activities: list[ActivityRead] = []

class PublicTripRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    title: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    start_date: date
    end_date: date
    stops: list[PublicStopRead] = []
