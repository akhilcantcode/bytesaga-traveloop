from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional


class NoteBase(BaseModel):
    content: str
    stop_id: Optional[UUID] = None


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    content: Optional[str] = None
    stop_id: Optional[UUID] = None


class NoteRead(NoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    created_at: datetime
    updated_at: datetime
