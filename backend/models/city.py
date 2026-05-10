import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base


class City(Base):
    __tablename__ = "cities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    cost_index: Mapped[int] = mapped_column(Integer, nullable=False, default=2)  # 1=budget 5=luxury
    popularity: Mapped[int] = mapped_column(Integer, nullable=False, default=50)  # 1-100
