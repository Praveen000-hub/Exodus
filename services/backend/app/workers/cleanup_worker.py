"""
Cleanup Worker
Removes old data at 3:00 AM daily
"""

from datetime import datetime, timedelta
from sqlalchemy import delete

from app.db.session import async_session_maker
from app.db.models.gps_log import GPSLog
from app.db.models.health_event import HealthEvent
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


async def cleanup_old_data():
    """
    Cleanup old GPS logs and health events
    Runs at 3:00 AM daily
    """
    try:
        logger.info("🧹 Starting data cleanup...")
        
        async with async_session_maker() as db:
            # Delete GPS logs older than 30 days
            gps_cutoff = datetime.utcnow() - timedelta(days=30)
            
            result = await db.execute(
                delete(GPSLog).where(GPSLog.recorded_at < gps_cutoff)
            )
            gps_deleted = result.rowcount
            
            # Delete health events older than 90 days
            health_cutoff = datetime.utcnow() - timedelta(days=90)
            
            result = await db.execute(
                delete(HealthEvent).where(HealthEvent.recorded_at < health_cutoff)
            )
            health_deleted = result.rowcount
            
            await db.commit()
            
            logger.info(f"✅ Cleanup completed:")
            logger.info(f"  GPS logs deleted: {gps_deleted}")
            logger.info(f"  Health events deleted: {health_deleted}")
    
    except Exception as e:
        logger.error(f"❌ Data cleanup failed: {str(e)}", exc_info=True)
