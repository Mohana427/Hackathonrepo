from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.database import Base
import enum

class AssetStatus(str, enum.Enum):
    AVAILABLE = "available"
    ALLOCATED = "allocated"
    RESERVED = "reserved"
    UNDER_MAINTENANCE = "under_maintenance"
    LOST = "lost"
    RETIRED = "retired"
    DISPOSED = "disposed"

class Asset(Base):
    """Stub Asset model representing existing code from Person 2."""
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    tag = Column(String, unique=True, index=True)
    is_bookable = Column(Boolean, default=False)
    status = Column(Enum(AssetStatus), default=AssetStatus.AVAILABLE)

# Employee/Department stubs for foreign keys
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
