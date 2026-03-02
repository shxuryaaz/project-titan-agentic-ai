"""Customer API endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from backend.database import get_db
from backend.services.customer_service import CustomerService


router = APIRouter(prefix="/api/customers", tags=["customers"])


class CustomerCreate(BaseModel):
    """Schema for creating customer."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    """Schema for updating customer."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


@router.get("/")
def list_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get list of customers."""
    customers = CustomerService.get_all_customers(db, skip=skip, limit=limit)
    return {"customers": [c.to_dict() for c in customers]}


@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get customer by ID."""
    customer = CustomerService.get_customer_by_id(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.to_dict()


@router.post("/")
def create_customer(customer_data: CustomerCreate, db: Session = Depends(get_db)):
    """Create new customer."""
    # Check if email already exists
    existing = CustomerService.get_customer_by_email(db, customer_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    customer = CustomerService.create_customer(
        db,
        name=customer_data.name,
        email=customer_data.email,
        phone=customer_data.phone,
        company=customer_data.company,
        notes=customer_data.notes
    )
    return customer.to_dict()


@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db)
):
    """Update customer."""
    updates = customer_data.model_dump(exclude_unset=True)
    customer = CustomerService.update_customer(db, customer_id, **updates)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.to_dict()


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Delete customer."""
    success = CustomerService.delete_customer(db, customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}


@router.get("/search/")
def search_customers(q: str, db: Session = Depends(get_db)):
    """Search customers."""
    customers = CustomerService.search_customers(db, q)
    return {"customers": [c.to_dict() for c in customers]}


@router.get("/export")
def export_customers(db: Session = Depends(get_db)):
    """Export list of customers to CSV."""
    customers = CustomerService.get_all_customers(db)
    csv_content = "Name,Email,Phone,Company,Notes\n"
    for customer in customers:
        csv_content += f"{customer.name},{customer.email},{customer.phone or ''},{customer.company or ''},{customer.notes or ''}\n"
    headers = {
        "Content-Disposition": "attachment; filename=customers.csv"
    }
    return Response(content=csv_content, media_type="text/csv", headers=headers)