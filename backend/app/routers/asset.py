from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, RoleChecker, CurrentUser
from app.models.stubs import Asset, AssetStatus, Employee, Department
from app.models.allocation import Allocation, AllocationStatus, TransferRequest, TransferStatus
from app.models.booking import Booking, BookingStatus
from app.models.maintenance import MaintenanceRequest, MaintenanceStatus
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, DashboardStats

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("", response_model=List[AssetResponse])
def list_assets(
    status_filter: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Asset)
    if status_filter:
        query = query.filter(Asset.status == status_filter)
    if search:
        query = query.filter(
            (Asset.name.ilike(f"%{search}%")) |
            (Asset.tag.ilike(f"%{search}%")) |
            (Asset.location.ilike(f"%{search}%"))
        )
    return query.order_by(Asset.id.desc()).all()


@router.post("", response_model=AssetResponse)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    existing = db.query(Asset).filter(Asset.tag == asset.tag).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset tag '{asset.tag}' already exists")

    new_asset = Asset(**asset.model_dump())
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.patch("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    update: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(asset, key, value)

    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    active_alloc = db.query(Allocation).filter(
        Allocation.asset_id == asset_id,
        Allocation.status == AllocationStatus.ACTIVE
    ).first()
    if active_alloc:
        raise HTTPException(status_code=400, detail="Cannot delete asset with active allocation")

    db.delete(asset)
    db.commit()
    return {"detail": "Asset deleted"}


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Asset).count()
    available = db.query(Asset).filter(Asset.status == AssetStatus.AVAILABLE).count()
    allocated = db.query(Asset).filter(Asset.status == AssetStatus.ALLOCATED).count()
    under_maint = db.query(Asset).filter(Asset.status == AssetStatus.UNDER_MAINTENANCE).count()

    pending_bookings = db.query(Booking).filter(
        Booking.status_stored.is_(None),
        Booking.end_time >= datetime.utcnow()
    ).count()

    pending_transfers = db.query(TransferRequest).filter(
        TransferRequest.status == TransferStatus.REQUESTED
    ).count()

    pending_maintenance = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.status.in_([
            MaintenanceStatus.PENDING,
            MaintenanceStatus.APPROVED,
            MaintenanceStatus.TECHNICIAN_ASSIGNED
        ])
    ).count()

    overdue = db.query(Allocation).filter(
        Allocation.status == AllocationStatus.ACTIVE,
        Allocation.expected_return_date != None,
        Allocation.expected_return_date < datetime.utcnow()
    ).count()

    return DashboardStats(
        total_assets=total,
        available=available,
        allocated=allocated,
        under_maintenance=under_maint,
        pending_bookings=pending_bookings,
        pending_transfers=pending_transfers,
        pending_maintenance=pending_maintenance,
        overdue_allocations=overdue
    )
