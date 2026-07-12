from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.allocation import AllocationStatus, TransferStatus

class AllocationCreate(BaseModel):
    asset_id: int
    employee_id: Optional[int] = None
    department_id: Optional[int] = None
    expected_return_date: Optional[datetime] = None

class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: Optional[int]
    department_id: Optional[int]
    allocated_date: datetime
    expected_return_date: Optional[datetime]
    actual_return_date: Optional[datetime]
    status: AllocationStatus
    condition_check_in_notes: Optional[str]

    class Config:
        from_attributes = True

class TransferRequestCreate(BaseModel):
    allocation_id: int
    requested_to_employee_id: Optional[int] = None
    requested_to_department_id: Optional[int] = None

class TransferRequestResponse(BaseModel):
    id: int
    allocation_id: int
    requested_by: int
    requested_to_employee_id: Optional[int]
    requested_to_department_id: Optional[int]
    status: TransferStatus
    approved_by: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class ReturnRequest(BaseModel):
    condition_check_in_notes: Optional[str] = None

class OverdueAllocationResponse(BaseModel):
    asset_tag: str
    holder_name: str
    days_overdue: int
