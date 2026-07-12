from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, RoleChecker, CurrentUser
from app.models.maintenance import MaintenanceRequest, MaintenanceStatus
from app.models.stubs import Asset, AssetStatus
from app.schemas.maintenance import (
    MaintenanceRequestCreate, MaintenanceRequestResponse, AssignTechnicianRequest
)

router = APIRouter(prefix="/maintenance-requests", tags=["Maintenance"])

@router.post("", response_model=MaintenanceRequestResponse)
def create_maintenance_request(
    req: MaintenanceRequestCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == req.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    maint_req = MaintenanceRequest(
        asset_id=req.asset_id,
        raised_by=current_user.id,
        issue_description=req.issue_description,
        priority=req.priority,
        photo_url=req.photo_url,
        status=MaintenanceStatus.PENDING
    )
    db.add(maint_req)
    db.commit()
    db.refresh(maint_req)
    return maint_req

@router.patch("/{id}/approve", response_model=MaintenanceRequestResponse)
def approve_maintenance(
    id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    maint_req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == id).first()
    if not maint_req:
        raise HTTPException(status_code=404, detail="Request not found")
    if maint_req.status != MaintenanceStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request is not in pending state")
        
    asset = db.query(Asset).filter(Asset.id == maint_req.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    try:
        maint_req.status = MaintenanceStatus.APPROVED
        maint_req.approved_by = current_user.id
        asset.status = AssetStatus.UNDER_MAINTENANCE
        db.commit()
        db.refresh(maint_req)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed")
        
    return maint_req

@router.patch("/{id}/reject", response_model=MaintenanceRequestResponse)
def reject_maintenance(
    id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    maint_req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == id).first()
    if not maint_req:
        raise HTTPException(status_code=404, detail="Request not found")
    if maint_req.status != MaintenanceStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request is not in pending state")
        
    maint_req.status = MaintenanceStatus.REJECTED
    db.commit()
    db.refresh(maint_req)
    return maint_req

@router.patch("/{id}/assign-technician", response_model=MaintenanceRequestResponse)
def assign_technician(
    id: int,
    req: AssignTechnicianRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager"]))
):
    maint_req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == id).first()
    if not maint_req:
        raise HTTPException(status_code=404, detail="Request not found")
    if maint_req.status != MaintenanceStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Request must be approved before assigning a technician")
        
    maint_req.status = MaintenanceStatus.TECHNICIAN_ASSIGNED
    maint_req.technician_name = req.technician_name
    db.commit()
    db.refresh(maint_req)
    return maint_req

@router.patch("/{id}/resolve", response_model=MaintenanceRequestResponse)
def resolve_maintenance(
    id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager", "Technician"]))
):
    maint_req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == id).first()
    if not maint_req:
        raise HTTPException(status_code=404, detail="Request not found")
    if maint_req.status not in [MaintenanceStatus.TECHNICIAN_ASSIGNED, MaintenanceStatus.IN_PROGRESS]:
        raise HTTPException(status_code=400, detail="Request must be assigned to a technician before resolving")
        
    asset = db.query(Asset).filter(Asset.id == maint_req.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    try:
        maint_req.status = MaintenanceStatus.RESOLVED
        maint_req.resolved_at = datetime.utcnow()
        asset.status = AssetStatus.AVAILABLE
        db.commit()
        db.refresh(maint_req)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed")
        
    return maint_req

@router.get("/assets/{asset_id}/maintenance-history", response_model=List[MaintenanceRequestResponse])
def get_maintenance_history(
    asset_id: int,
    db: Session = Depends(get_db)
):
    history = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.asset_id == asset_id
    ).order_by(MaintenanceRequest.created_at.desc()).all()
    
    return history
