"""
Weather Endpoints
Provides weather data for operational insights
"""

from fastapi import APIRouter, HTTPException
from typing import Optional

from app.services.weather_service import WeatherService
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()


@router.get("/current")
async def get_current_weather(city: str = "Mumbai"):
    """
    Get current weather data for a city
    
    Args:
        city: City name (default: Mumbai)
    
    Returns:
        Current weather data including temperature, humidity, wind speed
    """
    weather_service = WeatherService()
    weather_data = await weather_service.get_current_weather(city)
    
    if not weather_data:
        raise HTTPException(
            status_code=503,
            detail="Weather data unavailable. Check API key configuration."
        )
    
    return weather_data


@router.get("/forecast")
async def get_weather_forecast(city: str = "Mumbai", days: int = 5):
    """
    Get weather forecast for next N days
    
    Args:
        city: City name (default: Mumbai)
        days: Number of days (1-5)
    
    Returns:
        List of weather forecasts
    """
    if days < 1 or days > 5:
        raise HTTPException(
            status_code=400,
            detail="Days must be between 1 and 5"
        )
    
    weather_service = WeatherService()
    forecast_data = await weather_service.get_weather_forecast(city, days)
    
    if not forecast_data:
        raise HTTPException(
            status_code=503,
            detail="Weather forecast unavailable. Check API key configuration."
        )
    
    return {
        "city": city,
        "days": days,
        "forecasts": forecast_data
    }


@router.get("/impact")
async def get_weather_impact(city: str = "Mumbai"):
    """
    Get weather impact factor on delivery volume
    
    Returns:
        Weather impact multiplier (0.5 to 1.5)
    """
    weather_service = WeatherService()
    weather_data = await weather_service.get_current_weather(city)
    impact_factor = weather_service.get_weather_impact_factor(weather_data)
    
    return {
        "city": city,
        "impact_factor": impact_factor,
        "weather": weather_data,
        "interpretation": (
            "High demand expected" if impact_factor > 1.2 else
            "Normal demand" if impact_factor >= 0.9 else
            "Lower demand expected"
        )
    }
