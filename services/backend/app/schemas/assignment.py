"""
Assignment Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime, date


class AssignmentResponse(BaseModel):
    """Assignment response"""
    id: int
    driver_id: int
    package_id: int
    assignment_date: date
    predicted_difficulty: float
    is_accepted: bool
    is_completed: bool
    assigned_at: datetime
    
    class Config:
        from_attributes = True


class DifficultyPredictionRequest(BaseModel):
    """Difficulty prediction request (Innovation 1)"""
    package_id: int
    weight_kg: float = Field(..., gt=0, le=100)
    distance_km: float = Field(..., gt=0, le=100)
    floor_number: int = Field(..., ge=0, le=50)
    is_fragile: bool = False
    time_window_hours: int = Field(default=4, ge=1, le=12)


class DifficultyPredictionResponse(BaseModel):
    """Difficulty prediction response"""
    driver_id: int
    package_id: int
    difficulty_score: float = Field(..., ge=0, le=100)
    confidence: float = Field(..., ge=0, le=1)


class SHAPExplanationResponse(BaseModel):
    """SHAP explanation response (Innovation 5)"""
    predicted_difficulty: float
    base_difficulty: float
    feature_contributions: List[Dict]
    top_positive_factors: List[Dict]
    top_negative_factors: List[Dict]
    explanation_text: str
