"""Analytics API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.models.customer import Customer
from backend.models.lead import Lead


router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics."""
    # Customer stats
    total_customers = db.query(func.count(Customer.id)).scalar()
    active_customers = db.query(func.count(Customer.id)).filter(
        Customer.status == "active"
    ).scalar()

    # Lead stats
    total_leads = db.query(func.count(Lead.id)).scalar()
    leads_by_stage = db.query(
        Lead.stage,
        func.count(Lead.id).label("count")
    ).group_by(Lead.stage).all()

    # Lead value
    total_pipeline_value = db.query(func.sum(Lead.value)).scalar() or 0.0

    return {
        "customers": {
            "total": total_customers,
            "active": active_customers,
            "inactive": total_customers - active_customers
        },
        "leads": {
            "total": total_leads,
            "by_stage": {stage: count for stage, count in leads_by_stage},
            "pipeline_value": total_pipeline_value
        }
    }


@router.get("/leads/pipeline")
def get_pipeline_stats(db: Session = Depends(get_db)):
    """Get lead pipeline statistics."""
    stages = ["new", "contacted", "qualified", "proposal", "won", "lost"]
    pipeline = []

    for stage in stages:
        leads = db.query(Lead).filter(Lead.stage == stage).all()
        total_value = sum(lead.value for lead in leads)
        pipeline.append({
            "stage": stage,
            "count": len(leads),
            "value": total_value
        })

    return {"pipeline": pipeline}
