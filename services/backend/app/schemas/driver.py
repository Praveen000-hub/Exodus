"""
Driver Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class DriverResponse(BaseModel):
    """Driver profile response"""
    id: int
    name: str
    email: EmailStr
    phone: str
    vehicle_type: str
    vehicle_number: Optional[str]
    is_active: bool
    experience_days: int
    total_deliveries: int
    success_rate: float
    avg_rating: float
    created_at: datetime
    
    class Config:
        from_attributes = True


class DriverUpdate(BaseModel):
    """Driver profile update"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = Field(None, pattern=r'^\+?[1-9]\d{9,14}$')
    vehicle_number: Optional[str] = None
    fcm_token: Optional[str] = None
