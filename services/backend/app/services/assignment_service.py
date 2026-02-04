"""
Assignment Service
Business logic for assignments (Innovations 1, 4, 5)
"""

from typing import List, Dict
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.db.repositories.assignment_repo import AssignmentRepository
from app.db.models.assignment import Assignment
from app.ml.model_loader import ModelLoader
from app.ml.xgboost_service import XGBoostService
from app.ml.shap_explainer import SHAPService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class AssignmentService:
    """Assignment service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.assignment_repo = AssignmentRepository(db)
    
    async def get_driver_assignments(
        self,
        driver_id: int,
        assignment_date: date = None
    ) -> List[Assignment]:
        """Get assignments for driver"""
        return await self.assignment_repo.get_driver_assignments(
            driver_id=driver_id,
            assignment_date=assignment_date
        )
    
    async def get_assignment(self, assignment_id: int) -> Assignment:
        """Get assignment by ID"""
        return await self.assignment_repo.get_by_id(assignment_id)
    
    async def predict_difficulty(
        self,
        driver_id: int,
        package_features: Dict,
        model_loader: ModelLoader
    ) -> float:
        """
        **INNOVATION 1: Predict difficulty for driver-package pair**
        """
        # Get driver features from database
        from app.db.repositories.driver_repo import DriverRepository
        driver_repo = DriverRepository(self.db)
        driver = await driver_repo.get_by_id(driver_id)
        
        if not driver:
            raise ValueError("Driver not found")
        
        driver_features = {
            'experience_days': driver.experience_days,
            'avg_delivery_time': driver.avg_delivery_time_minutes,
            'success_rate': driver.success_rate,
            'vehicle_capacity': driver.vehicle_capacity_kg
        }
        
        # Predict difficulty
        xgboost_service = XGBoostService(model_loader)
        difficulty = xgboost_service.predict_difficulty(
            driver_features=driver_features,
            package_features=package_features
        )
        
        return difficulty
    
    async def get_shap_explanation(
        self,
        assignment_id: int,
        model_loader: ModelLoader
    ) -> Dict:
        """
        **INNOVATION 5: Get SHAP explanation for assignment**
        """
        assignment = await self.assignment_repo.get_by_id(assignment_id)
        
        if not assignment:
            raise ValueError("Assignment not found")
        
        # Check if explanation already cached
        if assignment.shap_explanation_json:
            return json.loads(assignment.shap_explanation_json)
        
        # Generate new explanation
        from app.db.repositories.driver_repo import DriverRepository
        from app.db.models.package import Package
        from sqlalchemy import select
        
        driver_repo = DriverRepository(self.db)
        driver = await driver_repo.get_by_id(assignment.driver_id)
        
        result = await self.db.execute(
            select(Package).where(Package.id == assignment.package_id)
        )
        package = result.scalar_one_or_none()
        
        if not driver or not package:
            raise ValueError("Driver or package not found")
        
        driver_features = {
            'experience_days': driver.experience_days,
            'avg_delivery_time': driver.avg_delivery_time_minutes,
            'success_rate': driver.success_rate,
            'vehicle_capacity': driver.vehicle_capacity_kg
        }
        
        package_features = {
            'weight': package.weight_kg,
            'distance': package.distance_from_hub_km or 10.0,
            'floor_number': package.floor_number,
            'is_fragile': package.is_fragile,
            'time_window_hours': 4
        }
        
        # Generate SHAP explanation
        shap_service = SHAPService(model_loader)
        explanation = shap_service.explain_difficulty_prediction(
            driver_features=driver_features,
            package_features=package_features
        )
        
        # Cache explanation
        await self.assignment_repo.update(
            assignment_id,
            shap_explanation_json=json.dumps(explanation)
        )
        
        return explanation
    
    async def get_assignment_history(
        self,
        driver_id: int,
        days: int = 7
    ) -> List[Assignment]:
        """Get assignment history"""
        return await self.assignment_repo.get_history(driver_id, days)
