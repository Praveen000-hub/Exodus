"""
Health Monitor Worker
Continuously monitors driver health (every 60 seconds)
"""

from datetime import datetime, timedelta

from app.db.session import async_session_maker
from app.db.repositories.driver_repo import DriverRepository
from app.db.repositories.health_repo import HealthRepository
from app.ml.model_loader import ModelLoader
from app.ml.health_predictor import HealthPredictionService
from app.core.notifications import NotificationService
from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


async def monitor_driver_health():
    """
    **INNOVATION 3 & 6: Health Monitoring + Break Recommendations**
    
    Monitor active drivers and send health alerts
    Runs every 60 seconds
    """
    try:
        logger.debug("💓 Running health monitoring check...")
        
        async with async_session_maker() as db:
            # 1. Get all active drivers
            driver_repo = DriverRepository(db)
            drivers = await driver_repo.get_active_drivers()
            
            if not drivers:
                return
            
            # 2. Load ML models
            model_loader = ModelLoader()
            if not model_loader.is_loaded:
                await model_loader.load_all_models()
            
            health_service = HealthPredictionService(model_loader)
            notification_service = NotificationService()
            health_repo = HealthRepository(db)
            
            # 3. Check each driver
            alerts_sent = 0
            
            for driver in drivers:
                # Get latest health event
                latest_event = await health_repo.get_latest_event(driver.id)
                
                # Skip if no recent health data
                if not latest_event:
                    continue
                
                # Skip if already alerted recently (within 15 minutes)
                if latest_event.recorded_at > datetime.utcnow() - timedelta(minutes=15):
                    if latest_event.break_recommended:
                        continue  # Already recommended break
                
                # Calculate current risk
                health_vitals = {
                    'heart_rate': latest_event.heart_rate_bpm,
                    'fatigue_level': latest_event.fatigue_level,
                    'hours_worked': latest_event.hours_worked,
                    'last_break_hours_ago': latest_event.hours_since_last_break
                }
                
                workload_features = {
                    'packages_delivered': latest_event.packages_delivered,
                    'packages_remaining': latest_event.packages_remaining,
                    'total_distance_km': latest_event.total_distance_km,
                    'avg_package_difficulty': 50.0  # Placeholder
                }
                
                risk_score = health_service.predict_health_risk(
                    health_vitals=health_vitals,
                    workload_features=workload_features
                )
                
                # Check if alert needed (high or critical risk)
                if risk_score >= settings.HEALTH_RISK_MEDIUM:
                    # Get break recommendation
                    remaining_difficulty = latest_event.packages_remaining * 50.0
                    
                    recommendation = health_service.recommend_break_duration(
                        health_risk=risk_score,
                        remaining_difficulty=remaining_difficulty,
                        hours_worked=latest_event.hours_worked
                    )
                    
                    if recommendation['should_break'] and driver.fcm_token:
                        # Send push notification
                        await notification_service.send_health_alert(
                            fcm_token=driver.fcm_token,
                            driver_name=driver.name,
                            risk_score=risk_score,
                            break_duration=recommendation['duration_minutes']
                        )
                        
                        alerts_sent += 1
                        
                        logger.info(
                            f"⚠️  Health alert sent to driver {driver.id}: "
                            f"risk={risk_score:.1f}, break={recommendation['duration_minutes']}min"
                        )
            
            if alerts_sent > 0:
                logger.info(f"✅ Sent {alerts_sent} health alerts")
    
    except Exception as e:
        logger.error(f"❌ Health monitoring failed: {str(e)}")
