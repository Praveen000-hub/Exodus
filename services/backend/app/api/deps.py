"""
API Dependencies
Reusable dependencies for FastAPI route handlers
"""

from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError

from app.config import settings
from app.db.session import async_session_maker
from app.db.repositories.driver_repo import DriverRepository
from app.core.security import decode_access_token
from app.utils.redis import get_redis_client
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

# Security scheme
security = HTTPBearer()


# ============================================
# DATABASE SESSION
# ============================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database session
    
    Yields:
        AsyncSession: Database session with automatic commit/rollback
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {str(e)}")
            raise
        finally:
            await session.close()


# ============================================
# REDIS CLIENT
# ============================================

async def get_redis():
    """
    Dependency for getting Redis client
    
    Returns:
        Redis client instance (None if Redis unavailable)
    """
    try:
        return await get_redis_client()
    except Exception:
        # Return None if Redis not available - services should handle this
        return None


# ============================================
# ML MODEL LOADER
# ============================================

async def get_model_loader():
    """
    Dependency for getting ML model loader singleton
    
    Returns:
        ModelLoader: Singleton instance with all ML models (may use fallbacks)
    """
    from app.main import app
    
    if not hasattr(app.state, 'model_loader'):
        # Return a new ModelLoader instance if not in app state
        from app.ml.model_loader import ModelLoader
        return ModelLoader()
    
    return app.state.model_loader


# ============================================
# AUTHENTICATION
# ============================================

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> int:
    """
    Extract and validate user ID from JWT token
    
    Args:
        credentials: JWT credentials from Authorization header
    
    Returns:
        int: Authenticated user ID
    
    Raises:
        HTTPException: If token is invalid, expired, or missing
    """
    try:
        token = credentials.credentials
        payload = decode_access_token(token)
        
        user_id: Optional[int] = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return int(user_id)
    
    except JWTError as e:
        logger.error(f"JWT validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    except ValueError as e:
        logger.error(f"Invalid user ID format: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_driver(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated driver from database
    
    Args:
        user_id: User ID from JWT token
        db: Database session
    
    Returns:
        Driver: Driver database model
    
    Raises:
        HTTPException: If driver not found or inactive
    """
    driver_repo = DriverRepository(db)
    driver = await driver_repo.get_by_user_id(user_id)
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver profile not found"
        )
    
    if not driver.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Driver account is inactive"
        )
    
    return driver


async def get_current_admin(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated admin user
    Validates admin role from database
    
    Args:
        user_id: User ID from JWT token
        db: Database session
    
    Returns:
        Admin: Admin user model
    
    Raises:
        HTTPException: If user is not admin or not found
    """
    from app.db.repositories.admin_repo import AdminRepository
    
    admin_repo = AdminRepository(db)
    admin = await admin_repo.get_by_user_id(user_id)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )
    
    return admin


# ============================================
# PAGINATION
# ============================================

async def get_pagination(
    skip: int = 0,
    limit: int = 100
) -> dict:
    """
    Get pagination parameters with validation
    
    Args:
        skip: Number of records to skip (offset)
        limit: Maximum number of records to return
    
    Returns:
        dict: Validated pagination parameters
    """
    # Validate and clamp values
    skip = max(0, skip)  # Cannot be negative
    limit = max(1, min(limit, 1000))  # Between 1 and 1000
    
    return {
        "skip": skip,
        "limit": limit
    }


# ============================================
# OPTIONAL API KEY (Additional Security Layer)
# ============================================

async def verify_api_key(
    x_api_key: Optional[str] = Header(None)
) -> bool:
    """
    Verify optional API key from header
    Used for additional security in production
    
    Args:
        x_api_key: API key from X-API-Key header
    
    Returns:
        bool: True if valid or not required
    
    Raises:
        HTTPException: If API key is required but invalid
    """
    # Skip API key validation in development
    if settings.is_development:
        return True
    
    # In production, optionally require API key
    if hasattr(settings, 'REQUIRE_API_KEY') and settings.REQUIRE_API_KEY:
        if not x_api_key or x_api_key != settings.API_KEY:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid or missing API key"
            )
    
    return True
