"""
Health Prediction Service - Innovations 3 & 6
Real-Time Health Monitoring & Break Recommendations
"""

import numpy as np
from typing import Dict, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.ml.model_loader import ModelLoader

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class HealthPredictionService:
    """
    Random Forest health risk prediction service
    Monitors driver health and recommends breaks
    """
    
    def __init__(self, model_loader: "ModelLoader"):
        self.model = model_loader.get_health_model()
        self.scaler = model_loader.get_scaler()
    
    def predict_health_risk(
        self,
        health_vitals: Dict,
        workload_features: Dict
    ) -> float:
        """
        **INNOVATION 3: Real-Time Health Monitoring**
        
        Predict health risk score using Random Forest
        
        Args:
            health_vitals: Current health data
                - heart_rate: int (bpm)
                - fatigue_level: int (1-10)
                - hours_worked: float
                - last_break_hours_ago: float
            workload_features: Current workload
                - packages_delivered: int
                - packages_remaining: int
                - total_distance_km: float
                - avg_package_difficulty: float
        
        Returns:
            float: Health risk score (0-100)
                0-40: Low risk (green)
                40-60: Medium risk (yellow)
                60-75: High risk (orange)
                75-100: Critical risk (red)
        """
        try:
            # Build feature vector
            features = self._build_health_features(health_vitals, workload_features)
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            
            # Predict risk score
            risk_score = self.model.predict(features_scaled)[0]
            
            # Get probability estimates (if available)
            if hasattr(self.model, 'predict_proba'):
                risk_proba = self.model.predict_proba(features_scaled)[0]
                # Use probability of high-risk class
                risk_score = risk_proba[1] * 100 if len(risk_proba) > 1 else risk_score
            
            # Clamp to 0-100
            risk_score = max(0, min(100, risk_score))
            
            logger.debug(f"Health risk score: {risk_score:.2f}")
            
            return float(risk_score)
        
        except Exception as e:
            logger.error(f"Health risk prediction failed: {str(e)}")
            # Return neutral risk on error
            return 50.0
    
    def recommend_break_duration(
        self,
        health_risk: float,
        remaining_difficulty: float,
        hours_worked: float
    ) -> Dict:
        """
        **INNOVATION 6: Dynamic Break Recommendations**
        
        Calculate personalized break recommendation
        
        Args:
            health_risk: Current health risk score (0-100)
            remaining_difficulty: Total difficulty of remaining packages
            hours_worked: Hours worked today
        
        Returns:
            Dict: Break recommendation
                - should_break: bool
                - duration_minutes: int
                - urgency: str (low/medium/high/critical)
                - reason: str
        """
        try:
            # Decision matrix for break recommendations
            should_break = False
            duration = 0
            urgency = "none"
            reason = ""
            
            # Critical risk (>75) - immediate break required
            if health_risk >= settings.HEALTH_RISK_HIGH:
                should_break = True
                urgency = "critical"
                
                if health_risk >= 90:
                    duration = settings.MAX_BREAK_DURATION  # 60 minutes
                    reason = "Critical health risk detected. Take extended break immediately."
                elif health_risk >= 80:
                    duration = 45
                    reason = "Very high health risk. Take a substantial break now."
                else:
                    duration = 30
                    reason = "High health risk. Take a break as soon as possible."
            
            # High risk (60-75) - break recommended
            elif health_risk >= settings.HEALTH_RISK_MEDIUM:
                should_break = True
                urgency = "high"
                duration = 20
                reason = "Elevated health risk. A short break is recommended."
            
            # Medium risk (40-60) - conditional break
            elif health_risk >= settings.HEALTH_RISK_LOW:
                # Consider workload
                if remaining_difficulty > 50 or hours_worked > 6:
                    should_break = True
                    urgency = "medium"
                    duration = settings.MIN_BREAK_DURATION  # 15 minutes
                    reason = "Moderate risk with significant remaining work. Short break advised."
            
            # Additional factors
            if hours_worked > 8 and not should_break:
                should_break = True
                urgency = "medium"
                duration = 15
                reason = "Extended work hours. Brief rest recommended."
            
            # Calculate optimal break timing
            if should_break:
                optimal_timing = self._calculate_optimal_break_timing(
                    remaining_difficulty,
                    hours_worked
                )
            else:
                optimal_timing = None
            
            recommendation = {
                'should_break': should_break,
                'duration_minutes': duration,
                'urgency': urgency,
                'reason': reason,
                'optimal_timing': optimal_timing,
                'health_risk_score': health_risk
            }
            
            logger.info(f"Break recommendation: {urgency} - {duration} minutes")
            
            return recommendation
        
        except Exception as e:
            logger.error(f"Break recommendation failed: {str(e)}")
            return {
                'should_break': False,
                'duration_minutes': 0,
                'urgency': 'none',
                'reason': 'Unable to calculate recommendation',
                'optimal_timing': None,
                'health_risk_score': health_risk
            }
    
    def _build_health_features(
        self,
        health_vitals: Dict,
        workload_features: Dict
    ) -> List[float]:
        """
        Build feature vector for health prediction
        
        Features (12 total):
        1. Heart rate (bpm)
        2. Fatigue level (1-10)
        3. Hours worked today
        4. Hours since last break
        5. Packages delivered
        6. Packages remaining
        7. Total distance (km)
        8. Average package difficulty
        9. Work intensity (packages/hour)
        10. Fatigue per hour ratio
        11. Heart rate normalized (0-1)
        12. Workload stress index
        """
        heart_rate = health_vitals.get('heart_rate', 70)
        fatigue = health_vitals.get('fatigue_level', 5)
        hours_worked = health_vitals.get('hours_worked', 0)
        last_break = health_vitals.get('last_break_hours_ago', 0)
        
        delivered = workload_features.get('packages_delivered', 0)
        remaining = workload_features.get('packages_remaining', 0)
        distance = workload_features.get('total_distance_km', 0)
        difficulty = workload_features.get('avg_package_difficulty', 50)
        
        # Derived features
        work_intensity = delivered / max(hours_worked, 1)
        fatigue_ratio = fatigue / max(hours_worked, 1)
        hr_normalized = (heart_rate - 60) / 40  # Normalize around resting HR
        workload_stress = (remaining * difficulty * distance) / 1000
        
        features = [
            heart_rate,
            fatigue,
            hours_worked,
            last_break,
            delivered,
            remaining,
            distance,
            difficulty,
            work_intensity,
            fatigue_ratio,
            hr_normalized,
            workload_stress
        ]
        
        return features
    
    def _calculate_optimal_break_timing(
        self,
        remaining_difficulty: float,
        hours_worked: float
    ) -> str:
        """
        Calculate optimal timing for break
        """
        if remaining_difficulty > 70:
            return "after_next_delivery"
        elif hours_worked > 7:
            return "immediately"
        else:
            return "within_30_minutes"
