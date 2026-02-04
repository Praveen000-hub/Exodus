"""
Insurance Calculation Logic
Z-score based insurance payouts for failed deliveries
"""

from typing import Dict, List
import numpy as np
from datetime import datetime, timedelta

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class InsuranceCalculator:
    """
    Calculate insurance payouts using Z-score method
    Protects drivers from unfair penalties due to external factors
    """
    
    def __init__(self):
        self.z_score_threshold = 2.0  # 2 standard deviations
    
    def calculate_z_score(self, value: float, mean: float, std: float) -> float:
        """
        Calculate Z-score for a given value
        
        Args:
            value: The value to calculate Z-score for
            mean: Population mean
            std: Population standard deviation
        
        Returns:
            Z-score
        """
        if std == 0:
            return 0
        return (value - mean) / std
    
    async def calculate_payout(
        self,
        driver_id: int,
        failed_deliveries: List[Dict],
        all_driver_stats: List[Dict],
        base_penalty: float = 100.0
    ) -> Dict:
        """
        Calculate insurance payout for failed deliveries
        
        Args:
            driver_id: Driver claiming insurance
            failed_deliveries: List of failed delivery records
            all_driver_stats: Statistics for all drivers (for comparison)
            base_penalty: Base penalty amount per failed delivery
        
        Returns:
            Dict: Payout calculation details
        
        Logic:
        1. Calculate driver's failure rate
        2. Calculate z-score compared to all drivers
        3. If z-score > threshold, driver is unlucky (external factors)
        4. Payout = (failures above expected) * base_penalty
        """
        # Calculate driver's failure rate
        driver_failures = len(failed_deliveries)
        driver_total = driver_failures + sum(
            1 for d in all_driver_stats if d['driver_id'] == driver_id
        )
        driver_failure_rate = driver_failures / max(driver_total, 1)
        
        # Calculate population statistics
        all_failure_rates = [
            d['failure_rate'] for d in all_driver_stats
        ]
        
        mean_failure_rate = np.mean(all_failure_rates)
        std_failure_rate = np.std(all_failure_rates)
        
        # Calculate z-score
        if std_failure_rate == 0:
            z_score = 0
        else:
            z_score = (driver_failure_rate - mean_failure_rate) / std_failure_rate
        
        # Determine if eligible for insurance
        eligible = z_score > self.z_score_threshold
        
        if eligible:
            # Calculate expected failures
            expected_failures = mean_failure_rate * driver_total
            excess_failures = max(0, driver_failures - expected_failures)
            
            # Calculate payout
            payout_amount = excess_failures * base_penalty
            
            logger.info(f"Insurance payout for driver {driver_id}: ₹{payout_amount:.2f} (z-score: {z_score:.2f})")
        else:
            payout_amount = 0
            logger.info(f"Driver {driver_id} not eligible for insurance (z-score: {z_score:.2f})")
        
        return {
            'driver_id': driver_id,
            'eligible': eligible,
            'payout_amount': payout_amount,
            'z_score': z_score,
            'driver_failure_rate': driver_failure_rate,
            'mean_failure_rate': mean_failure_rate,
            'excess_failures': excess_failures if eligible else 0,
            'reason': self._get_payout_reason(eligible, z_score)
        }
    
    def _get_payout_reason(self, eligible: bool, z_score: float) -> str:
        """
        Generate human-readable reason for payout decision
        """
        if not eligible:
            return "Failure rate within normal range - no external factors detected"
        
        if z_score > 3.0:
            return "Extremely high failure rate - severe external factors detected"
        elif z_score > 2.5:
            return "Very high failure rate - significant external factors detected"
        else:
            return "High failure rate - moderate external factors detected"
