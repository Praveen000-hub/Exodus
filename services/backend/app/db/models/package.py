"""
Package Model
Packages to be delivered
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import BaseModel


class PackageStatus(str, enum.Enum):
    """Package status"""
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Package(BaseModel):
    """
    Package database model
    """
    __tablename__ = "packages"
    
    # Package details
    tracking_number = Column(String(100), unique=True, nullable=False, index=True)
    status = Column(Enum(PackageStatus), default=PackageStatus.PENDING, nullable=False, index=True)
    
    # Physical properties
    weight_kg = Column(Float, nullable=False)
    dimensions_cm = Column(String(50), nullable=True)  # Format: "LxWxH"
    is_fragile = Column(Boolean, default=False)
    
    # Delivery location
    delivery_address = Column(String(500), nullable=False)
    delivery_latitude = Column(Float, nullable=False)
    delivery_longitude = Column(Float, nullable=False)
    floor_number = Column(Integer, default=0)
    
    # Customer information
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    
    # Delivery time window
    delivery_window_start = Column(DateTime, nullable=True)
    delivery_window_end = Column(DateTime, nullable=True)
    
    # Priority
    is_priority = Column(Boolean, default=False)
    
    # Distance from hub (calculated)
    distance_from_hub_km = Column(Float, nullable=True)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="package", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Package(id={self.id}, tracking='{self.tracking_number}', status='{self.status}')>"
