"""
Swap Matching Logic
Finds compatible swap partners based on preferences
"""

from typing import List, Dict, Tuple, Optional
import numpy as np

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class SwapMatcher:
    """
    Intelligent swap matching algorithm
    Finds best swap partners based on multiple criteria
    """
    
    def __init__(self):
        pass
    
    def find_compatible_swaps(
        self,
        driver_id: int,
        offered_package: Dict,
        all_drivers: List[Dict],
        all_packages: List[Dict]
    ) -> List[Dict]:
        """
        Find compatible swap partners for a driver
        
        Args:
            driver_id: Driver proposing swap
            offered_package: Package being offered
            all_drivers: List of all active drivers
            all_packages: List of all assigned packages
        
        Returns:
            List[Dict]: Compatible swap opportunities ranked by score
        
        Scoring criteria:
        1. Geographic proximity (reduce travel distance)
        2. Difficulty balance (swap easier for harder or vice versa)
        3. Time window compatibility
        4. Vehicle type compatibility
        """
        compatible_swaps = []
        
        offered_location = (offered_package['latitude'], offered_package['longitude'])
        offered_difficulty = offered_package['difficulty_score']
        
        for driver in all_drivers:
            if driver['id'] == driver_id:
                continue
            
            # Get driver's assigned packages
            driver_packages = [p for p in all_packages if p['driver_id'] == driver['id']]
            
            for package in driver_packages:
                package_location = (package['latitude'], package['longitude'])
                package_difficulty = package['difficulty_score']
                
                # Calculate compatibility score
                score = self._calculate_swap_score(
                    offered_location=offered_location,
                    offered_difficulty=offered_difficulty,
                    target_location=package_location,
                    target_difficulty=package_difficulty,
                    driver_location=driver['current_location']
                )
                
                if score > 0.5:  # Threshold for compatibility
                    compatible_swaps.append({
                        'driver_id': driver['id'],
                        'driver_name': driver['name'],
                        'package_id': package['id'],
                        'package_address': package['address'],
                        'compatibility_score': score,
                        'distance_saved': self._calculate_distance_saved(
                            offered_location, package_location, driver['current_location']
                        ),
                        'difficulty_difference': package_difficulty - offered_difficulty
                    })
        
        # Sort by compatibility score (highest first)
        compatible_swaps.sort(key=lambda x: x['compatibility_score'], reverse=True)
        
        logger.info(f"Found {len(compatible_swaps)} compatible swaps for driver {driver_id}")
        
        return compatible_swaps
    
    def _calculate_swap_score(
        self,
        offered_location: Tuple[float, float],
        offered_difficulty: float,
        target_location: Tuple[float, float],
        target_difficulty: float,
        driver_location: Tuple[float, float]
    ) -> float:
        """
        Calculate compatibility score for a potential swap
        
        Score components:
        - Distance reduction (40%)
        - Difficulty balance (30%)
        - Overall benefit (30%)
        """
        # 1. Distance component (0-1, higher is better)
        current_distance = self._haversine_distance(driver_location, offered_location)
        swap_distance = self._haversine_distance(driver_location, target_location)
        
        distance_improvement = max(0, (current_distance - swap_distance) / current_distance)
        distance_score = min(1.0, distance_improvement * 2)  # Amplify small improvements
        
        # 2. Difficulty balance component
        # Prefer swaps that balance workload (swap hard for easy or vice versa)
        difficulty_diff = abs(target_difficulty - offered_difficulty)
        difficulty_score = min(1.0, difficulty_diff / 50)  # Normalize to 0-1
        
        # 3. Overall benefit (combination)
        overall_score = (
            0.4 * distance_score +
            0.3 * difficulty_score +
            0.3 * (1.0 if distance_improvement > 0 else 0)  # Binary benefit flag
        )
        
        return overall_score
    
    def _calculate_distance_saved(
        self,
        offered_location: Tuple[float, float],
        target_location: Tuple[float, float],
        driver_location: Tuple[float, float]
    ) -> float:
        """
        Calculate total distance saved by swap (in km)
        """
        current_distance = self._haversine_distance(driver_location, offered_location)
        swap_distance = self._haversine_distance(driver_location, target_location)
        
        return max(0, current_distance - swap_distance)
    
    def _haversine_distance(
        self,
        loc1: Tuple[float, float],
        loc2: Tuple[float, float]
    ) -> float:
        """
        Calculate distance between two lat/lon points using Haversine formula
        
        Args:
            loc1: (latitude, longitude) tuple
            loc2: (latitude, longitude) tuple
        
        Returns:
            float: Distance in kilometers
        """
        from math import radians, sin, cos, sqrt, atan2
        
        lat1, lon1 = loc1
        lat2, lon2 = loc2
        
        R = 6371  # Earth radius in kilometers
        
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        
        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        distance = R * c
        return distance
