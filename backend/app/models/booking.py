from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.database import Base

class BookingStatus(str, enum.Enum):
    # We only store CANCELLED. UPCOMING/ONGOING/COMPLETED are derived on read.
    CANCELLED = "cancelled"
    # We add these here just for typing, but they aren't stored in the DB column typically
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    booked_by = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status_stored = Column("status", String, nullable=True) # Nullable, only set to 'cancelled'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    asset = relationship("Asset")
    booker = relationship("Employee")
    
    @property
    def computed_status(self) -> BookingStatus:
        if self.status_stored == BookingStatus.CANCELLED.value:
            return BookingStatus.CANCELLED
            
        now = datetime.utcnow()
        if now < self.start_time:
            return BookingStatus.UPCOMING
        elif self.start_time <= now <= self.end_time:
            return BookingStatus.ONGOING
        else:
            return BookingStatus.COMPLETED
