"""
Forecast Endpoints
Innovations: 2 (Workload Forecasting), 7 (Earnings Prediction)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta

from app.api.deps import get_db, get_current_driver, get_model_loader, get_redis
from app.schemas.forecast import (
    VolumeForecastResponse,
    EarningsForecastResponse,
    DemandHeatmapResponse
)
from app.services.forecast_service import ForecastService
from app.ml.model_loader import ModelLoader
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/volume", response_model=list[VolumeForecastResponse])
async def get_volume_forecast(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    redis = Depends(get_redis),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 2: Predictive Workload Forecasting**
    
    Get volume forecast for next N days using LSTM model
    
    Args:
        days: Number of days to forecast (default 30)
        db: Database session
        model_loader: ML model loader
        redis: Redis client
        current_driver: Current authenticated driver
    
    Returns:
        List[VolumeForecastResponse]: Daily volume predictions
    """
    forecast_service = ForecastService(db, redis)
    
    try:
        # Check cache first
        cached_forecast = await forecast_service.get_cached_forecast(days)
        if cached_forecast:
            logger.info(f"Returning cached forecast for {days} days")
            return cached_forecast
        
        # Generate new forecast
        forecast = await forecast_service.generate_volume_forecast(
            days=days,
            model_loader=model_loader
        )
        
        # Cache for 24 hours
        await forecast_service.cache_forecast(forecast, days)
        
        logger.info(f"Volume forecast generated for {days} days")
        
        return forecast
    
    except Exception as e:
        logger.error(f"Volume forecast failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate volume forecast"
        )


@router.get("/earnings", response_model=EarningsForecastResponse)
async def get_earnings_forecast(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    redis = Depends(get_redis),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 7: Earnings Prediction Dashboard**
    
    Get personalized earnings forecast for driver
    
    Args:
        days: Number of days to forecast
        db: Database session
        model_loader: ML model loader
        redis: Redis client
        current_driver: Current authenticated driver
    
    Returns:
        EarningsForecastResponse: Earnings predictions
    """
    forecast_service = ForecastService(db, redis)
    
    try:
        earnings = await forecast_service.calculate_earnings_forecast(
            driver_id=current_driver.id,
            days=days,
            model_loader=model_loader
        )
        
        logger.info(f"Earnings forecast generated for driver {current_driver.id}")
        
        return EarningsForecastResponse(**earnings)
    
    except Exception as e:
        logger.error(f"Earnings forecast failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate earnings forecast"
        )


@router.get("/demand-heatmap", response_model=DemandHeatmapResponse)
async def get_demand_heatmap(
    target_date: date = None,
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    Get demand heatmap for specific date
    Shows high-demand zones and times
    
    Args:
        target_date: Date for heatmap (default: tomorrow)
        db: Database session
        model_loader: ML model loader
        current_driver: Current authenticated driver
    
    Returns:
        DemandHeatmapResponse: Demand heatmap data
    """
    if target_date is None:
        target_date = date.today() + timedelta(days=1)
    
    forecast_service = ForecastService(db, None)
    
    try:
        heatmap = await forecast_service.generate_demand_heatmap(
            target_date=target_date,
            model_loader=model_loader
        )
        
        return DemandHeatmapResponse(**heatmap)
    
    except Exception as e:
        logger.error(f"Demand heatmap generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate demand heatmap"
        )
