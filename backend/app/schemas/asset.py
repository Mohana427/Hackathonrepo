from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.stubs import AssetStatus, AssetCondition


class AssetCreate(BaseModel):
    name: str
    tag: str
    category: str = "General"
    serial_number: Optional[str] = None
    location: str = "HQ"
    condition: AssetCondition = AssetCondition.GOOD
    is_bookable: bool = False
    acquisition_cost: Optional[float] = None
    acquisition_date: Optional[datetime] = None
    photo_url: Optional[str] = None


class AssetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    serial_number: Optional[str] = None
    location: Optional[str] = None
    condition: Optional[AssetCondition] = None
    is_bookable: Optional[bool] = None
    status: Optional[AssetStatus] = None
    acquisition_cost: Optional[float] = None
    photo_url: Optional[str] = None


class AssetResponse(BaseModel):
    id: int
    name: str
    tag: str
    category: str
    serial_number: Optional[str]
    location: str
    condition: AssetCondition
    is_bookable: bool
    status: AssetStatus
    acquisition_cost: Optional[float]
    acquisition_date: Optional[datetime]
    photo_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_assets: int
    available: int
    allocated: int
    under_maintenance: int
    pending_bookings: int
    pending_transfers: int
    pending_maintenance: int
    overdue_allocations: int
