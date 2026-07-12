from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, RoleChecker, CurrentUser
from app.models.allocation import Allocation, TransferRequest, AllocationStatus, TransferStatus
from app.models.stubs import Asset, AssetStatus, Employee
from app.schemas.allocation import (
    AllocationCreate, AllocationResponse, TransferRequestCreate, 
    TransferRequestResponse, ReturnRequest, OverdueAllocationResponse
)

router = APIRouter(prefix="/allocations", tags=["Allocations"])

@router.post("", response_model=AllocationResponse)
def create_allocation(
    allocation: AllocationCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    if not allocation.employee_id and not allocation.department_id:
        raise HTTPException(status_code=400, detail="Must provide employee_id or department_id")

    asset = db.query(Asset).filter(Asset.id == allocation.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # HARD RULE: Check for active allocation
    active_allocation = db.query(Allocation).filter(
        Allocation.asset_id == allocation.asset_id,
        Allocation.status == AllocationStatus.ACTIVE
    ).first()

    if active_allocation:
        holder_name = "Unknown"
        if active_allocation.employee_id:
            emp = db.query(Employee).filter(Employee.id == active_allocation.employee_id).first()
            if emp: holder_name = emp.name
        elif active_allocation.department_id:
            holder_name = f"Department {active_allocation.department_id}"
            
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "detail": f"currently held by {holder_name}",
                "allocation_id": active_allocation.id,
                "holder_name": holder_name
            }
        )

    # Create new allocation
    new_allocation = Allocation(
        asset_id=allocation.asset_id,
        employee_id=allocation.employee_id,
        department_id=allocation.department_id,
        expected_return_date=allocation.expected_return_date
    )
    db.add(new_allocation)
    
    # Update asset status
    asset.status = AssetStatus.ALLOCATED
    
    db.commit()
    db.refresh(new_allocation)
    return new_allocation

@router.post("/transfer-requests", response_model=TransferRequestResponse)
def create_transfer_request(
    req: TransferRequestCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    # Verify allocation exists and is active
    allocation = db.query(Allocation).filter(
        Allocation.id == req.allocation_id,
        Allocation.status == AllocationStatus.ACTIVE
    ).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Active allocation not found")
        
    transfer_req = TransferRequest(
        allocation_id=req.allocation_id,
        requested_by=current_user.id,
        requested_to_employee_id=req.requested_to_employee_id,
        requested_to_department_id=req.requested_to_department_id
    )
    db.add(transfer_req)
    db.commit()
    db.refresh(transfer_req)
    return transfer_req

@router.patch("/transfer-requests/{id}/approve", response_model=TransferRequestResponse)
def approve_transfer_request(
    id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager", "Department Head"]))
):
    transfer = db.query(TransferRequest).filter(TransferRequest.id == id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer request not found")
    if transfer.status != TransferStatus.REQUESTED:
        raise HTTPException(status_code=400, detail="Transfer request already processed")
        
    old_allocation = db.query(Allocation).filter(Allocation.id == transfer.allocation_id).first()
    if not old_allocation or old_allocation.status != AllocationStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Original allocation is no longer active")

    now = datetime.utcnow()
    
    # Transaction starts explicitly in SQLAlchemy via session.begin_nested or just commit at end.
    try:
        # Close old allocation
        old_allocation.status = AllocationStatus.RETURNED
        old_allocation.actual_return_date = now
        
        # Create new allocation
        new_allocation = Allocation(
            asset_id=old_allocation.asset_id,
            employee_id=transfer.requested_to_employee_id,
            department_id=transfer.requested_to_department_id,
            allocated_date=now,
            expected_return_date=old_allocation.expected_return_date # preserve expected return date or leave None
        )
        db.add(new_allocation)
        
        # Update transfer request
        transfer.status = TransferStatus.APPROVED
        transfer.approved_by = current_user.id
        
        db.commit()
        db.refresh(transfer)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return transfer

@router.patch("/{id}/return", response_model=AllocationResponse)
def return_allocation(
    id: int,
    req: ReturnRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    allocation = db.query(Allocation).filter(Allocation.id == id).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")
    if allocation.status != AllocationStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Allocation is not active")
        
    asset = db.query(Asset).filter(Asset.id == allocation.asset_id).first()
    
    allocation.status = AllocationStatus.RETURNED
    allocation.actual_return_date = datetime.utcnow()
    allocation.condition_check_in_notes = req.condition_check_in_notes
    
    if asset:
        asset.status = AssetStatus.AVAILABLE
        
    db.commit()
    db.refresh(allocation)
    return allocation

@router.get("/overdue", response_model=List[OverdueAllocationResponse])
def get_overdue_allocations(
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    overdue_allocations = db.query(Allocation, Asset, Employee).outerjoin(
        Asset, Allocation.asset_id == Asset.id
    ).outerjoin(
        Employee, Allocation.employee_id == Employee.id
    ).filter(
        Allocation.status == AllocationStatus.ACTIVE,
        Allocation.expected_return_date != None,
        Allocation.expected_return_date < now
    ).all()
    
    result = []
    for alloc, asset, emp in overdue_allocations:
        holder_name = emp.name if emp else f"Dept {alloc.department_id}"
        days_overdue = (now - alloc.expected_return_date).days
        result.append(OverdueAllocationResponse(
            asset_tag=asset.tag if asset else "Unknown",
            holder_name=holder_name,
            days_overdue=days_overdue if days_overdue > 0 else 1 # at least 1 day overdue if condition matched
        ))
    return result

@router.get("/assets/{asset_id}/allocation-history", response_model=List[AllocationResponse])
def get_allocation_history(
    asset_id: int,
    db: Session = Depends(get_db)
):
    allocations = db.query(Allocation).filter(
        Allocation.asset_id == asset_id
    ).order_by(Allocation.allocated_date.desc()).all()
    return allocations

@router.get("/transfer-requests", response_model=List[TransferRequestResponse])
def get_transfer_requests(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(RoleChecker(["Asset Manager", "Department Head"]))
):
    requests = db.query(TransferRequest).filter(
        TransferRequest.status == TransferStatus.REQUESTED
    ).order_by(TransferRequest.created_at.desc()).all()
    return requests
