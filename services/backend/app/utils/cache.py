"""
Cache Decorators
Caching utilities using Redis
"""

import json
import hashlib
from functools import wraps
from typing import Callable

from app.utils.redis import get_redis_client
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


def cache_result(ttl: int = 3600):
    """
    Decorator to cache function results in Redis
    
    Args:
        ttl: Time to live in seconds (default 1 hour)
    
    Usage:
        @cache_result(ttl=300)
        async def expensive_function(arg1, arg2):
            # ... expensive computation
            return result
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = _generate_cache_key(func.__name__, args, kwargs)
            
            # Try to get from cache
            redis_client = await get_redis_client()
            
            if redis_client:
                cached = await redis_client.get(cache_key)
                
                if cached:
                    logger.debug(f"Cache hit: {cache_key}")
                    return json.loads(cached)
            
            # Cache miss - call function
            logger.debug(f"Cache miss: {cache_key}")
            result = await func(*args, **kwargs)
            
            # Store in cache
            if redis_client:
                await redis_client.set(
                    cache_key,
                    json.dumps(result, default=str),
                    ex=ttl
                )
            
            return result
        
        return wrapper
    return decorator


def _generate_cache_key(func_name: str, args: tuple, kwargs: dict) -> str:
    """Generate cache key from function name and arguments"""
    # Create string representation of arguments
    args_str = json.dumps({
        'args': args,
        'kwargs': kwargs
    }, sort_keys=True, default=str)
    
    # Hash arguments
    args_hash = hashlib.md5(args_str.encode()).hexdigest()[:8]
    
    return f"cache:{func_name}:{args_hash}"
