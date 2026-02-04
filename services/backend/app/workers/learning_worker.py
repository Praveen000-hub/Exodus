"""
Learning Data Export Worker
Exports data for model retraining at 11:00 PM daily
"""

import os
import pandas as pd
from datetime import date, timedelta
from sqlalchemy import select

from app.db.session import async_session_maker
from app.db.models.assignment import Assignment
from app.db.models.delivery import Delivery
from app.db.models.health_event import HealthEvent
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


async def export_learning_data():
    """
    Export data for ML model retraining
    Runs at 11:00 PM daily
    """
    try:
        logger.info("📊 Starting learning data export...")
        
        async with async_session_maker() as db:
            # Export last 30 days of data
            start_date = date.today() - timedelta(days=30)
            
            # 1. Export assignment data (for XGBoost retraining)
            result = await db.execute(
                select(Assignment).where(
                    Assignment.assignment_date >= start_date
                )
            )
            assignments = result.scalars().all()
            
            assignment_df = pd.DataFrame([
                {
                    'driver_id': a.driver_id,
                    'package_id': a.package_id,
                    'predicted_difficulty': a.predicted_difficulty,
                    'actual_difficulty': a.actual_difficulty,
                    'date': a.assignment_date
                }
                for a in assignments
            ])
            
            export_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'ml', 'data', 'processed', 'assignments_export.csv')
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            assignment_df.to_csv(export_path, index=False)
            logger.info(f"Exported {len(assignment_df)} assignment records to {export_path}")
            
            # 2. Export delivery data
            result = await db.execute(
                select(Delivery).where(
                    Delivery.created_at >= start_date
                )
            )
            deliveries = result.scalars().all()
            
            delivery_df = pd.DataFrame([
                {
                    'assignment_id': d.assignment_id,
                    'is_successful': d.is_successful,
                    'delivery_time_minutes': d.delivery_time_minutes,
                    'actual_distance_km': d.actual_distance_km,
                    'customer_rating': d.customer_rating
                }
                for d in deliveries
            ])
            
            export_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'ml', 'data', 'processed', 'deliveries_export.csv')
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            delivery_df.to_csv(export_path, index=False)
            logger.info(f"Exported {len(delivery_df)} delivery records to {export_path}")
            
            # 3. Export health data (for Random Forest retraining)
            result = await db.execute(
                select(HealthEvent).where(
                    HealthEvent.recorded_at >= start_date
                )
            )
            health_events = result.scalars().all()
            
            health_df = pd.DataFrame([
                {
                    'driver_id': h.driver_id,
                    'heart_rate': h.heart_rate_bpm,
                    'fatigue_level': h.fatigue_level,
                    'hours_worked': h.hours_worked,
                    'risk_score': h.predicted_risk_score,
                    'break_taken': h.break_taken
                }
                for h in health_events
            ])
            
            export_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'ml', 'data', 'processed', 'health_export.csv')
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            health_df.to_csv(export_path, index=False)
            logger.info(f"Exported {len(health_df)} health records to {export_path}")
            
            logger.info("✅ Learning data export completed!")
    
    except Exception as e:
        logger.error(f"❌ Learning data export failed: {str(e)}", exc_info=True)
