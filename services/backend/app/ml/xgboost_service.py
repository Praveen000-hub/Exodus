"""
XGBoost Service - Innovation 1
Personalized Difficulty Scoring
"""

import numpy as np
from typing import Dict, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.ml.model_loader import ModelLoader

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class XGBoostService:
    """
    XGBoost difficulty prediction service
    Predicts personalized package difficulty for each driver
    """
    
    def __init__(self, model_loader: "ModelLoader"):
        self.model = model_loader.get_xgboost_model()
        self.scaler = model_loader.get_scaler()
    
    def predict_difficulty(
        self,
        driver_features: Dict,
        package_features: Dict
    ) -> float:
        """
        Predict difficulty score for driver-package pair
        
        Args:
            driver_features: Driver characteristics
                - experience_days: int
                - avg_delivery_time: float
                - success_rate: float
                - vehicle_capacity: int
            package_features: Package characteristics
                - weight: float
                - distance: float
                - floor_number: int
                - is_fragile: bool
                - time_window_hours: int
        
        Returns:
            float: Difficulty score (0-100)
        """
        try:
            # Build feature vector
            features = self._build_feature_vector(driver_features, package_features)
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            
            # Predict difficulty
            difficulty = self.model.predict(features_scaled)[0]
            
            # Clamp to 0-100 range
            difficulty = max(0, min(100, difficulty))
            
            logger.debug(f"Predicted difficulty: {difficulty:.2f}")
            
            return float(difficulty)
        
        except Exception as e:
            logger.error(f"XGBoost prediction failed: {str(e)}")
            # Return neutral difficulty on error
            return 50.0
    
    def predict_difficulty_batch(
        self,
        driver_features_list: List[Dict],
        package_features_list: List[Dict]
    ) -> np.ndarray:
        """
        Batch prediction for multiple driver-package pairs
        Used for building difficulty matrix in fairness algorithm
        
        Args:
            driver_features_list: List of driver feature dicts
            package_features_list: List of package feature dicts
        
        Returns:
            np.ndarray: Difficulty matrix [drivers x packages]
        """
        try:
            num_drivers = len(driver_features_list)
            num_packages = len(package_features_list)
            
            difficulty_matrix = np.zeros((num_drivers, num_packages))
            
            # Build all feature vectors
            all_features = []
            for driver_features in driver_features_list:
                for package_features in package_features_list:
                    features = self._build_feature_vector(driver_features, package_features)
                    all_features.append(features)
            
            # Scale and predict in batch
            all_features_scaled = self.scaler.transform(all_features)
            predictions = self.model.predict(all_features_scaled)
            
            # Reshape to matrix
            difficulty_matrix = predictions.reshape(num_drivers, num_packages)
            
            # Clamp values
            difficulty_matrix = np.clip(difficulty_matrix, 0, 100)
            
            logger.info(f"Batch prediction completed: {num_drivers}x{num_packages} matrix")
            
            return difficulty_matrix
        
        except Exception as e:
            logger.error(f"Batch prediction failed: {str(e)}")
            # Return neutral difficulty matrix
            return np.ones((len(driver_features_list), len(package_features_list))) * 50.0
    
    def _build_feature_vector(
        self,
        driver_features: Dict,
        package_features: Dict
    ) -> List[float]:
        """
        Build feature vector from driver and package features
        
        Feature order (15 features):
        1. Driver experience (days)
        2. Driver avg delivery time (minutes)
        3. Driver success rate (0-1)
        4. Driver vehicle capacity (kg)
        5. Package weight (kg)
        6. Package distance (km)
        7. Package floor number
        8. Package is_fragile (0/1)
        9. Package time_window (hours)
        10. Weight to capacity ratio
        11. Experience to distance ratio
        12. Success rate × weight (interaction)
        13. Distance × floor (interaction)
        14. Time pressure (1/time_window)
        15. Overall complexity score
        """
        # Extract features
        experience = driver_features.get('experience_days', 0)
        avg_time = driver_features.get('avg_delivery_time', 30)
        success_rate = driver_features.get('success_rate', 0.9)
        capacity = driver_features.get('vehicle_capacity', 50)
        
        weight = package_features.get('weight', 5)
        distance = package_features.get('distance', 10)
        floor = package_features.get('floor_number', 0)
        fragile = 1 if package_features.get('is_fragile', False) else 0
        time_window = package_features.get('time_window_hours', 4)
        
        # Derived features
        weight_ratio = weight / max(capacity, 1)
        exp_distance_ratio = experience / max(distance, 1)
        success_weight = success_rate * weight
        distance_floor = distance * max(floor, 1)
        time_pressure = 1 / max(time_window, 1)
        complexity = (weight * distance * max(floor, 1)) / (experience + 1)
        
        features = [
            experience,
            avg_time,
            success_rate,
            capacity,
            weight,
            distance,
            floor,
            fragile,
            time_window,
            weight_ratio,
            exp_distance_ratio,
            success_weight,
            distance_floor,
            time_pressure,
            complexity
        ]
        
        return features
