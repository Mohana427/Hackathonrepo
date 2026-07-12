from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.database import Base

class MaintenancePriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class MaintenanceStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    TECHNICIAN_ASSIGNED = "technician_assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    raised_by = Column(Integer, ForeignKey("employees.id"), nullable=False)
    issue_description = Column(Text, nullable=False)
    priority = Column(Enum(MaintenancePriority), default=MaintenancePriority.MEDIUM, nullable=False)
    photo_url = Column(String, nullable=True)
    status = Column(Enum(MaintenanceStatus), default=MaintenanceStatus.PENDING, nullable=False)
    technician_name = Column(String, nullable=True)
    approved_by = Column(Integer, ForeignKey("employees.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    
    asset = relationship("Asset")
    raiser = relationship("Employee", foreign_keys=[raised_by])
    approver = relationship("Employee", foreign_keys=[approved_by])
