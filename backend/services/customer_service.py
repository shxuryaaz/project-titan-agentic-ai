"""Customer service layer."""

from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models.customer import Customer


class CustomerService:
    """Business logic for customer operations."""

    @staticmethod
    def get_all_customers(db: Session, skip: int = 0, limit: int = 100) -> List[Customer]:
        """Get all customers with pagination."""
        return db.query(Customer).offset(skip).limit(limit).all()

    @staticmethod
    def get_customer_by_id(db: Session, customer_id: int) -> Optional[Customer]:
        """Get customer by ID."""
        return db.query(Customer).filter(Customer.id == customer_id).first()

    @staticmethod
    def get_customer_by_email(db: Session, email: str) -> Optional[Customer]:
        """Get customer by email."""
        return db.query(Customer).filter(Customer.email == email).first()

    @staticmethod
    def create_customer(
        db: Session,
        name: str,
        email: str,
        phone: Optional[str] = None,
        company: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Customer:
        """Create new customer."""
        customer = Customer(
            name=name,
            email=email,
            phone=phone,
            company=company,
            notes=notes
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: int,
        **kwargs
    ) -> Optional[Customer]:
        """Update customer."""
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            return None

        for key, value in kwargs.items():
            if hasattr(customer, key) and value is not None:
                setattr(customer, key, value)

        db.commit()
        db.refresh(customer)
        return customer

    @staticmethod
    def delete_customer(db: Session, customer_id: int) -> bool:
        """Delete customer."""
        customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            return False

        db.delete(customer)
        db.commit()
        return True

    @staticmethod
    def search_customers(db: Session, query: str) -> List[Customer]:
        """Search customers by name or email."""
        search = f"%{query}%"
        return db.query(Customer).filter(
            (Customer.name.ilike(search)) | (Customer.email.ilike(search))
        ).all()
