from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.maintenance import MaintenancePriority, MaintenanceStatus

class MaintenanceRequestCreate(BaseModel):
    asset_id: int
    issue_description: str
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    photo_url: Optional[str] = None

class MaintenanceRequestResponse(BaseModel):
    id: int
    asset_id: int
    raised_by: int
    issue_description: str
    priority: MaintenancePriority
    photo_url: Optional[str]
    status: MaintenanceStatus
    technician_name: Optional[str]
    approved_by: Optional[int]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True

class AssignTechnicianRequest(BaseModel):
    technician_name: str
