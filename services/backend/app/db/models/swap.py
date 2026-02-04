"""
Swap Model
Package swap marketplace
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import BaseModel


class SwapStatus(str, enum.Enum):
    """Swap status"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Swap(BaseModel):
    """
    Swap proposal model
    """
    __tablename__ = "swaps"
    
    # Parties involved
    proposer_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    acceptor_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Packages being swapped
    offered_package_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False)
    requested_package_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False)
    
    # Swap details
    status = Column(Enum(SwapStatus), default=SwapStatus.PENDING, nullable=False, index=True)
    reason = Column(Text, nullable=True)
    
    # Compatibility score (from swap matching algorithm)
    compatibility_score = Column(Float, nullable=True)
    distance_saved_km = Column(Float, nullable=True)
    difficulty_difference = Column(Float, nullable=True)
    
    # Timestamps
    proposed_at = Column(DateTime, nullable=False, index=True)
    responded_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    proposer = relationship("Driver", foreign_keys=[proposer_id], back_populates="swaps_proposed")
    acceptor = relationship("Driver", foreign_keys=[acceptor_id], back_populates="swaps_received")
    
    def __repr__(self):
        return f"<Swap(id={self.id}, proposer={self.proposer_id}, status='{self.status}')>"
