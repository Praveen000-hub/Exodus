"""
Health Event Model
Health monitoring records (Innovation 3)
"""

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class HealthEvent(BaseModel):
    """
    Health monitoring event model
    """
    __tablename__ = "health_events"
    
    # Driver reference
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Health vitals
    heart_rate_bpm = Column(Integer, nullable=False)
    fatigue_level = Column(Integer, nullable=False)  # 1-10 scale
    hours_worked = Column(Float, nullable=False)
    hours_since_last_break = Column(Float, nullable=False)
    
    # Workload context
    packages_delivered = Column(Integer, nullable=False)
    packages_remaining = Column(Integer, nullable=False)
    total_distance_km = Column(Float, nullable=False)
    
    # Risk assessment (Innovation 3)
    predicted_risk_score = Column(Float, nullable=False)  # 0-100
    risk_severity = Column(String(20), nullable=False)  # low/medium/high/critical
    
    # Break recommendation (Innovation 6)
    break_recommended = Column(Integer, nullable=True)  # Minutes
    break_urgency = Column(String(20), nullable=True)  # none/low/medium/high/critical
    break_reason = Column(Text, nullable=True)
    
    # Action taken
    break_taken = Column(Integer, nullable=True)  # Actual break minutes
    intervention_notes = Column(Text, nullable=True)
    
    # Timestamp
    recorded_at = Column(DateTime, nullable=False, index=True)
    
    # Relationships
    driver = relationship("Driver", back_populates="health_events")
    
    def __repr__(self):
        return f"<HealthEvent(id={self.id}, driver_id={self.driver_id}, risk={self.predicted_risk_score})>"
