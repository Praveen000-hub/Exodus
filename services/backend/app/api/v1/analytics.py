"""
Analytics Endpoints (Admin Only)
System-wide analytics and metrics
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta

from app.api.deps import get_db, get_current_admin
from app.schemas.analytics import (
    FairnessMetricsResponse,
    PerformanceDashboardResponse,
    HealthTrendsResponse
)
from app.services.analytics_service import AnalyticsService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/fairness", response_model=FairnessMetricsResponse)
async def get_fairness_metrics(
    start_date: date = None,
    end_date: date = None,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """
    Get fairness algorithm metrics (admin only)
    Shows Gini coefficient, assignment distribution, variance
    
    Args:
        start_date: Start date for analysis
        end_date: End date for analysis
        db: Database session
        admin: Current admin user
    
    Returns:
        FairnessMetricsResponse: Fairness metrics
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=30)
    if end_date is None:
        end_date = date.today()
    
    analytics_service = AnalyticsService(db)
    
    metrics = await analytics_service.calculate_fairness_metrics(
        start_date=start_date,
        end_date=end_date
    )
    
    return FairnessMetricsResponse(**metrics)


@router.get("/performance", response_model=PerformanceDashboardResponse)
async def get_performance_dashboard(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """
    Get system performance dashboard (admin only)
    
    Args:
        db: Database session
        admin: Current admin user
    
    Returns:
        PerformanceDashboardResponse: Performance metrics
    """
    analytics_service = AnalyticsService(db)
    
    dashboard = await analytics_service.get_performance_dashboard()
    
    return PerformanceDashboardResponse(**dashboard)


@router.get("/health-trends", response_model=HealthTrendsResponse)
async def get_health_trends(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """
    Get health monitoring trends across all drivers (admin only)
    
    Args:
        days: Number of days to analyze
        db: Database session
        admin: Current admin user
    
    Returns:
        HealthTrendsResponse: Health trend data
    """
    analytics_service = AnalyticsService(db)
    
    trends = await analytics_service.get_health_trends(days=days)
    
    return HealthTrendsResponse(**trends)
