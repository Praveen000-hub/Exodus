"""
Authentication Service
Handles login, registration, token management
"""

from typing import Dict
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.driver_repo import DriverRepository
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token
)
from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class AuthService:
    """Authentication service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.driver_repo = DriverRepository(db)
    
    async def login(self, identifier: str, password: str) -> Dict:
        """
        Login user with email/phone and password
        
        Args:
            identifier: Email or phone number
            password: Plain text password
        
        Returns:
            Dict: Access and refresh tokens
        
        Raises:
            ValueError: If credentials invalid
        """
        # Try email first
        driver = await self.driver_repo.get_by_email(identifier)
        
        # If not found, try phone
        if not driver:
            driver = await self.driver_repo.get_by_phone(identifier)
        
        if not driver:
            raise ValueError("Invalid credentials")
        
        # Verify password
        if not verify_password(password, driver.password_hash):
            raise ValueError("Invalid credentials")
        
        # Check if active
        if not driver.is_active:
            raise ValueError("Account is inactive")
        
        # Generate tokens
        access_token = create_access_token(
            data={"sub": driver.user_id}
        )
        refresh_token = create_refresh_token(
            data={"sub": driver.user_id}
        )
        
        logger.info(f"User logged in: {driver.email}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    
    async def register(
        self,
        name: str,
        email: str,
        phone: str,
        password: str,
        vehicle_type: str
    ) -> Dict:
        """
        Register new driver
        
        Args:
            name: Driver name
            email: Email address
            phone: Phone number
            password: Plain text password
            vehicle_type: Vehicle type
        
        Returns:
            Dict: Access and refresh tokens
        
        Raises:
            ValueError: If registration fails
        """
        # Check if email already exists
        existing = await self.driver_repo.get_by_email(email)
        if existing:
            raise ValueError("Email already registered")
        
        # Check if phone already exists
        existing = await self.driver_repo.get_by_phone(phone)
        if existing:
            raise ValueError("Phone number already registered")
        
        # Hash password
        password_hash = hash_password(password)
        
        # Generate user_id
        import random
        user_id = random.randint(100000, 999999)
        
        # Create driver
        driver = await self.driver_repo.create(
            user_id=user_id,
            name=name,
            email=email,
            phone=phone,
            password_hash=password_hash,
            vehicle_type=vehicle_type
        )
        
        # Generate tokens
        access_token = create_access_token(
            data={"sub": driver.user_id}
        )
        refresh_token = create_refresh_token(
            data={"sub": driver.user_id}
        )
        
        logger.info(f"New driver registered: {email}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    
    async def refresh_token(self, refresh_token: str) -> Dict:
        """
        Refresh access token
        
        Args:
            refresh_token: Valid refresh token
        
        Returns:
            Dict: New access and refresh tokens
        
        Raises:
            ValueError: If refresh token invalid
        """
        try:
            payload = decode_refresh_token(refresh_token)
            user_id = payload.get("sub")
            
            if not user_id:
                raise ValueError("Invalid refresh token")
            
            # Generate new tokens
            access_token = create_access_token(
                data={"sub": user_id}
            )
            new_refresh_token = create_refresh_token(
                data={"sub": user_id}
            )
            
            return {
                "access_token": access_token,
                "refresh_token": new_refresh_token,
                "token_type": "bearer",
                "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
        
        except Exception as e:
            raise ValueError(f"Invalid refresh token: {str(e)}")
