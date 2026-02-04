"""
LSTM Service - Innovations 2 & 7
Predictive Workload Forecasting & Earnings Prediction
"""

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from app.ml.model_loader import ModelLoader

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class LSTMService:
    """
    LSTM forecasting service
    Predicts future package volumes for workload and earnings forecasting
    """
    
    def __init__(self, model_loader: "ModelLoader"):
        self.model = model_loader.get_lstm_model()
        self.scaler = model_loader.get_scaler()
        self.sequence_length = 30  # 30 days of historical data
    
    def predict_volume_forecast(
        self,
        historical_volumes: List[int],
        forecast_days: int = 30
    ) -> List[Dict]:
        """
        **INNOVATION 2: Predictive Workload Forecasting**
        
        Predict package volumes for next N days
        
        Args:
            historical_volumes: List of daily package counts (last 30+ days)
            forecast_days: Number of days to forecast
        
        Returns:
            List[Dict]: Daily forecasts with date and predicted volume
        """
        try:
            # Prepare input sequence
            if len(historical_volumes) < self.sequence_length:
                logger.warning(f"Insufficient historical data: {len(historical_volumes)} days")
                # Pad with mean if needed
                mean_volume = np.mean(historical_volumes) if historical_volumes else 100
                historical_volumes = [mean_volume] * (self.sequence_length - len(historical_volumes)) + historical_volumes
            
            # Take last sequence_length days
            input_sequence = historical_volumes[-self.sequence_length:]
            
            # Scale input
            input_scaled = self.scaler.transform(np.array(input_sequence).reshape(-1, 1))
            input_scaled = input_scaled.reshape(1, self.sequence_length, 1)
            
            # Generate forecasts
            forecasts = []
            current_sequence = input_scaled.copy()
            
            for day in range(forecast_days):
                # Predict next day
                prediction = self.model.predict(current_sequence, verbose=0)
                
                # Inverse transform to get actual volume
                predicted_volume = self.scaler.inverse_transform(prediction)[0][0]
                predicted_volume = max(0, int(predicted_volume))  # Ensure non-negative integer
                
                # Store forecast
                forecast_date = datetime.now().date() + timedelta(days=day + 1)
                forecasts.append({
                    'date': forecast_date.isoformat(),
                    'predicted_volume': predicted_volume,
                    'day_of_week': forecast_date.strftime('%A'),
                    'confidence': self._calculate_confidence(day)
                })
                
                # Update sequence for next prediction
                current_sequence = np.roll(current_sequence, -1, axis=1)
                current_sequence[0, -1, 0] = prediction[0][0]
            
            logger.info(f"Generated {forecast_days}-day volume forecast")
            
            return forecasts
        
        except Exception as e:
            logger.error(f"LSTM volume forecast failed: {str(e)}")
            # Return neutral forecast
            return self._generate_fallback_forecast(forecast_days)
    
    def calculate_earnings_forecast(
        self,
        historical_volumes: List[int],
        driver_share: float,
        payment_per_package: float,
        forecast_days: int = 30
    ) -> Dict:
        """
        **INNOVATION 7: Earnings Prediction Dashboard**
        
        Calculate personalized earnings forecast for driver
        
        Args:
            historical_volumes: Historical daily volumes
            driver_share: Driver's share of total deliveries (0-1)
            payment_per_package: Payment per package (₹)
            forecast_days: Number of days to forecast
        
        Returns:
            Dict: Earnings forecast with daily breakdown
        """
        try:
            # Get volume forecasts
            volume_forecasts = self.predict_volume_forecast(historical_volumes, forecast_days)
            
            # Calculate earnings for each day
            daily_earnings = []
            total_earnings = 0
            
            for forecast in volume_forecasts:
                predicted_volume = forecast['predicted_volume']
                driver_packages = int(predicted_volume * driver_share)
                daily_earning = driver_packages * payment_per_package
                
                daily_earnings.append({
                    'date': forecast['date'],
                    'predicted_packages': driver_packages,
                    'predicted_earnings': daily_earning,
                    'confidence': forecast['confidence']
                })
                
                total_earnings += daily_earning
            
            # Calculate weekly breakdown
            weekly_earnings = self._calculate_weekly_breakdown(daily_earnings)
            
            logger.info(f"Earnings forecast: ₹{total_earnings:.2f} over {forecast_days} days")
            
            return {
                'forecast_period_days': forecast_days,
                'total_predicted_earnings': total_earnings,
                'average_daily_earnings': total_earnings / forecast_days,
                'daily_breakdown': daily_earnings,
                'weekly_breakdown': weekly_earnings,
                'payment_per_package': payment_per_package
            }
        
        except Exception as e:
            logger.error(f"Earnings forecast failed: {str(e)}")
            return self._generate_fallback_earnings(forecast_days, payment_per_package)
    
    def _calculate_confidence(self, day_offset: int) -> float:
        """
        Calculate confidence score for forecast
        Confidence decreases with forecast horizon
        """
        base_confidence = 0.95
        decay_rate = 0.01
        confidence = base_confidence * np.exp(-decay_rate * day_offset)
        return round(confidence, 3)
    
    def _calculate_weekly_breakdown(self, daily_earnings: List[Dict]) -> List[Dict]:
        """
        Aggregate daily earnings into weekly breakdown
        """
        weekly = []
        current_week = []
        week_num = 1
        
        for i, day in enumerate(daily_earnings):
            current_week.append(day)
            
            # Every 7 days or last day
            if (i + 1) % 7 == 0 or i == len(daily_earnings) - 1:
                week_total = sum(d['predicted_earnings'] for d in current_week)
                week_packages = sum(d['predicted_packages'] for d in current_week)
                
                weekly.append({
                    'week_number': week_num,
                    'start_date': current_week[0]['date'],
                    'end_date': current_week[-1]['date'],
                    'total_earnings': week_total,
                    'total_packages': week_packages,
                    'days_in_week': len(current_week)
                })
                
                current_week = []
                week_num += 1
        
        return weekly
    
    def _generate_fallback_forecast(self, days: int) -> List[Dict]:
        """
        Generate fallback forecast using simple heuristics
        """
        base_volume = 100
        forecasts = []
        
        for day in range(days):
            forecast_date = datetime.now().date() + timedelta(days=day + 1)
            
            # Simple pattern: higher on weekdays, lower on weekends
            day_of_week = forecast_date.weekday()
            if day_of_week >= 5:  # Weekend
                volume = int(base_volume * 0.7)
            else:
                volume = base_volume
            
            forecasts.append({
                'date': forecast_date.isoformat(),
                'predicted_volume': volume,
                'day_of_week': forecast_date.strftime('%A'),
                'confidence': 0.5  # Low confidence for fallback
            })
        
        return forecasts
    
    def _generate_fallback_earnings(self, days: int, payment: float) -> Dict:
        """
        Generate fallback earnings forecast
        """
        avg_daily = 15 * payment  # Assume 15 packages per day
        total = avg_daily * days
        
        return {
            'forecast_period_days': days,
            'total_predicted_earnings': total,
            'average_daily_earnings': avg_daily,
            'daily_breakdown': [],
            'weekly_breakdown': [],
            'payment_per_package': payment
        }
