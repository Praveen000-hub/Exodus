"""
Analytics Schemas
"""

from pydantic import BaseModel
from typing import List, Dict


class FairnessMetricsResponse(BaseModel):
    """Fairness metrics response"""
    gini_coefficient: float
    driver_count: int
    avg_packages_per_driver: float
    min_packages: int
    max_packages: int


class PerformanceDashboardResponse(BaseModel):
    """Performance dashboard response"""
    total_drivers: int
    active_drivers: int
    total_deliveries_today: int
    success_rate: float
    avg_delivery_time: float


class HealthTrendsResponse(BaseModel):
    """Health trends response"""
    average_risk_score: float
    total_health_checks: int
    critical_events: int
    period_days: int
