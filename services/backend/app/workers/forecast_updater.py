"""
Forecast Updater Worker
Updates LSTM volume forecasts at midnight daily
"""

from datetime import date, timedelta
from sqlalchemy import select, func

from app.db.session import async_session_maker
from app.db.models.package import Package
from app.ml.model_loader import ModelLoader
from app.ml.lstm_predictor import LSTMService
from app.utils.redis import get_redis_client
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


async def update_forecasts():
    """
    **INNOVATION 2: Predictive Workload Forecasting**
    
    Update LSTM volume forecasts
    Runs at midnight daily
    """
    try:
        logger.info("🔮 Starting forecast update...")
        
        async with async_session_maker() as db:
            # 1. Get historical volume data (last 60 days)
            start_date = date.today() - timedelta(days=60)
            
            result = await db.execute(
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
            
            logger.info(f"Loaded {len(historical_volumes)} days of historical data")
            
            # 2. Generate forecast using LSTM
            model_loader = ModelLoader()
            if not model_loader.is_loaded:
                await model_loader.load_all_models()
            
            lstm_service = LSTMService(model_loader)
            
            forecast = lstm_service.predict_volume_forecast(
                historical_volumes=historical_volumes,
                forecast_days=30
            )
            
            logger.info(f"Generated {len(forecast)} days of forecast")
            
            # 3. Cache forecast in Redis
            redis_client = get_redis_client()
            
            import json
            cache_key = "volume_forecast:30_days"
            await redis_client.set(
                cache_key,
                json.dumps(forecast, default=str),
                ex=86400  # 24 hour expiration
            )
            
            logger.info(f"✅ Forecast cached in Redis with key: {cache_key}")
            
            # 4. Log summary statistics
            total_predicted = sum(f['predicted_volume'] for f in forecast)
            avg_daily = total_predicted / len(forecast)
            
            logger.info(f"Forecast Summary:")
            logger.info(f"  Total predicted packages (30 days): {total_predicted}")
            logger.info(f"  Average daily volume: {avg_daily:.1f}")
            
            logger.info("✅ Forecast update completed successfully!")
    
    except Exception as e:
        logger.error(f"❌ Forecast update failed: {str(e)}", exc_info=True)
