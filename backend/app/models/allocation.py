from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.database import Base

class AllocationStatus(str, enum.Enum):
    ACTIVE = "active"
    RETURNED = "returned"

class TransferStatus(str, enum.Enum):
    REQUESTED = "requested"
    APPROVED = "approved"
    REJECTED = "rejected"

class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    allocated_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    expected_return_date = Column(DateTime, nullable=True)
    actual_return_date = Column(DateTime, nullable=True)
    status = Column(Enum(AllocationStatus), default=AllocationStatus.ACTIVE, nullable=False)
    condition_check_in_notes = Column(Text, nullable=True)
    
    asset = relationship("Asset")
    employee = relationship("Employee")
    department = relationship("Department")

class TransferRequest(Base):
    __tablename__ = "transfer_requests"

    id = Column(Integer, primary_key=True, index=True)
    allocation_id = Column(Integer, ForeignKey("allocations.id"), nullable=False)
    requested_by = Column(Integer, ForeignKey("employees.id"), nullable=False)
    requested_to_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    requested_to_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(Enum(TransferStatus), default=TransferStatus.REQUESTED, nullable=False)
    approved_by = Column(Integer, ForeignKey("employees.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    allocation = relationship("Allocation")
    requester = relationship("Employee", foreign_keys=[requested_by])
    target_employee = relationship("Employee", foreign_keys=[requested_to_employee_id])
    target_department = relationship("Department", foreign_keys=[requested_to_department_id])
    approver = relationship("Employee", foreign_keys=[approved_by])
