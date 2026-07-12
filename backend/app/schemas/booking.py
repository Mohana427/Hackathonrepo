from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.booking import BookingStatus

class BookingCreate(BaseModel):
    asset_id: int
    start_time: datetime
    end_time: datetime

class BookingResponse(BaseModel):
    id: int
    asset_id: int
    booked_by: int
    start_time: datetime
    end_time: datetime
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True

class BookingConflictError(BaseModel):
    detail: str
    conflicting_range: str
