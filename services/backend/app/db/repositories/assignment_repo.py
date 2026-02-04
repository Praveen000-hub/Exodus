"""
Assignment Repository
Data access for assignments
"""

from typing import Optional, List
from datetime import date, datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.assignment import Assignment
from app.db.repositories.base_repo import BaseRepository


class AssignmentRepository(BaseRepository[Assignment]):
    """
    Assignment-specific repository
    """
    
    def __init__(self, db: AsyncSession):
        super().__init__(Assignment, db)
    
    async def get_driver_assignments(
        self,
        driver_id: int,
        assignment_date: date = None
    ) -> List[Assignment]:
        """Get assignments for driver on specific date"""
        if assignment_date is None:
            assignment_date = date.today()
        
        result = await self.session.execute(
            select(Assignment).where(
                and_(
                    Assignment.driver_id == driver_id,
                    Assignment.assignment_date == assignment_date
                )
            )
        )
        return list(result.scalars().all())
    
    async def get_by_package(
        self,
        package_id: int,
        assignment_date: date = None
    ) -> Optional[Assignment]:
        """Get assignment for specific package"""
        if assignment_date is None:
            assignment_date = date.today()
        
        result = await self.session.execute(
            select(Assignment).where(
                and_(
                    Assignment.package_id == package_id,
                    Assignment.assignment_date == assignment_date
                )
            )
        )
        return result.scalar_one_or_none()
    
    async def get_history(
        self,
        driver_id: int,
        days: int = 7
    ) -> List[Assignment]:
        """Get assignment history for driver"""
        from datetime import timedelta
        start_date = date.today() - timedelta(days=days)
        
        result = await self.session.execute(
            select(Assignment).where(
                and_(
                    Assignment.driver_id == driver_id,
                    Assignment.assignment_date >= start_date
                )
            ).order_by(Assignment.assignment_date.desc())
        )
        return list(result.scalars().all())
    
    async def bulk_create(self, assignments: List[dict]) -> List[Assignment]:
        """Bulk create assignments"""
        instances = [Assignment(**data) for data in assignments]
        self.db.add_all(instances)
        await self.db.flush()
        for instance in instances:
            await self.db.refresh(instance)
        return instances
