"""
GPS Log Model
Real-time location tracking
"""

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class GPSLog(BaseModel):
    """
    GPS location log model
    """
    __tablename__ = "gps_logs"
    
    # Driver reference
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Location
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float, nullable=True)
    
    # Speed and heading
    speed_kmh = Column(Float, nullable=True)
    heading_degrees = Column(Float, nullable=True)
    
    # Context
    is_moving = Column(Integer, default=1)  # 1=moving, 0=stationary
    activity_type = Column(String(50), nullable=True)  # driving/walking/idle
    
    # Timestamp
    recorded_at = Column(DateTime, nullable=False, index=True)
    
    # Relationships
    driver = relationship("Driver", back_populates="gps_logs")
    
    def __repr__(self):
        return f"<GPSLog(id={self.id}, driver_id={self.driver_id}, lat={self.latitude}, lon={self.longitude})>"
