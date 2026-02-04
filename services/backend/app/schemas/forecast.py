"""
Forecast Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import date


class VolumeForecastResponse(BaseModel):
    """Volume forecast response (Innovation 2)"""
    date: str
    predicted_volume: int
    day_of_week: str
    confidence: float = Field(..., ge=0, le=1)


class EarningsForecastResponse(BaseModel):
    """Earnings forecast response (Innovation 7)"""
    forecast_period_days: int
    total_predicted_earnings: float
    average_daily_earnings: float
    daily_breakdown: List[Dict]
    weekly_breakdown: List[Dict]
    payment_per_package: float


class DemandHeatmapResponse(BaseModel):
    """Demand heatmap response"""
    target_date: str
    high_demand_zones: List[Dict]
    peak_hours: List[int]
    total_predicted_volume: int
