"""
CORS Middleware Configuration
"""
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

def setup_cors(app):
    """Setup CORS middleware with configuration from settings"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Total-Count", "X-Page", "X-Page-Size"],
    )
