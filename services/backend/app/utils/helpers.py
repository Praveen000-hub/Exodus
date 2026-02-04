"""
Helper Utilities
General-purpose helper functions
"""

import logging
from functools import lru_cache


@lru_cache()
def setup_logger(name: str) -> logging.Logger:
    """
    Setup logger with consistent format
    
    Args:
        name: Logger name (usually __name__)
    
    Returns:
        logging.Logger: Configured logger
    """
    from app.config import settings
    
    logger = logging.getLogger(name)
    
    # Set level
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Create handler if not exists
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setLevel(log_level)
        
        # Format
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        
        logger.addHandler(handler)
    
    return logger
