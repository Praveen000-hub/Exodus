"""
Weather Service
Fetches weather data from OpenWeather API for forecast enhancement
"""

import httpx
from typing import Dict, Optional
from datetime import datetime

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class WeatherService:
    """Service for fetching weather data"""
    
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.api_url = settings.WEATHER_API_URL
    
    async def get_current_weather(self, city: str = "Mumbai") -> Optional[Dict]:
        """
        Get current weather data for a city
        
        Args:
            city: City name (default: Mumbai for Indian logistics)
        
        Returns:
            Weather data dict or None if unavailable
        """
        if not self.api_key:
            logger.warning("Weather API key not configured")
            return None
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.api_url,
                    params={
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric"  # Celsius
                    },
                    timeout=5.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract relevant weather info
                    weather_info = {
                        "temperature": data["main"]["temp"],
                        "feels_like": data["main"]["feels_like"],
                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],
                        "description": data["weather"][0]["description"],
                        "wind_speed": data["wind"]["speed"],
                        "clouds": data["clouds"]["all"],
                        "timestamp": datetime.now().isoformat(),
                        "city": city
                    }
                    
                    logger.info(f"Weather data fetched for {city}: {weather_info['temperature']}°C, {weather_info['description']}")
                    return weather_info
                else:
                    logger.error(f"Weather API error: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Failed to fetch weather data: {str(e)}")
            return None
    
    async def get_weather_forecast(self, city: str = "Mumbai", days: int = 5) -> Optional[list]:
        """
        Get weather forecast for next N days
        
        Args:
            city: City name
            days: Number of days (max 5 for free tier)
        
        Returns:
            List of daily forecasts or None
        """
        if not self.api_key:
            logger.warning("Weather API key not configured")
            return None
        
        try:
            # Use forecast API endpoint
            forecast_url = "https://api.openweathermap.org/data/2.5/forecast"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    forecast_url,
                    params={
                        "q": city,
                        "appid": self.api_key,
                        "units": "metric",
                        "cnt": min(days * 8, 40)  # 8 forecasts per day (3-hour intervals)
                    },
                    timeout=5.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    forecasts = []
                    
                    for item in data["list"]:
                        forecasts.append({
                            "datetime": item["dt_txt"],
                            "temperature": item["main"]["temp"],
                            "description": item["weather"][0]["description"],
                            "wind_speed": item["wind"]["speed"],
                            "rain_probability": item.get("pop", 0) * 100  # Probability of precipitation
                        })
                    
                    logger.info(f"Weather forecast fetched for {city}: {len(forecasts)} data points")
                    return forecasts
                else:
                    logger.error(f"Weather forecast API error: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Failed to fetch weather forecast: {str(e)}")
            return None
    
    def get_weather_impact_factor(self, weather_data: Optional[Dict]) -> float:
        """
        Calculate weather impact factor on delivery volume (0.5 to 1.5)
        
        Bad weather (rain, high wind) = higher demand (more delivery orders)
        Good weather = normal demand
        
        Args:
            weather_data: Weather data dict
        
        Returns:
            Impact factor (multiplier for volume predictions)
        """
        if not weather_data:
            return 1.0  # Neutral
        
        impact = 1.0
        
        # Rain increases delivery demand
        description = weather_data.get("description", "").lower()
        if "rain" in description or "drizzle" in description:
            impact += 0.2
        elif "storm" in description or "thunder" in description:
            impact += 0.3
        
        # High wind reduces delivery efficiency
        wind_speed = weather_data.get("wind_speed", 0)
        if wind_speed > 15:  # m/s (strong wind)
            impact += 0.1
        
        # Extreme temperatures affect demand
        temp = weather_data.get("temperature", 25)
        if temp > 35 or temp < 10:  # Very hot or cold
            impact += 0.15
        
        # Cap between 0.5 and 1.5
        return max(0.5, min(1.5, impact))
