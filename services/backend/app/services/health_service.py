"""
Health Service
Business logic for health monitoring (Innovations 3, 6)
"""

from typing import Dict, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.health_repo import HealthRepository
from app.db.models.health_event import HealthEvent
from app.ml.model_loader import ModelLoader
from app.ml.health_predictor import HealthPredictionService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class HealthService:
    """Health monitoring service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.health_repo = HealthRepository(db)
    
    async def record_health_data(
        self,
        driver_id: int,
        health_data: Dict
    ):
        """Record health vitals"""
        # Create health event
        await self.health_repo.create(
            driver_id=driver_id,
            heart_rate_bpm=health_data['heart_rate_bpm'],
            fatigue_level=health_data['fatigue_level'],
            hours_worked=health_data['hours_worked'],
            hours_since_last_break=health_data['hours_since_last_break'],
            packages_delivered=health_data['packages_delivered'],
            packages_remaining=health_data['packages_remaining'],
            total_distance_km=health_data['total_distance_km'],
            predicted_risk_score=0,  # Will be calculated
            risk_severity='low',
            recorded_at=datetime.utcnow()
        )
    
    async def calculate_health_risk(
        self,
        driver_id: int,
        model_loader: ModelLoader
    ) -> float:
        """
        **INNOVATION 3: Calculate health risk score**
        """
        # Get latest health event
        latest_event = await self.health_repo.get_latest_event(driver_id)
        
        if not latest_event:
            raise ValueError("No health data available")
        
        health_vitals = {
            'heart_rate': latest_event.heart_rate_bpm,
            'fatigue_level': latest_event.fatigue_level,
            'hours_worked': latest_event.hours_worked,
            'last_break_hours_ago': latest_event.hours_since_last_break
        }
        
        workload_features = {
            'packages_delivered': latest_event.packages_delivered,
            'packages_remaining': latest_event.packages_remaining,
            'total_distance_km': latest_event.total_distance_km,
            'avg_package_difficulty': 50.0
        }
        
        # Predict risk
        health_service = HealthPredictionService(model_loader)
        risk_score = health_service.predict_health_risk(
            health_vitals=health_vitals,
            workload_features=workload_features
        )
        
        # Update event with risk score
        await self.health_repo.update(
            latest_event.id,
            predicted_risk_score=risk_score
        )
        
        return risk_score
    
    async def get_break_recommendation(
        self,
        driver_id: int,
        model_loader: ModelLoader
    ) -> Dict:
        """
        **INNOVATION 6: Get break recommendation**
        """
        # Calculate current risk
        risk_score = await self.calculate_health_risk(driver_id, model_loader)
        
        # Get latest health event
        latest_event = await self.health_repo.get_latest_event(driver_id)
        
        remaining_difficulty = latest_event.packages_remaining * 50.0
        
        # Get recommendation
        health_service = HealthPredictionService(model_loader)
        recommendation = health_service.recommend_break_duration(
            health_risk=risk_score,
            remaining_difficulty=remaining_difficulty,
            hours_worked=latest_event.hours_worked
        )
        
        # Update health event
        if recommendation['should_break']:
            await self.health_repo.update(
                latest_event.id,
                break_recommended=recommendation['duration_minutes'],
                break_urgency=recommendation['urgency'],
                break_reason=recommendation['reason']
            )
        
        return {
            'driver_id': driver_id,
            **recommendation
        }
    
    async def get_health_history(
        self,
        driver_id: int,
        days: int = 7
    ) -> List[HealthEvent]:
        """Get health history"""
        return await self.health_repo.get_recent_events(
            driver_id=driver_id,
            hours=days * 24
        )
