import uuid
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.trip import Trip
    from models.activity import Activity
    from models.expense import Expense
    from models.note import TripNote


class Stop(TimestampMixin, Base):
    __tablename__ = "trip_stops"

    trip_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True
    )
    city_name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    trip: Mapped["Trip"] = relationship("Trip", back_populates="stops")
    activities: Mapped[list["Activity"]] = relationship(
        "Activity", back_populates="stop", cascade="all, delete-orphan"
    )
