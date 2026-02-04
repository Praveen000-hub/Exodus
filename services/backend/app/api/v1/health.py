"""
Health Monitoring Endpoints
Innovations: 3 (Real-time Health), 6 (Break Recommendations)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_driver, get_model_loader
from app.schemas.health import (
    HealthUpdateRequest,
    HealthRiskResponse,
    BreakRecommendationResponse,
    HealthHistoryResponse
)
from app.services.health_service import HealthService
from app.ml.model_loader import ModelLoader
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/current", response_model=HealthRiskResponse)
async def get_current_health_status(
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    Get current health status and risk assessment
    
    **Innovation 3: Real-time Health Monitoring**
    
    Returns:
        HealthRiskResponse: Current health risk level and details
    """
    health_service = HealthService(db, model_loader)
    
    try:
        health_status = await health_service.get_current_health_risk(
            driver_id=current_driver.id
        )
        
        return health_status
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/update", status_code=status.HTTP_201_CREATED)
async def update_health_data(
    request: HealthUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Update driver's health vitals
    
    Args:
        request: Health vitals data
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        Success message
    """
    health_service = HealthService(db)
    
    try:
        await health_service.record_health_data(
            driver_id=current_driver.id,
            health_data=request.dict()
        )
        
        logger.info(f"Health data updated for driver {current_driver.id}")
        
        return {
            "success": True,
            "message": "Health data recorded successfully"
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/risk", response_model=HealthRiskResponse)
async def get_health_risk(
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 3: Real-Time Health Monitoring**
    
    Get current health risk score using Random Forest model
    
    Args:
        db: Database session
        model_loader: ML model loader
        current_driver: Current authenticated driver
    
    Returns:
        HealthRiskResponse: Risk score and severity level
    """
    health_service = HealthService(db)
    
    try:
        risk_score = await health_service.calculate_health_risk(
            driver_id=current_driver.id,
            model_loader=model_loader
        )
        
        # Determine severity level
        if risk_score < 40:
            severity = "low"
        elif risk_score < 60:
            severity = "medium"
        elif risk_score < 75:
            severity = "high"
        else:
            severity = "critical"
        
        logger.info(f"Health risk calculated for driver {current_driver.id}: {risk_score}")
        
        return HealthRiskResponse(
            driver_id=current_driver.id,
            risk_score=risk_score,
            severity=severity,
            recommendation="Continue working" if risk_score < 60 else "Consider taking a break"
        )
    
    except Exception as e:
        logger.error(f"Health risk calculation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not calculate health risk"
        )


@router.get("/break-recommendation", response_model=BreakRecommendationResponse)
async def get_break_recommendation(
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 6: Dynamic Break Recommendations**
    
    Get personalized break recommendation based on health + remaining difficulty
    
    Args:
        db: Database session
        model_loader: ML model loader
        current_driver: Current authenticated driver
    
    Returns:
        BreakRecommendationResponse: Break duration and timing
    """
    health_service = HealthService(db)
    
    try:
        recommendation = await health_service.get_break_recommendation(
            driver_id=current_driver.id,
            model_loader=model_loader
        )
        
        logger.info(f"Break recommendation for driver {current_driver.id}: {recommendation['duration']} min")
        
        return BreakRecommendationResponse(**recommendation)
    
    except Exception as e:
        logger.error(f"Break recommendation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate break recommendation"
        )


@router.get("/history", response_model=List[HealthHistoryResponse])
async def get_health_history(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Get health history for driver
    
    Args:
        days: Number of days to retrieve
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        List[HealthHistoryResponse]: Health event history
    """
    health_service = HealthService(db)
    
    history = await health_service.get_health_history(
        driver_id=current_driver.id,
        days=days
    )
    
    return [HealthHistoryResponse.from_orm(h) for h in history]
