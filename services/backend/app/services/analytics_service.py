"""
Analytics Service
Business logic for admin analytics
"""

from typing import Dict
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.analytics_repo import AnalyticsRepository
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class AnalyticsService:
    """Analytics service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.analytics_repo = AnalyticsRepository(db)
    
    async def calculate_fairness_metrics(
        self,
        start_date: date,
        end_date: date
    ) -> Dict:
        """Calculate fairness algorithm metrics"""
        return await self.analytics_repo.get_fairness_metrics(
            start_date=start_date,
            end_date=end_date
        )
    
    async def get_performance_dashboard(self) -> Dict:
        """Get system performance dashboard"""
        from sqlalchemy import select, func
        from app.db.models.driver import Driver
        from app.db.models.delivery import Delivery
        from datetime import datetime, timedelta
        
        # Active drivers
        result = await self.db.execute(
            select(func.count(Driver.id)).where(Driver.is_active == True)
        )
        active_drivers = result.scalar()
        
        # Total drivers
        result = await self.db.execute(
            select(func.count(Driver.id))
        )
        total_drivers = result.scalar()
        
        # Today's deliveries
        today = datetime.utcnow().date()
        result = await self.db.execute(
            select(func.count(Delivery.id)).where(
                func.date(Delivery.completed_at) == today
            )
        )
        total_deliveries_today = result.scalar()
        
        # Success rate
        result = await self.db.execute(
            select(
                func.avg(Delivery.is_successful)
            ).where(
                func.date(Delivery.completed_at) == today
            )
        )
        success_rate = result.scalar() or 0.0
        
        # Average delivery time
        result = await self.db.execute(
            select(
                func.avg(Delivery.delivery_time_minutes)
            ).where(
                func.date(Delivery.completed_at) == today
            )
        )
        avg_delivery_time = result.scalar() or 0.0
        
        return {
            'total_drivers': total_drivers,
            'active_drivers': active_drivers,
            'total_deliveries_today': total_deliveries_today,
            'success_rate': float(success_rate),
            'avg_delivery_time': float(avg_delivery_time)
        }
    
    async def get_health_trends(self, days: int = 30) -> Dict:
        """Get health monitoring trends"""
        return await self.analytics_repo.get_health_trends(days=days)
