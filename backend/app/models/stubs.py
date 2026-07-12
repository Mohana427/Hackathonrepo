from sqlalchemy import Column, Integer, String, Boolean, Enum, Float, DateTime, Text
from app.database import Base
import enum
from datetime import datetime


class AssetStatus(str, enum.Enum):
    AVAILABLE = "available"
    ALLOCATED = "allocated"
    RESERVED = "reserved"
    UNDER_MAINTENANCE = "under_maintenance"
    LOST = "lost"
    RETIRED = "retired"
    DISPOSED = "disposed"


class AssetCondition(str, enum.Enum):
    NEW = "new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    DAMAGED = "damaged"


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    tag = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, default="General")
    serial_number = Column(String, nullable=True)
    location = Column(String, default="HQ")
    condition = Column(Enum(AssetCondition), default=AssetCondition.GOOD)
    is_bookable = Column(Boolean, default=False)
    status = Column(Enum(AssetStatus), default=AssetStatus.AVAILABLE)
    acquisition_cost = Column(Float, nullable=True)
    acquisition_date = Column(DateTime, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)


class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
