"""
Swap Service
Business logic for swap marketplace
"""

from typing import List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.swap_repo import SwapRepository
from app.db.models.swap import Swap, SwapStatus
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class SwapService:
    """Swap marketplace service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.swap_repo = SwapRepository(db)
    
    async def get_available_swaps(self, driver_id: int) -> List[Swap]:
        """Get available swaps for driver"""
        return await self.swap_repo.get_available_for_driver(driver_id)
    
    async def propose_swap(
        self,
        proposer_id: int,
        offered_package_id: int,
        requested_package_id: int,
        reason: str = None
    ) -> Swap:
        """Propose a package swap"""
        # Validate packages belong to correct drivers
        from app.db.repositories.assignment_repo import AssignmentRepository
        from datetime import date
        
        assignment_repo = AssignmentRepository(self.db)
        
        # Check offered package belongs to proposer
        offered_assignment = await assignment_repo.get_by_package(
            offered_package_id,
            date.today()
        )
        
        if not offered_assignment or offered_assignment.driver_id != proposer_id:
            raise ValueError("Offered package not assigned to proposer")
        
        # Check requested package is assigned to someone else
        requested_assignment = await assignment_repo.get_by_package(
            requested_package_id,
            date.today()
        )
        
        if not requested_assignment:
            raise ValueError("Requested package not assigned")
        
        if requested_assignment.driver_id == proposer_id:
            raise ValueError("Cannot swap with yourself")
        
        acceptor_id = requested_assignment.driver_id
        
        # Create swap proposal
        swap = await self.swap_repo.create(
            proposer_id=proposer_id,
            acceptor_id=acceptor_id,
            offered_package_id=offered_package_id,
            requested_package_id=requested_package_id,
            status=SwapStatus.PENDING,
            reason=reason,
            proposed_at=datetime.utcnow()
        )
        
        logger.info(f"Swap proposed: {swap.id} by driver {proposer_id}")
        
        return swap
    
    async def accept_swap(self, swap_id: int, acceptor_id: int) -> Swap:
        """Accept a swap proposal"""
        swap = await self.swap_repo.get_by_id(swap_id)
        
        if not swap:
            raise ValueError("Swap not found")
        
        if swap.acceptor_id != acceptor_id:
            raise ValueError("Not authorized to accept this swap")
        
        if swap.status != SwapStatus.PENDING:
            raise ValueError("Swap is not pending")
        
        # Update swap status
        swap = await self.swap_repo.update(
            swap_id,
            status=SwapStatus.ACCEPTED,
            responded_at=datetime.utcnow()
        )
        
        # Swap the assignments
        from app.db.repositories.assignment_repo import AssignmentRepository
        from datetime import date
        
        assignment_repo = AssignmentRepository(self.db)
        
        # Get both assignments
        assignment1 = await assignment_repo.get_by_package(
            swap.offered_package_id,
            date.today()
        )
        assignment2 = await assignment_repo.get_by_package(
            swap.requested_package_id,
            date.today()
        )
        
        # Swap driver IDs
        await assignment_repo.update(
            assignment1.id,
            driver_id=assignment2.driver_id
        )
        await assignment_repo.update(
            assignment2.id,
            driver_id=assignment1.driver_id
        )
        
        # Mark swap as completed
        await self.swap_repo.update(
            swap_id,
            status=SwapStatus.COMPLETED,
            completed_at=datetime.utcnow()
        )
        
        logger.info(f"Swap completed: {swap_id}")
        
        return swap
    
    async def cancel_swap(self, swap_id: int, driver_id: int):
        """Cancel a swap proposal"""
        swap = await self.swap_repo.get_by_id(swap_id)
        
        if not swap:
            raise ValueError("Swap not found")
        
        if swap.proposer_id != driver_id:
            raise ValueError("Only proposer can cancel swap")
        
        if swap.status != SwapStatus.PENDING:
            raise ValueError("Can only cancel pending swaps")
        
        await self.swap_repo.update(
            swap_id,
            status=SwapStatus.CANCELLED
        )
