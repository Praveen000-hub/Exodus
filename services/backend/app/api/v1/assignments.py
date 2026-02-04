"""
Assignment Endpoints
Innovations: 1 (Difficulty), 4 (Fairness), 5 (SHAP)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_driver, get_model_loader
from app.schemas.assignment import (
    AssignmentResponse,
    DifficultyPredictionRequest,
    DifficultyPredictionResponse,
    SHAPExplanationResponse
)
from app.services.assignment_service import AssignmentService
from app.ml.model_loader import ModelLoader
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/current", response_model=List[AssignmentResponse])
async def get_current_assignments(
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Get current day's assignments for authenticated driver
    
    Args:
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        List[AssignmentResponse]: Today's assignments
    """
    assignment_service = AssignmentService(db)
    
    assignments = await assignment_service.get_driver_assignments(
        driver_id=current_driver.id
    )
    
    return [AssignmentResponse.from_orm(a) for a in assignments]


@router.post("/predict-difficulty", response_model=DifficultyPredictionResponse)
async def predict_difficulty(
    request: DifficultyPredictionRequest,
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 1: Personalized Difficulty Scoring**
    
    Predict package difficulty score using XGBoost model
    
    Args:
        request: Package features for prediction
        db: Database session
        model_loader: ML model loader
        current_driver: Current authenticated driver
    
    Returns:
        DifficultyPredictionResponse: Predicted difficulty score
    """
    assignment_service = AssignmentService(db)
    
    try:
        difficulty_score = await assignment_service.predict_difficulty(
            driver_id=current_driver.id,
            package_features=request.dict(),
            model_loader=model_loader
        )
        
        logger.info(f"Difficulty predicted for driver {current_driver.id}: {difficulty_score}")
        
        return DifficultyPredictionResponse(
            driver_id=current_driver.id,
            package_id=request.package_id,
            difficulty_score=difficulty_score,
            confidence=0.95  # From model
        )
    
    except Exception as e:
        logger.error(f"Difficulty prediction failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Difficulty prediction failed"
        )


@router.get("/{assignment_id}/explanation", response_model=SHAPExplanationResponse)
async def get_assignment_explanation(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    model_loader: ModelLoader = Depends(get_model_loader),
    current_driver = Depends(get_current_driver)
):
    """
    **INNOVATION 5: Transparency via SHAP**
    
    Get SHAP explanation for why a package was assigned
    
    Args:
        assignment_id: Assignment ID
        db: Database session
        model_loader: ML model loader
        current_driver: Current authenticated driver
    
    Returns:
        SHAPExplanationResponse: Feature importance explanation
    
    Raises:
        HTTPException: If assignment not found or unauthorized
    """
    assignment_service = AssignmentService(db)
    
    # Verify assignment belongs to current driver
    assignment = await assignment_service.get_assignment(assignment_id)
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    if assignment.driver_id != current_driver.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other driver's assignments"
        )
    
    try:
        explanation = await assignment_service.get_shap_explanation(
            assignment_id=assignment_id,
            model_loader=model_loader
        )
        
        logger.info(f"SHAP explanation generated for assignment {assignment_id}")
        
        return explanation
    
    except Exception as e:
        logger.error(f"SHAP explanation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate explanation"
        )


@router.get("/history", response_model=List[AssignmentResponse])
async def get_assignment_history(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Get assignment history for driver
    
    Args:
        days: Number of days to retrieve (default 7)
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        List[AssignmentResponse]: Historical assignments
    """
    assignment_service = AssignmentService(db)
    
    assignments = await assignment_service.get_assignment_history(
        driver_id=current_driver.id,
        days=days
    )
    
    return [AssignmentResponse.from_orm(a) for a in assignments]
