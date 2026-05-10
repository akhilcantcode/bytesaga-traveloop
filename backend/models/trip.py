import uuid
from decimal import Decimal
from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from models.user import User
    from models.stop import Stop
    from models.expense import Expense
    from models.note import TripNote
    from models.packing_item import PackingItem


class Trip(TimestampMixin, Base):
    __tablename__ = "trips"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    total_budget: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="trips")
    stops: Mapped[list["Stop"]] = relationship(
        "Stop", back_populates="trip", cascade="all, delete-orphan", order_by="Stop.order_index"
    )
    expenses: Mapped[list["Expense"]] = relationship(
        "Expense", back_populates="trip", cascade="all, delete-orphan"
    )
    notes: Mapped[list["TripNote"]] = relationship(
        "TripNote", back_populates="trip", cascade="all, delete-orphan"
    )
    packing_items: Mapped[list["PackingItem"]] = relationship(
        "PackingItem", back_populates="trip", cascade="all, delete-orphan"
    )
