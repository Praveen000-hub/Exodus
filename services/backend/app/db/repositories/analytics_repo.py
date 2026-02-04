"""
Analytics Repository
Data access for analytics queries
"""

from typing import List, Dict
from datetime import date, timedelta
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.driver import Driver
from app.db.models.assignment import Assignment
from app.db.models.health_event import HealthEvent
from app.db.models.delivery import Delivery


class AnalyticsRepository:
    """
    Analytics-specific repository
    """
    
    def __init__(self, db: AsyncSession):
        self.session = db
    
    async def get_fairness_metrics(
        self,
        start_date: date,
        end_date: date
    ) -> Dict:
        """Calculate fairness metrics for date range"""
        # Get assignment distribution
        result = await self.session.execute(
            select(
                Assignment.driver_id,
                func.count(Assignment.id).label('package_count'),
                func.avg(Assignment.predicted_difficulty).label('avg_difficulty')
            ).where(
                and_(
                    Assignment.assignment_date >= start_date,
                    Assignment.assignment_date <= end_date
                )
            ).group_by(Assignment.driver_id)
        )
        
        distribution = result.all()
        
        # Calculate Gini coefficient
        package_counts = [d.package_count for d in distribution]
        gini = self._calculate_gini(package_counts)
        
        return {
            'gini_coefficient': gini,
            'driver_count': len(distribution),
            'avg_packages_per_driver': sum(package_counts) / len(package_counts) if package_counts else 0,
            'min_packages': min(package_counts) if package_counts else 0,
            'max_packages': max(package_counts) if package_counts else 0
        }
    
    async def get_health_trends(self, days: int = 30) -> Dict:
        """Get health monitoring trends"""
        cutoff_date = date.today() - timedelta(days=days)
        
        result = await self.session.execute(
            select(
                func.avg(HealthEvent.predicted_risk_score).label('avg_risk'),
                func.count(HealthEvent.id).label('total_events'),
                func.sum(
                    func.case((HealthEvent.predicted_risk_score >= 75, 1), else_=0)
                ).label('critical_events')
            ).where(
                HealthEvent.recorded_at >= cutoff_date
            )
        )
        
        stats = result.one()
        
        return {
            'average_risk_score': float(stats.avg_risk) if stats.avg_risk else 0,
            'total_health_checks': stats.total_events,
            'critical_events': stats.critical_events,
            'period_days': days
        }
    
    def _calculate_gini(self, values: List[float]) -> float:
        """Calculate Gini coefficient"""
        if not values:
            return 0.0
        
        sorted_values = sorted(values)
        n = len(sorted_values)
        cumsum = sum((i + 1) * val for i, val in enumerate(sorted_values))
        total = sum(sorted_values)
        
        return (2 * cumsum) / (n * total) - (n + 1) / n if total > 0 else 0.0
