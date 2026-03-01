"""Lead model."""

from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from datetime import datetime
from backend.database import Base


class Lead(Base):
    """Lead database model."""

    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20))
    company = Column(String(100))
    stage = Column(String(20), default="new")  # new, contacted, qualified, proposal, won, lost
    value = Column(Float, default=0.0)
    source = Column(String(50))  # website, referral, advertising, etc.
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "company": self.company,
            "stage": self.stage,
            "value": self.value,
            "source": self.source,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
