"""
Admin Repository
Database operations for admin users
"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models.admin import Admin
from app.db.repositories.base_repo import BaseRepository


class AdminRepository(BaseRepository[Admin]):
    """
    Admin-specific repository operations
    """
    
    def __init__(self, session: AsyncSession):
        super().__init__(Admin, session)
    
    async def get_by_email(self, email: str) -> Optional[Admin]:
        """
        Get admin by email
        
        Args:
            email: Admin email address
        
        Returns:
            Admin or None if not found
        """
        result = await self.session.execute(
            select(Admin).where(Admin.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[Admin]:
        """
        Get admin by username
        
        Args:
            username: Admin username
        
        Returns:
            Admin or None if not found
        """
        result = await self.session.execute(
            select(Admin).where(Admin.username == username)
        )
        return result.scalar_one_or_none()
