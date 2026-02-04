"""
Health Prediction Service - Innovation 5
Random Forest-based health risk prediction for drivers
"""

import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class HealthPredictionService:
    """
    **INNOVATION 5: Health Guardian (Random Forest)**
    
    Predicts driver health risks using Random Forest
    Recommends breaks and workload adjustments
    """
    
    def __init__(self, model_loader):
        """
        Initialize health prediction service
        
        Args:
            model_loader: ModelLoader instance with trained RF model
        """
        self.model_loader = model_loader
        self.feature_names = [
            "hours_worked_today",
            "consecutive_days_worked",
            "deliveries_completed_today",
            "avg_delivery_difficulty",
            "rest_hours_last_24h",
            "age",
            "health_events_last_week",
            "average_heart_rate",
            "stress_level"
        ]
    
    def prepare_features(self, driver_data: Dict) -> np.ndarray:
        """
        Prepare feature vector from driver data
        
        Args:
            driver_data: Dictionary with driver health metrics
        
        Returns:
            Feature array for prediction
        """
        features = [
            driver_data.get("hours_worked_today", 0),
            driver_data.get("consecutive_days_worked", 0),
            driver_data.get("deliveries_completed_today", 0),
            driver_data.get("avg_delivery_difficulty", 0),
            driver_data.get("rest_hours_last_24h", 8),
            driver_data.get("age", 30),
            driver_data.get("health_events_last_week", 0),
            driver_data.get("average_heart_rate", 70),
            driver_data.get("stress_level", 5)
        ]
        
        return np.array(features).reshape(1, -1)
    
    def predict_health_risk(self, driver_data: Dict) -> Dict:
        """
        Predict health risk level for driver
        
        Args:
            driver_data: Dictionary with driver metrics
        
        Returns:
            Dict with risk score and recommendations
        """
        if self.model_loader.health_model is None:
            logger.warning("Health model not loaded")
            return {
                "error": "Health model not available",
                "risk_score": None,
                "risk_level": "unknown"
            }
        
        try:
            # Prepare features
            features = self.prepare_features(driver_data)
            
            # Predict risk score (0-100)
            risk_score = self.model_loader.health_model.predict_proba(features)[0, 1] * 100
            
            # Determine risk level
            if risk_score >= 75:
                risk_level = "high"
                color = "red"
            elif risk_score >= 40:
                risk_level = "medium"
                color = "yellow"
            else:
                risk_level = "low"
                color = "green"
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                risk_score,
                driver_data
            )
            
            return {
                "risk_score": float(risk_score),
                "risk_level": risk_level,
                "color": color,
                "recommendations": recommendations,
                "assessed_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Health risk prediction failed: {e}")
            return {
                "error": str(e),
                "risk_score": None,
                "risk_level": "unknown"
            }
    
    def _generate_recommendations(
        self,
        risk_score: float,
        driver_data: Dict
    ) -> List[str]:
        """
        Generate health recommendations based on risk score
        
        Args:
            risk_score: Predicted risk score
            driver_data: Driver metrics
        
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        # High risk recommendations
        if risk_score >= 75:
            recommendations.append("⚠️ URGENT: Take mandatory rest break")
            recommendations.append("Consider ending shift early today")
            
            if driver_data.get("consecutive_days_worked", 0) >= 6:
                recommendations.append("Take at least 1 full day off")
        
        # Medium risk recommendations
        elif risk_score >= 40:
            recommendations.append("Take 30-minute break within next hour")
            recommendations.append("Reduce delivery difficulty for next assignments")
            
            if driver_data.get("hours_worked_today", 0) >= 8:
                recommendations.append("Limit today's shift to 10 hours max")
        
        # Low risk general wellness
        else:
            recommendations.append("Maintain current pace")
            recommendations.append("Take regular 15-minute breaks")
        
        # Specific metric-based recommendations
        if driver_data.get("rest_hours_last_24h", 8) < 6:
            recommendations.append("Prioritize sleep - aim for 7-8 hours tonight")
        
        if driver_data.get("average_heart_rate", 70) > 100:
            recommendations.append("Monitor heart rate - consider medical check")
        
        if driver_data.get("stress_level", 5) >= 8:
            recommendations.append("High stress detected - take calming break")
        
        return recommendations
    
    def recommend_break_schedule(self, driver_data: Dict) -> Dict:
        """
        Recommend optimal break schedule for driver
        
        Args:
            driver_data: Driver metrics and schedule
        
        Returns:
            Dict with break recommendations
        """
        risk_assessment = self.predict_health_risk(driver_data)
        
        hours_worked = driver_data.get("hours_worked_today", 0)
        planned_hours = driver_data.get("planned_hours_today", 8)
        
        # Calculate break schedule
        if risk_assessment["risk_level"] == "high":
            # High risk: frequent short breaks
            break_interval = 2  # hours
            break_duration = 30  # minutes
        elif risk_assessment["risk_level"] == "medium":
            # Medium risk: moderate breaks
            break_interval = 3
            break_duration = 20
        else:
            # Low risk: standard breaks
            break_interval = 4
            break_duration = 15
        
        # Generate break times
        remaining_hours = planned_hours - hours_worked
        num_breaks = max(0, int(remaining_hours / break_interval))
        
        current_time = datetime.now()
        break_times = []
        
        for i in range(num_breaks):
            break_time = current_time + timedelta(
                hours=break_interval * (i + 1)
            )
            break_times.append({
                "time": break_time.strftime("%H:%M"),
                "duration_minutes": break_duration,
                "type": "rest_break"
            })
        
        return {
            "break_schedule": break_times,
            "total_break_time_minutes": num_breaks * break_duration,
            "risk_level": risk_assessment["risk_level"],
            "recommendations": risk_assessment["recommendations"]
        }
    
    def predict_batch(self, drivers_data: List[Dict]) -> List[Dict]:
        """
        Predict health risks for multiple drivers
        
        Args:
            drivers_data: List of driver data dictionaries
        
        Returns:
            List of risk assessment results
        """
        results = []
        
        for driver_data in drivers_data:
            result = self.predict_health_risk(driver_data)
            result["driver_id"] = driver_data.get("driver_id")
            results.append(result)
        
        return results
    
    def calculate_fatigue_score(self, driver_data: Dict) -> float:
        """
        Calculate standalone fatigue score
        
        Args:
            driver_data: Driver metrics
        
        Returns:
            Fatigue score (0-100)
        """
        # Simple fatigue calculation based on key metrics
        hours_worked = driver_data.get("hours_worked_today", 0)
        consecutive_days = driver_data.get("consecutive_days_worked", 0)
        rest_hours = driver_data.get("rest_hours_last_24h", 8)
        
        # Weighted fatigue calculation
        fatigue_score = (
            (hours_worked / 12) * 40 +  # 40% weight on daily hours
            (consecutive_days / 7) * 30 +  # 30% weight on consecutive days
            ((12 - rest_hours) / 12) * 30  # 30% weight on rest deficit
        )
        
        return min(100, max(0, fatigue_score))


def create_health_service(model_loader) -> HealthPredictionService:
    """Factory function to create health service"""
    return HealthPredictionService(model_loader)
