"""
Insurance Payout Model
Z-score based insurance claims
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.base import BaseModel


class InsurancePayout(BaseModel):
    """
    Insurance payout model
    """
    __tablename__ = "insurance_payouts"
    
    # Driver reference
    driver_id = Column(Integer, ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Claim period
    claim_start_date = Column(DateTime, nullable=False)
    claim_end_date = Column(DateTime, nullable=False)
    
    # Failure statistics
    total_failures = Column(Integer, nullable=False)
    driver_failure_rate = Column(Float, nullable=False)
    population_mean_rate = Column(Float, nullable=False)
    population_std_rate = Column(Float, nullable=False)
    
    # Z-score calculation
    z_score = Column(Float, nullable=False)
    is_eligible = Column(Boolean, nullable=False)
    
    # Payout calculation
    excess_failures = Column(Float, nullable=False)
    payout_amount = Column(Float, nullable=False)
    
    # Reason and notes
    payout_reason = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    # Status
    is_approved = Column(Boolean, default=False)
    is_paid = Column(Boolean, default=False)
    approved_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<InsurancePayout(id={self.id}, driver_id={self.driver_id}, amount=₹{self.payout_amount})>"
