"""
Swap Marketplace Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SwapProposalRequest(BaseModel):
    """Swap proposal request"""
    offered_package_id: int
    requested_package_id: int
    reason: Optional[str] = Field(None, max_length=500)


class SwapResponse(BaseModel):
    """Swap response"""
    id: int
    proposer_id: int
    acceptor_id: Optional[int]
    offered_package_id: int
    requested_package_id: int
    status: str
    compatibility_score: Optional[float]
    distance_saved_km: Optional[float]
    proposed_at: datetime
    
    class Config:
        from_attributes = True


class SwapAcceptRequest(BaseModel):
    """Swap accept request"""
    notes: Optional[str] = Field(None, max_length=200)
