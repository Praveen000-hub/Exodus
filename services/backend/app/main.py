"""
Production FastAPI Application
Handles 7 ML-powered innovations for driver assignment system
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.config import settings
from app.api.v1 import router as api_v1_router
from app.ml.model_loader import ModelLoader
from app.workers.scheduler import BackgroundScheduler
from app.db.session import engine
from app.db.base import Base
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    """
    # STARTUP
    logger.info("🚀 Starting FastAPI application...")
    
    try:
        # 1. Load ML models (singleton pattern)
        logger.info("📦 Loading ML models...")
        model_loader = ModelLoader()
        await model_loader.load_all_models()
        app.state.model_loader = model_loader
        logger.info("✅ ML models loaded successfully")
        
        # 2. Create database tables
        logger.info("🗄️ Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database tables created")
        
        # 3. Start background workers
        logger.info("⏰ Starting background scheduler...")
        scheduler = BackgroundScheduler()
        scheduler.start()
        app.state.scheduler = scheduler
        logger.info("✅ Background scheduler started")
        
        logger.info("✅ Application startup complete!")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {str(e)}")
        raise
    
    yield
    
    # SHUTDOWN
    logger.info("🛑 Shutting down application...")
    
    try:
        # Stop scheduler
        if hasattr(app.state, 'scheduler'):
            app.state.scheduler.shutdown()
            logger.info("✅ Scheduler stopped")
        
        # Dispose database connections
        await engine.dispose()
        logger.info("✅ Database connections closed")
        
    except Exception as e:
        logger.error(f"❌ Shutdown error: {str(e)}")
    
    logger.info("✅ Application shutdown complete")


# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ML-Powered Driver Assignment Platform - 7 Innovations",
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)


# ============================================
# MIDDLEWARE CONFIGURATION
# ============================================

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Custom logging middleware
app.add_middleware(LoggingMiddleware)

# Rate limiting
app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)


# ============================================
# EXCEPTION HANDLERS
# ============================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """
    Handle validation errors
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": "Validation error",
            "error": str(exc)
        }
    )


# ============================================
# ROUTES
# ============================================

# Include API v1 router
app.include_router(
    api_v1_router,
    prefix="/api/v1"
)


# Documentation redirects (for convenience)
from fastapi.responses import RedirectResponse

@app.get("/docs")
async def redirect_docs():
    """Redirect /docs to /api/docs"""
    return RedirectResponse(url="/api/docs")

@app.get("/redoc")
async def redirect_redoc():
    """Redirect /redoc to /api/redoc"""
    return RedirectResponse(url="/api/redoc")

@app.get("/openapi.json")
async def redirect_openapi():
    """Redirect /openapi.json to /api/openapi.json"""
    return RedirectResponse(url="/api/openapi.json")


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for load balancers
    """
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint
    """
    return {
        "message": "ML-Powered Driver Assignment API",
        "version": settings.VERSION,
        "docs": "/api/docs",
        "health": "/health"
    }


# ============================================
# RUN APPLICATION
# ============================================

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
        access_log=True
    )
