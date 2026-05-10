import uuid
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip


class PackingItem(TimestampMixin, Base):
    __tablename__ = "packing_items"

    trip_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="misc")
    is_packed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="packing_items")
