"""
Health Repository
Data access for health events
"""

from typing import List
from datetime import datetime, timedelta
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.health_event import HealthEvent
from app.db.repositories.base_repo import BaseRepository


class HealthRepository(BaseRepository[HealthEvent]):
    """
    Health event repository
    """
    
    def __init__(self, db: AsyncSession):
        super().__init__(HealthEvent, db)
    
    async def get_recent_events(
        self,
        driver_id: int,
        hours: int = 24
    ) -> List[HealthEvent]:
        """Get recent health events for driver"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        result = await self.session.execute(
            select(HealthEvent).where(
                and_(
                    HealthEvent.driver_id == driver_id,
                    HealthEvent.recorded_at >= cutoff_time
                )
            ).order_by(HealthEvent.recorded_at.desc())
        )
        return list(result.scalars().all())
    
    async def get_latest_event(self, driver_id: int) -> HealthEvent:
        """Get most recent health event"""
        result = await self.session.execute(
            select(HealthEvent).where(
                HealthEvent.driver_id == driver_id
            ).order_by(HealthEvent.recorded_at.desc()).limit(1)
        )
        return result.scalar_one_or_none()
    
    async def get_high_risk_drivers(self, threshold: float = 75.0) -> List[int]:
        """Get driver IDs with recent high risk scores"""
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        
        result = await self.session.execute(
            select(HealthEvent.driver_id.distinct()).where(
                and_(
                    HealthEvent.predicted_risk_score >= threshold,
                    HealthEvent.recorded_at >= cutoff_time
                )
            )
        )
        return list(result.scalars().all())
