"""Lead API endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from backend.database import get_db
from backend.models.lead import Lead


router = APIRouter(prefix="/api/leads", tags=["leads"])


class LeadCreate(BaseModel):
    """Schema for creating lead."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    value: float = 0.0
    source: Optional[str] = None
    notes: Optional[str] = None


class LeadUpdate(BaseModel):
    """Schema for updating lead."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    stage: Optional[str] = None
    value: Optional[float] = None
    source: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def list_leads(
    skip: int = 0,
    limit: int = 100,
    stage: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of leads."""
    query = db.query(Lead)
    if stage:
        query = query.filter(Lead.stage == stage)
    leads = query.offset(skip).limit(limit).all()
    return {"leads": [lead.to_dict() for lead in leads]}


@router.get("/{lead_id}")
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get lead by ID."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead.to_dict()


@router.post("/")
def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """Create new lead."""
    lead = Lead(**lead_data.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead.to_dict()


@router.put("/{lead_id}")
def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db)
):
    """Update lead."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    updates = lead_data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)
    return lead.to_dict()


@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete lead."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}
