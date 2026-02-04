"""
Driver Endpoints
CRUD operations for driver profiles
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_driver, get_pagination
from app.schemas.driver import DriverResponse, DriverUpdate
from app.services.driver_service import DriverService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/me", response_model=DriverResponse)
async def get_current_driver_profile(
    current_driver = Depends(get_current_driver)
):
    """
    Get current authenticated driver's profile
    
    Args:
        current_driver: Current authenticated driver
    
    Returns:
        DriverResponse: Driver profile data
    """
    return DriverResponse.from_orm(current_driver)


@router.get("/{driver_id}", response_model=DriverResponse)
async def get_driver_by_id(
    driver_id: int,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Get driver by ID (admin or self only)
    
    Args:
        driver_id: Driver ID
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        DriverResponse: Driver profile data
    
    Raises:
        HTTPException: If driver not found or unauthorized
    """
    # Drivers can only view their own profile
    if current_driver.id != driver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other driver profiles"
        )
    
    driver_service = DriverService(db)
    driver = await driver_service.get_driver(driver_id)
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    return DriverResponse.from_orm(driver)


@router.put("/me", response_model=DriverResponse)
async def update_driver_profile(
    request: DriverUpdate,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Update current driver's profile
    
    Args:
        request: Update data
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        DriverResponse: Updated driver profile
    
    Raises:
        HTTPException: If update fails
    """
    driver_service = DriverService(db)
    
    try:
        updated_driver = await driver_service.update_driver(
            driver_id=current_driver.id,
            update_data=request.dict(exclude_unset=True)
        )
        
        logger.info(f"Driver profile updated: {current_driver.id}")
        return DriverResponse.from_orm(updated_driver)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/", response_model=list[DriverResponse])
async def list_drivers(
    db: AsyncSession = Depends(get_db),
    pagination: dict = Depends(get_pagination),
    current_driver = Depends(get_current_driver)
):
    """
    List all drivers (limited to active drivers)
    
    Args:
        db: Database session
        pagination: Pagination params
        current_driver: Current authenticated driver
    
    Returns:
        List[DriverResponse]: List of drivers
    """
    driver_service = DriverService(db)
    drivers = await driver_service.list_drivers(
        skip=pagination["skip"],
        limit=pagination["limit"]
    )
    
    return [DriverResponse.from_orm(d) for d in drivers]
