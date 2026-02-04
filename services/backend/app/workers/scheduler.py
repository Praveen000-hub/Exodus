"""
Background Job Scheduler
APScheduler configuration for all background jobs
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class BackgroundScheduler:
    """
    Background job scheduler
    Manages all periodic tasks
    """
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self._jobs_registered = False
    
    def start(self):
        """Start the scheduler and register all jobs"""
        if not settings.ENABLE_BACKGROUND_JOBS:
            logger.warning("Background jobs disabled in configuration")
            return
        
        if not self._jobs_registered:
            self._register_jobs()
            self._jobs_registered = True
        
        self.scheduler.start()
        logger.info("✅ Background scheduler started")
    
    def shutdown(self):
        """Shutdown the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown(wait=True)
            logger.info("Background scheduler stopped")
    
    def _register_jobs(self):
        """Register all background jobs"""
        from app.workers.assignment_generator import generate_daily_assignments
        from app.workers.forecast_updater import update_forecasts
        from app.workers.health_monitor import monitor_driver_health
        from app.workers.learning_worker import export_learning_data
        from app.workers.cleanup_worker import cleanup_old_data
        
        # Job 1: Daily Assignment Generation (6:00 AM)
        self.scheduler.add_job(
            generate_daily_assignments,
            trigger=CronTrigger.from_crontab(settings.ASSIGNMENT_GENERATION_SCHEDULE),
            id='generate_assignments',
            name='Generate Daily Assignments',
            replace_existing=True
        )
        logger.info("✅ Registered: Assignment Generation (6:00 AM daily)")
        
        # Job 2: Forecast Update (12:00 AM midnight)
        self.scheduler.add_job(
            update_forecasts,
            trigger=CronTrigger.from_crontab(settings.FORECAST_UPDATE_SCHEDULE),
            id='update_forecasts',
            name='Update LSTM Forecasts',
            replace_existing=True
        )
        logger.info("✅ Registered: Forecast Update (12:00 AM daily)")
        
        # Job 3: Health Monitoring (Every 60 seconds)
        self.scheduler.add_job(
            monitor_driver_health,
            trigger=IntervalTrigger(seconds=settings.HEALTH_MONITOR_INTERVAL),
            id='health_monitor',
            name='Monitor Driver Health',
            replace_existing=True
        )
        logger.info(f"✅ Registered: Health Monitor (every {settings.HEALTH_MONITOR_INTERVAL}s)")
        
        # Job 4: Learning Data Export (11:00 PM)
        self.scheduler.add_job(
            export_learning_data,
            trigger=CronTrigger.from_crontab(settings.LEARNING_EXPORT_SCHEDULE),
            id='export_learning',
            name='Export Learning Data',
            replace_existing=True
        )
        logger.info("✅ Registered: Learning Export (11:00 PM daily)")
        
        # Job 5: Cleanup Old Data (3:00 AM)
        self.scheduler.add_job(
            cleanup_old_data,
            trigger=CronTrigger.from_crontab(settings.CLEANUP_SCHEDULE),
            id='cleanup_data',
            name='Cleanup Old Data',
            replace_existing=True
        )
        logger.info("✅ Registered: Data Cleanup (3:00 AM daily)")
    
    def get_jobs(self):
        """
        Get list of all registered jobs
        
        Returns:
            List of job dictionaries with metadata
        """
        jobs = []
        
        if not self._jobs_registered:
            return jobs
        
        for job in self.scheduler.get_jobs():
            job_info = {
                "id": job.id,
                "name": job.name,
                "trigger": str(job.trigger),
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            }
            
            # Add innovation mapping
            if "assignment" in job.id:
                job_info["innovation"] = "Innovation 1 (Fairness)"
            elif "forecast" in job.id:
                job_info["innovation"] = "Innovation 4 (LSTM Forecast)"
            elif "health" in job.id:
                job_info["innovation"] = "Innovation 5 (Health Guardian)"
            elif "learning" in job.id:
                job_info["innovation"] = "Innovation 2 (XGBoost Shadow)"
            else:
                job_info["innovation"] = "Core"
            
            jobs.append(job_info)
        
        return jobs
