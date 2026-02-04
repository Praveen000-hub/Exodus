"""
Driver Model
Represents delivery drivers in the system
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import BaseModel


class VehicleType(str, enum.Enum):
    """Vehicle types"""
    BIKE = "bike"
    SCOOTER = "scooter"
    CAR = "car"
    VAN = "van"


class Driver(BaseModel):
    """
    Driver database model
    """
    __tablename__ = "drivers"
    
    # Personal information
    user_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Vehicle information
    vehicle_type = Column(Enum(VehicleType), nullable=False)
    vehicle_number = Column(String(50), unique=True, nullable=True)
    vehicle_capacity_kg = Column(Float, default=50.0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    
    # Experience metrics
    experience_days = Column(Integer, default=0)
    total_deliveries = Column(Integer, default=0)
    successful_deliveries = Column(Integer, default=0)
    failed_deliveries = Column(Integer, default=0)
    
    # Performance metrics
    avg_delivery_time_minutes = Column(Float, default=30.0)
    success_rate = Column(Float, default=1.0)
    avg_rating = Column(Float, default=5.0)
    
    # Current location
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    
    # FCM token for push notifications
    fcm_token = Column(String(255), nullable=True)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="driver", cascade="all, delete-orphan")
    health_events = relationship("HealthEvent", back_populates="driver", cascade="all, delete-orphan")
    swaps_proposed = relationship("Swap", foreign_keys="Swap.proposer_id", back_populates="proposer")
    swaps_received = relationship("Swap", foreign_keys="Swap.acceptor_id", back_populates="acceptor")
    gps_logs = relationship("GPSLog", back_populates="driver", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Driver(id={self.id}, name='{self.name}', email='{self.email}')>"
    
    @property
    def full_name(self) -> str:
        return self.name
    
    @property
    def is_verified(self) -> bool:
        return self.vehicle_number is not None
