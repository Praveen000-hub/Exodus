"""
Authentication Middleware
Validates JWT tokens on protected routes
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security import decode_access_token
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Public endpoints that don't require auth
        public_paths = [
            "/docs", "/redoc", "/openapi.json",
            "/api/v1/auth/login", "/api/v1/auth/register",
            "/health", "/metrics"
        ]
        
        if request.url.path in public_paths or request.url.path.startswith("/static"):
            return await call_next(request)
        
        # Extract and validate JWT token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = decode_access_token(token)
                request.state.user_id = payload.get("sub")
                request.state.role = payload.get("role")
            except Exception as e:
                logger.warning(f"Invalid token: {e}")
        
        return await call_next(request)
