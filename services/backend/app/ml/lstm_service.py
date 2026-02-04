"""
LSTM Forecasting Service - Innovation 4
30-day demand forecasting using LSTM neural networks
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class LSTMService:
    """
    **INNOVATION 4: LSTM-based 30-Day Demand Forecasting**
    
    Predicts delivery demand for next 30 days using LSTM
    Helps optimize driver scheduling and resource allocation
    """
    
    def __init__(self, model_loader):
        """
        Initialize LSTM service
        
        Args:
            model_loader: ModelLoader instance with loaded LSTM model
        """
        self.model_loader = model_loader
        self.sequence_length = 30  # Use 30 days of history
        self.forecast_horizon = 30  # Predict 30 days ahead
    
    def prepare_sequence(self, historical_data: List[float]) -> np.ndarray:
        """
        Prepare input sequence for LSTM
        
        Args:
            historical_data: List of historical demand values
        
        Returns:
            Prepared sequence as numpy array
        """
        # Take last sequence_length days
        if len(historical_data) < self.sequence_length:
            # Pad with zeros if insufficient data
            padding = [0] * (self.sequence_length - len(historical_data))
            historical_data = padding + historical_data
        else:
            historical_data = historical_data[-self.sequence_length:]
        
        # Reshape for LSTM: (batch_size, timesteps, features)
        sequence = np.array(historical_data).reshape(1, self.sequence_length, 1)
        
        return sequence
    
    def predict_demand(
        self,
        historical_data: List[float],
        location: Optional[Tuple[float, float]] = None
    ) -> Dict:
        """
        Predict delivery demand for next 30 days
        
        Args:
            historical_data: Historical demand data (daily counts)
            location: Optional (lat, lng) for location-specific forecast
        
        Returns:
            Dict with forecast data
        """
        if not TENSORFLOW_AVAILABLE:
            logger.warning("TensorFlow not installed - LSTM forecasting disabled")
            return {
                "error": "TensorFlow not available (will be installed in production)",
                "forecast": None,
                "note": "LSTM model requires TensorFlow - awaiting model training"
            }
        
        if self.model_loader.lstm_model is None:
            logger.warning("LSTM model not loaded")
            return {
                "error": "LSTM model not available",
                "forecast": None
            }
        
        try:
            # Prepare input sequence
            sequence = self.prepare_sequence(historical_data)
            
            # Scale if scaler available
            if self.model_loader.scaler is not None:
                sequence = self.model_loader.scaler.transform(
                    sequence.reshape(-1, 1)
                ).reshape(1, self.sequence_length, 1)
            
            # Generate forecast
            forecast = []
            current_sequence = sequence.copy()
            
            for _ in range(self.forecast_horizon):
                # Predict next day
                prediction = self.model_loader.lstm_model.predict(
                    current_sequence,
                    verbose=0
                )[0, 0]
                
                # Inverse scale if scaler available
                if self.model_loader.scaler is not None:
                    prediction = self.model_loader.scaler.inverse_transform(
                        [[prediction]]
                    )[0, 0]
                
                forecast.append(float(prediction))
                
                # Update sequence for next prediction
                # Shift left and add new prediction
                current_sequence = np.roll(current_sequence, -1, axis=1)
                
                # Scale the prediction before adding to sequence
                scaled_pred = prediction
                if self.model_loader.scaler is not None:
                    scaled_pred = self.model_loader.scaler.transform(
                        [[prediction]]
                    )[0, 0]
                
                current_sequence[0, -1, 0] = scaled_pred
            
            # Generate forecast dates
            start_date = datetime.now().date() + timedelta(days=1)
            forecast_dates = [
                (start_date + timedelta(days=i)).isoformat()
                for i in range(self.forecast_horizon)
            ]
            
            return {
                "forecast": forecast,
                "dates": forecast_dates,
                "horizon_days": self.forecast_horizon,
                "location": location,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"LSTM prediction failed: {e}")
            return {
                "error": str(e),
                "forecast": None
            }
    
    def predict_hourly_demand(
        self,
        historical_hourly_data: List[float]
    ) -> Dict:
        """
        Predict hourly demand for next 24 hours
        
        Args:
            historical_hourly_data: Historical hourly demand data
        
        Returns:
            Dict with hourly forecast
        """
        # Similar to daily but with hourly granularity
        # For now, use simple heuristic based on daily forecast
        
        daily_forecast = self.predict_demand(historical_hourly_data)
        
        if "error" in daily_forecast:
            return daily_forecast
        
        # Distribute daily forecast across hours (simplified)
        # In production, use separate hourly LSTM model
        hourly_pattern = [0.02, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07,
                         0.08, 0.07, 0.06, 0.06, 0.05, 0.05, 0.04, 0.05,
                         0.06, 0.08, 0.09, 0.08, 0.06, 0.04, 0.03, 0.02]
        
        hourly_forecast = []
        for daily_demand in daily_forecast["forecast"][:1]:  # First day only
            for hour_ratio in hourly_pattern:
                hourly_forecast.append(daily_demand * hour_ratio)
        
        return {
            "forecast": hourly_forecast,
            "hours": list(range(24)),
            "generated_at": datetime.now().isoformat()
        }
    
    def generate_heatmap_data(
        self,
        forecasts: Dict[str, List[float]],
        grid_size: int = 10
    ) -> Dict:
        """
        Generate heatmap data for geographic demand visualization
        
        Args:
            forecasts: Dict mapping location_id to forecast arrays
            grid_size: Size of geographic grid
        
        Returns:
            Heatmap data for visualization
        """
        # Simplified heatmap generation
        # In production, use actual geographic clustering
        
        heatmap = {
            "grid_size": grid_size,
            "locations": [],
            "demand_levels": []
        }
        
        for location_id, forecast in forecasts.items():
            avg_demand = np.mean(forecast)
            
            heatmap["locations"].append(location_id)
            heatmap["demand_levels"].append(float(avg_demand))
        
        return heatmap
    
    def calculate_confidence_intervals(
        self,
        forecast: List[float],
        confidence_level: float = 0.95
    ) -> Dict:
        """
        Calculate confidence intervals for forecast
        
        Args:
            forecast: Predicted values
            confidence_level: Confidence level (0-1)
        
        Returns:
            Dict with confidence bounds
        """
        # Simplified confidence intervals
        # In production, use Monte Carlo dropout or ensemble methods
        
        std_error = np.std(forecast) * 0.1  # Simplified error estimate
        z_score = 1.96 if confidence_level == 0.95 else 2.58
        
        margin = z_score * std_error
        
        return {
            "lower_bound": [max(0, f - margin) for f in forecast],
            "upper_bound": [f + margin for f in forecast],
            "confidence_level": confidence_level
        }


def create_lstm_service(model_loader) -> LSTMService:
    """Factory function to create LSTM service"""
    return LSTMService(model_loader)
