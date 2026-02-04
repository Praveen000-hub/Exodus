"""
API V1 Main Router
Aggregates all v1 endpoint routers
"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    drivers,
    assignments,
    health,
    swaps,
    forecast,
    analytics,
    websocket,
    weather
)

# Create main v1 router
router = APIRouter()

# Include all sub-routers
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
router.include_router(assignments.router, prefix="/assignments", tags=["Assignments"])
router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(swaps.router, prefix="/swaps", tags=["Swaps"])
router.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
router.include_router(weather.router, prefix="/weather", tags=["Weather"])
