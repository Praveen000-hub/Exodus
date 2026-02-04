"""
Swap Marketplace Endpoints
Peer-to-peer package swapping
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_driver
from app.schemas.swap import (
    SwapProposalRequest,
    SwapResponse,
    SwapAcceptRequest
)
from app.services.swap_service import SwapService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/available", response_model=List[SwapResponse])
async def get_available_swaps(
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Get available swap proposals for current driver
    
    Args:
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        List[SwapResponse]: Available swaps
    """
    swap_service = SwapService(db)
    
    swaps = await swap_service.get_available_swaps(
        driver_id=current_driver.id
    )
    
    return [SwapResponse.from_orm(s) for s in swaps]


@router.post("/propose", response_model=SwapResponse, status_code=status.HTTP_201_CREATED)
async def propose_swap(
    request: SwapProposalRequest,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Propose a package swap
    
    Args:
        request: Swap proposal data
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        SwapResponse: Created swap proposal
    
    Raises:
        HTTPException: If swap cannot be proposed
    """
    swap_service = SwapService(db)
    
    try:
        swap = await swap_service.propose_swap(
            proposer_id=current_driver.id,
            offered_package_id=request.offered_package_id,
            requested_package_id=request.requested_package_id,
            reason=request.reason
        )
        
        logger.info(f"Swap proposed by driver {current_driver.id}")
        
        return SwapResponse.from_orm(swap)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{swap_id}/accept", response_model=SwapResponse)
async def accept_swap(
    swap_id: int,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Accept a swap proposal
    
    Args:
        swap_id: Swap proposal ID
        db: Database session
        current_driver: Current authenticated driver
    
    Returns:
        SwapResponse: Updated swap with accepted status
    
    Raises:
        HTTPException: If swap cannot be accepted
    """
    swap_service = SwapService(db)
    
    try:
        swap = await swap_service.accept_swap(
            swap_id=swap_id,
            acceptor_id=current_driver.id
        )
        
        logger.info(f"Swap {swap_id} accepted by driver {current_driver.id}")
        
        return SwapResponse.from_orm(swap)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{swap_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_swap(
    swap_id: int,
    db: AsyncSession = Depends(get_db),
    current_driver = Depends(get_current_driver)
):
    """
    Cancel a swap proposal (proposer only)
    
    Args:
        swap_id: Swap proposal ID
        db: Database session
        current_driver: Current authenticated driver
    
    Raises:
        HTTPException: If swap cannot be cancelled
    """
    swap_service = SwapService(db)
    
    try:
        await swap_service.cancel_swap(
            swap_id=swap_id,
            driver_id=current_driver.id
        )
        
        logger.info(f"Swap {swap_id} cancelled by driver {current_driver.id}")
        
        return {"success": True}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
