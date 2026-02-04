"""
Forecast Service
Business logic for volume and earnings forecasting (Innovations 2, 7)
"""

from typing import List, Dict
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.ml.model_loader import ModelLoader
from app.ml.lstm_predictor import LSTMService
from app.services.weather_service import WeatherService
from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class ForecastService:
    """Forecast service"""
    
    def __init__(self, db: AsyncSession, redis_client):
        self.db = db
        self.redis = redis_client
    
    async def get_cached_forecast(self, days: int) -> List[Dict]:
        """Get cached forecast from Redis"""
        if not self.redis:
            return None
        
        cache_key = f"volume_forecast:{days}_days"
        cached = await self.redis.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        return None
    
    async def cache_forecast(self, forecast: List[Dict], days: int):
        """Cache forecast in Redis"""
        if not self.redis:
            return
        
        cache_key = f"volume_forecast:{days}_days"
        await self.redis.set(
            cache_key,
            json.dumps(forecast, default=str),
            ex=86400  # 24 hours
        )
    
    async def generate_volume_forecast(
        self,
        days: int,
        model_loader: ModelLoader
    ) -> List[Dict]:
        """
        **INNOVATION 2: Generate volume forecast**
        """
        from sqlalchemy import select, func
        from app.db.models.package import Package
        from datetime import timedelta
        
        # Get historical volumes
        start_date = date.today() - timedelta(days=60)
        
        result = await self.db.execute(
            select(
                func.date(Package.created_at).label('date'),
                func.count(Package.id).label('volume')
            ).where(
                Package.created_at >= start_date
            ).group_by(
                func.date(Package.created_at)
            ).order_by('date')
        )
        
        historical_data = result.all()
        historical_volumes = [row.volume for row in historical_data]
        
        # Get weather data to adjust forecast
        weather_service = WeatherService()
        weather_data = await weather_service.get_current_weather()
        weather_impact = weather_service.get_weather_impact_factor(weather_data)
        
        # Generate forecast
        lstm_service = LSTMService(model_loader)
        forecast = lstm_service.predict_volume_forecast(
            historical_volumes=historical_volumes,
            forecast_days=days
        )
        
        # Apply weather impact to forecast
        if weather_impact != 1.0:
            logger.info(f"Applying weather impact factor: {weather_impact:.2f}")
            for day_forecast in forecast:
                day_forecast["predicted_volume"] = int(
                    day_forecast.get("predicted_volume", 0) * weather_impact
                )
                day_forecast["weather_adjusted"] = True
                if weather_data:
                    day_forecast["weather_condition"] = weather_data.get("description")
        
        return forecast
    
    async def calculate_earnings_forecast(
        self,
        driver_id: int,
        days: int,
        model_loader: ModelLoader
    ) -> Dict:
        """
        **INNOVATION 7: Calculate earnings forecast**
        """
        from sqlalchemy import select, func
        from app.db.models.package import Package
        from app.db.models.assignment import Assignment
        from datetime import timedelta
        
        # Get historical volumes
        start_date = date.today() - timedelta(days=60)
        
        result = await self.db.execute(
            select(
                func.date(Package.created_at).label('date'),
                func.count(Package.id).label('volume')
            ).where(
                Package.created_at >= start_date
            ).group_by(
                func.date(Package.created_at)
            ).order_by('date')
        )
        
        historical_data = result.all()
        historical_volumes = [row.volume for row in historical_data]
        
        # Calculate driver's historical share
        result = await self.db.execute(
            select(func.count(Assignment.id)).where(
                Assignment.driver_id == driver_id
            )
        )
        driver_assignments = result.scalar()
        
        result = await self.db.execute(
            select(func.count(Assignment.id))
        )
        total_assignments = result.scalar()
        
        driver_share = driver_assignments / max(total_assignments, 1)
        
        # Generate earnings forecast
        lstm_service = LSTMService(model_loader)
        earnings = lstm_service.calculate_earnings_forecast(
            historical_volumes=historical_volumes,
            driver_share=driver_share,
            payment_per_package=settings.PAYMENT_PER_PACKAGE,
            forecast_days=days
        )
        
        return earnings
    
    async def generate_demand_heatmap(
        self,
        target_date: date,
        model_loader: ModelLoader
    ) -> Dict:
        """Generate demand heatmap for date"""
        # Placeholder implementation
        return {
            'target_date': target_date.isoformat(),
            'high_demand_zones': [
                {'zone': 'Zone A', 'predicted_volume': 150},
                {'zone': 'Zone B', 'predicted_volume': 120}
            ],
            'peak_hours': [9, 10, 11, 14, 15, 16],
            'total_predicted_volume': 500
        }
