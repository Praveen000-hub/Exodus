"""
Swap Repository
Data access for swap proposals
"""

from typing import List
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.swap import Swap, SwapStatus
from app.db.repositories.base_repo import BaseRepository


class SwapRepository(BaseRepository[Swap]):
    """
    Swap proposal repository
    """
    
    def __init__(self, db: AsyncSession):
        super().__init__(Swap, db)
    
    async def get_pending_swaps(self, driver_id: int) -> List[Swap]:
        """Get pending swap proposals for driver"""
        result = await self.session.execute(
            select(Swap).where(
                and_(
                    or_(
                        Swap.proposer_id == driver_id,
                        Swap.acceptor_id == driver_id
                    ),
                    Swap.status == SwapStatus.PENDING
                )
            ).order_by(Swap.proposed_at.desc())
        )
        return list(result.scalars().all())
    
    async def get_available_for_driver(self, driver_id: int) -> List[Swap]:
        """Get swaps available for driver to accept"""
        result = await self.session.execute(
            select(Swap).where(
                and_(
                    Swap.acceptor_id == driver_id,
                    Swap.status == SwapStatus.PENDING
                )
            ).order_by(Swap.compatibility_score.desc())
        )
        return list(result.scalars().all())
