from pydantic import BaseModel
import uuid


class CityRead(BaseModel):
    id: uuid.UUID
    name: str
    country: str
    cost_index: int
    popularity: int

    model_config = {"from_attributes": True}
