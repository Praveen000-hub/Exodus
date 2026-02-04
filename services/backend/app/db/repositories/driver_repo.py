"""
Driver Repository
Data access for drivers
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.driver import Driver
from app.db.repositories.base_repo import BaseRepository


class DriverRepository(BaseRepository[Driver]):
    """
    Driver-specific repository
    """
    
    def __init__(self, db: AsyncSession):
        super().__init__(Driver, db)
    
    async def get_by_email(self, email: str) -> Optional[Driver]:
        """Get driver by email"""
        result = await self.session.execute(
            select(Driver).where(Driver.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_phone(self, phone: str) -> Optional[Driver]:
        """Get driver by phone"""
        result = await self.session.execute(
            select(Driver).where(Driver.phone == phone)
        )
        return result.scalar_one_or_none()
    
    async def get_by_user_id(self, user_id: int) -> Optional[Driver]:
        """Get driver by user ID"""
        result = await self.session.execute(
            select(Driver).where(Driver.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_active_drivers(self) -> List[Driver]:
        """Get all active drivers"""
        result = await self.session.execute(
            select(Driver).where(Driver.is_active == True)
        )
        return list(result.scalars().all())
    
    async def update_location(
        self,
        driver_id: int,
        latitude: float,
        longitude: float
    ) -> Optional[Driver]:
        """Update driver's current location"""
        from datetime import datetime
        return await self.update(
            driver_id,
            current_latitude=latitude,
            current_longitude=longitude,
            last_location_update=datetime.utcnow()
        )
