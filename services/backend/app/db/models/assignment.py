"""
Assignment Model
Daily package assignments for drivers
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class Assignment(BaseModel):
    """
    Daily package assignment model
    """
    __tablename__ = "assignments"
    
    # Assignment details
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    package_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_date = Column(Date, nullable=False, index=True)
    
    # Difficulty scoring (Innovation 1)
    predicted_difficulty = Column(Float, nullable=False)
    actual_difficulty = Column(Float, nullable=True)  # Filled after delivery
    
    # Assignment status
    is_accepted = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)
    is_failed = Column(Boolean, default=False)
    
    # Timing
    assigned_at = Column(DateTime, nullable=False)
    accepted_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # SHAP explanation (Innovation 5)
    shap_explanation_json = Column(String, nullable=True)  # JSON string
    
    # Relationships
    driver = relationship("Driver", back_populates="assignments")
    package = relationship("Package", back_populates="assignments")
    delivery = relationship("Delivery", back_populates="assignment", uselist=False)
    
    def __repr__(self):
        return f"<Assignment(id={self.id}, driver_id={self.driver_id}, package_id={self.package_id})>"
