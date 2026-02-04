"""
Logging Middleware
Logs all incoming requests and responses
"""

import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all HTTP requests and responses
    """
    
    async def dispatch(self, request: Request, call_next):
        # Start timer
        start_time = time.time()
        
        # Get request details
        method = request.method
        path = request.url.path
        client_ip = request.client.host if request.client else "unknown"
        
        # Log request
        logger.info(f"→ {method} {path} from {client_ip}")
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log response
        status_code = response.status_code
        logger.info(
            f"← {method} {path} {status_code} "
            f"({duration:.3f}s)"
        )
        
        # Add custom headers
        response.headers["X-Process-Time"] = str(duration)
        
        return response
