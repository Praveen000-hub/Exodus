"""
Redis Client
Redis connection and utilities
"""

import redis.asyncio as redis
from typing import Optional

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

# Global Redis client
_redis_client: Optional[redis.Redis] = None


async def get_redis_client() -> redis.Redis:
    """
    Get Redis client singleton
    
    Returns:
        redis.Redis: Redis client instance
    """
    global _redis_client
    
    if _redis_client is None:
        try:
            _redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            
            # Test connection
            await _redis_client.ping()
            logger.info("✅ Redis connected successfully")
        
        except Exception as e:
            logger.error(f"❌ Redis connection failed: {str(e)}")
            _redis_client = None
    
    return _redis_client


async def close_redis_client():
    """Close Redis connection"""
    global _redis_client
    
    if _redis_client:
        await _redis_client.close()
        _redis_client = None
        logger.info("Redis connection closed")
