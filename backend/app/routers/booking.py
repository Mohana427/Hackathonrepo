from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, CurrentUser
from app.models.booking import Booking, BookingStatus
from app.models.stubs import Asset, AssetStatus
from app.schemas.booking import BookingCreate, BookingResponse, BookingConflictError
from app.utils.overlap import ranges_overlap

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    # Check if asset exists and is bookable
    asset = db.query(Asset).filter(Asset.id == booking.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if not asset.is_bookable:
        raise HTTPException(status_code=400, detail="Asset is not bookable")
        
    # Check for overlapping bookings
    existing_bookings = db.query(Booking).filter(
        Booking.asset_id == booking.asset_id,
        Booking.status_stored.is_(None) # None implies it's not CANCELLED. We filter derived states next.
    ).all()
    
    for b in existing_bookings:
        # Check computed status to see if it's upcoming or ongoing
        comp_status = b.computed_status
        if comp_status in [BookingStatus.UPCOMING, BookingStatus.ONGOING]:
            if ranges_overlap(booking.start_time, booking.end_time, b.start_time, b.end_time):
                # We found an overlap. Return 409.
                conflicting_range = f"{b.start_time.isoformat()} to {b.end_time.isoformat()}"
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={
                        "detail": "Booking time overlaps with an existing booking.",
                        "conflicting_range": conflicting_range
                    }
                )

    new_booking = Booking(
        asset_id=booking.asset_id,
        booked_by=current_user.id,
        start_time=booking.start_time,
        end_time=booking.end_time
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # We map the SQLAlchemy model property computed_status to status on the Pydantic schema
    resp_dict = new_booking.__dict__.copy()
    resp_dict['status'] = new_booking.computed_status
    return BookingResponse(**resp_dict)

@router.get("", response_model=List[BookingResponse])
def get_bookings(
    asset_id: int,
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(Booking.asset_id == asset_id).all()
    
    result = []
    for b in bookings:
        resp_dict = b.__dict__.copy()
        resp_dict['status'] = b.computed_status
        result.append(BookingResponse(**resp_dict))
    
    return result

@router.patch("/{id}/cancel", response_model=BookingResponse)
def cancel_booking(
    id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    if booking.booked_by != current_user.id and current_user.role not in ["Asset Manager", "Department Head"]:
         raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    booking.status_stored = BookingStatus.CANCELLED.value
    db.commit()
    db.refresh(booking)
    
    resp_dict = booking.__dict__.copy()
    resp_dict['status'] = booking.computed_status
    return BookingResponse(**resp_dict)
