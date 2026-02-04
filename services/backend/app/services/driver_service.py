"""
Driver Service
Business logic for driver operations
"""

from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.driver_repo import DriverRepository
from app.db.models.driver import Driver
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class DriverService:
    """Driver service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.driver_repo = DriverRepository(db)
    
    async def get_driver(self, driver_id: int) -> Optional[Driver]:
        """Get driver by ID"""
        return await self.driver_repo.get_by_id(driver_id)
    
    async def update_driver(
        self,
        driver_id: int,
        update_data: Dict
    ) -> Driver:
        """Update driver profile"""
        driver = await self.driver_repo.update(driver_id, **update_data)
        
        if not driver:
            raise ValueError("Driver not found")
        
        logger.info(f"Driver updated: {driver_id}")
        
        return driver
    
    async def list_drivers(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[Driver]:
        """List drivers with pagination"""
        return await self.driver_repo.get_all(skip=skip, limit=limit)
