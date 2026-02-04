"""
Delivery Model
Delivery tracking and completion records
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class Delivery(BaseModel):
    """
    Delivery tracking model
    """
    __tablename__ = "deliveries"
    
    # Reference to assignment
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Delivery status
    is_successful = Column(Boolean, nullable=False)
    
    # Timing
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=False)
    delivery_time_minutes = Column(Float, nullable=False)
    
    # Actual metrics
    actual_distance_km = Column(Float, nullable=True)
    actual_difficulty = Column(Float, nullable=True)
    
    # Customer feedback
    customer_rating = Column(Integer, nullable=True)  # 1-5
    customer_feedback = Column(Text, nullable=True)
    
    # Failure information (if applicable)
    failure_reason = Column(String(255), nullable=True)
    failure_notes = Column(Text, nullable=True)
    
    # Proof of delivery
    signature_image_url = Column(String(500), nullable=True)
    delivery_photo_url = Column(String(500), nullable=True)
    
    # Relationships
    assignment = relationship("Assignment", back_populates="delivery")
    
    def __repr__(self):
        return f"<Delivery(id={self.id}, assignment_id={self.assignment_id}, successful={self.is_successful})>"
