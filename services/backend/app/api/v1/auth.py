"""
Authentication Endpoints
Login, Register, Token Refresh
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login endpoint for drivers
    
    Args:
        request: Login credentials (email/phone + password)
        db: Database session
    
    Returns:
        TokenResponse: Access and refresh tokens
    
    Raises:
        HTTPException: If credentials are invalid
    """
    auth_service = AuthService(db)
    
    try:
        tokens = await auth_service.login(
            identifier=request.identifier,
            password=request.password
        )
        
        logger.info(f"User logged in: {request.identifier}")
        return tokens
    
    except ValueError as e:
        logger.warning(f"Login failed for {request.identifier}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login endpoint for administrators
    
    Args:
        request: Login credentials (email/username + password)
        db: Database session
    
    Returns:
        TokenResponse: Access and refresh tokens with admin role
    
    Raises:
        HTTPException: If credentials are invalid or user is not admin
    """
    auth_service = AuthService(db)
    
    try:
        tokens = await auth_service.admin_login(
            identifier=request.identifier,
            password=request.password
        )
        
        logger.info(f"Admin logged in: {request.identifier}")
        return tokens
    
    except ValueError as e:
        logger.warning(f"Admin login failed for {request.identifier}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register new driver
    
    Args:
        request: Registration data
        db: Database session
    
    Returns:
        TokenResponse: Access and refresh tokens
    
    Raises:
        HTTPException: If registration fails
    """
    auth_service = AuthService(db)
    
    try:
        tokens = await auth_service.register(
            name=request.name,
            email=request.email,
            phone=request.phone,
            password=request.password,
            vehicle_type=request.vehicle_type
        )
        
        logger.info(f"New driver registered: {request.email}")
        return tokens
    
    except ValueError as e:
        logger.warning(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token
    
    Args:
        refresh_token: Valid refresh token
        db: Database session
    
    Returns:
        TokenResponse: New access and refresh tokens
    
    Raises:
        HTTPException: If refresh token is invalid
    """
    auth_service = AuthService(db)
    
    try:
        tokens = await auth_service.refresh_token(refresh_token)
        return tokens
    
    except ValueError as e:
        logger.warning(f"Token refresh failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
