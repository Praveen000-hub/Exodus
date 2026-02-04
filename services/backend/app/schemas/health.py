"""
Health Monitoring Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class HealthUpdateRequest(BaseModel):
    """Health data update request"""
    heart_rate_bpm: int = Field(..., ge=40, le=200)
    fatigue_level: int = Field(..., ge=1, le=10)
    hours_worked: float = Field(..., ge=0, le=24)
    hours_since_last_break: float = Field(..., ge=0, le=24)
    packages_delivered: int = Field(..., ge=0)
    packages_remaining: int = Field(..., ge=0)
    total_distance_km: float = Field(..., ge=0)


class HealthRiskResponse(BaseModel):
    """Health risk assessment response (Innovation 3)"""
    driver_id: int
    risk_score: float = Field(..., ge=0, le=100)
    severity: str = Field(..., pattern=r'^(low|medium|high|critical)$')
    recommendation: str


class BreakRecommendationResponse(BaseModel):
    """Break recommendation response (Innovation 6)"""
    should_break: bool
    duration_minutes: int
    urgency: str
    reason: str
    optimal_timing: Optional[str]
    health_risk_score: float


class HealthHistoryResponse(BaseModel):
    """Health event history"""
    id: int
    driver_id: int
    predicted_risk_score: float
    risk_severity: str
    break_recommended: Optional[int]
    recorded_at: datetime
    
    class Config:
        from_attributes = True
