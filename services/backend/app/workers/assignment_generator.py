"""
Daily Assignment Generator Worker
Runs at 6:00 AM daily to generate fair assignments using PuLP
"""

from datetime import date
from typing import List, Dict
import numpy as np

from app.db.session import async_session_maker
from app.db.repositories.driver_repo import DriverRepository
from app.db.repositories.assignment_repo import AssignmentRepository
from app.db.models.package import Package, PackageStatus
from app.ml.model_loader import ModelLoader
from app.ml.xgboost_service import XGBoostService
from app.core.fairness import FairnessOptimizer
from app.core.notifications import NotificationService
from app.utils.helpers import setup_logger
from sqlalchemy import select

logger = setup_logger(__name__)


async def generate_daily_assignments():
    """
    **INNOVATION 4: Fair Package Assignment using PuLP**
    
    Generate daily assignments for all drivers
    Runs at 6:00 AM every day
    """
    try:
        logger.info("🚀 Starting daily assignment generation...")
        
        async with async_session_maker() as db:
            # 1. Get all active drivers
            driver_repo = DriverRepository(db)
            drivers = await driver_repo.get_active_drivers()
            
            if not drivers:
                logger.warning("No active drivers found")
                return
            
            driver_ids = [d.id for d in drivers]
            logger.info(f"Found {len(drivers)} active drivers")
            
            # 2. Get all pending packages
            result = await db.execute(
                select(Package).where(Package.status == PackageStatus.PENDING)
            )
            packages = list(result.scalars().all())
            
            if not packages:
                logger.warning("No pending packages found")
                return
            
            package_ids = [p.id for p in packages]
            logger.info(f"Found {len(packages)} pending packages")
            
            # 3. Build difficulty matrix using XGBoost
            logger.info("Building difficulty matrix with XGBoost...")
            model_loader = ModelLoader()
            if not model_loader.is_loaded:
                await model_loader.load_all_models()
            
            xgboost_service = XGBoostService(model_loader)
            
            # Prepare driver features
            driver_features_list = []
            for driver in drivers:
                driver_features_list.append({
                    'experience_days': driver.experience_days,
                    'avg_delivery_time': driver.avg_delivery_time_minutes,
                    'success_rate': driver.success_rate,
                    'vehicle_capacity': driver.vehicle_capacity_kg
                })
            
            # Prepare package features
            package_features_list = []
            for package in packages:
                package_features_list.append({
                    'weight': package.weight_kg,
                    'distance': package.distance_from_hub_km or 10.0,
                    'floor_number': package.floor_number,
                    'is_fragile': package.is_fragile,
                    'time_window_hours': 4  # Default
                })
            
            # Predict difficulty matrix
            difficulty_matrix = xgboost_service.predict_difficulty_batch(
                driver_features_list,
                package_features_list
            )
            
            logger.info(f"Difficulty matrix shape: {difficulty_matrix.shape}")
            
            # 4. Run PuLP optimization
            logger.info("Running PuLP fairness optimizer...")
            optimizer = FairnessOptimizer()
            
            assignments = optimizer.optimize_assignments(
                drivers=driver_ids,
                packages=package_ids,
                difficulty_matrix=difficulty_matrix
            )
            
            # 5. Save assignments to database
            logger.info("Saving assignments to database...")
            assignment_repo = AssignmentRepository(db)
            
            assignment_data = []
            today = date.today()
            
            from datetime import datetime
            for driver_id, assigned_packages in assignments.items():
                for package_id in assigned_packages:
                    # Get difficulty score from matrix
                    driver_idx = driver_ids.index(driver_id)
                    package_idx = package_ids.index(package_id)
                    difficulty = float(difficulty_matrix[driver_idx][package_idx])
                    
                    assignment_data.append({
                        'driver_id': driver_id,
                        'package_id': package_id,
                        'assignment_date': today,
                        'predicted_difficulty': difficulty,
                        'assigned_at': datetime.utcnow()
                    })
            
            created_assignments = await assignment_repo.bulk_create(assignment_data)
            await db.commit()
            
            logger.info(f"✅ Created {len(created_assignments)} assignments")
            
            # 6. Send push notifications to drivers
            logger.info("Sending notifications to drivers...")
            notification_service = NotificationService()
            
            for driver_id, assigned_packages in assignments.items():
                driver = next((d for d in drivers if d.id == driver_id), None)
                if driver and driver.fcm_token:
                    await notification_service.send_assignment_notification(
                        fcm_token=driver.fcm_token,
                        driver_name=driver.name,
                        package_count=len(assigned_packages)
                    )
            
            logger.info("✅ Daily assignment generation completed successfully!")
    
    except Exception as e:
        logger.error(f"❌ Assignment generation failed: {str(e)}", exc_info=True)
