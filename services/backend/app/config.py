"""
Configuration Settings
Loads environment variables and validates configuration
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # ============================================
    # APPLICATION
    # ============================================
    PROJECT_NAME: str = "FairAI Driver Assignment API"
    VERSION: str = "1.0.0"
    APP_NAME: str = "FairAI Backend"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # ============================================
    # DATABASE (PostgreSQL)
    # ============================================
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    DB_ECHO: bool = Field(default=False, env="DB_ECHO")
    DB_POOL_SIZE: int = Field(default=5, env="DB_POOL_SIZE")
    DB_MAX_OVERFLOW: int = Field(default=10, env="DB_MAX_OVERFLOW")
    DB_POOL_TIMEOUT: int = Field(default=30, env="DB_POOL_TIMEOUT")
    
    # ============================================
    # REDIS (Cache & Sessions)
    # ============================================
    REDIS_URL: str = Field(..., env="REDIS_URL")
    REDIS_DECODE_RESPONSES: bool = Field(default=True)
    
    # ============================================
    # JWT AUTHENTICATION
    # ============================================
    JWT_SECRET: str = Field(..., env="JWT_SECRET")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRE_DAYS: int = Field(default=7, env="JWT_ACCESS_TOKEN_EXPIRE_DAYS")
    
    # ============================================
    # CORS
    # ============================================
    CORS_ORIGINS: str = Field(
        default="http://localhost:3000,http://localhost:3001",
        env="CORS_ORIGINS"
    )
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string to list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Alias for cors_origins_list"""
        return self.cors_origins_list
    
    # ============================================
    # FIREBASE (Push Notifications)
    # ============================================
    FIREBASE_SERVICE_ACCOUNT_KEY: Optional[str] = Field(default=None, env="FIREBASE_SERVICE_ACCOUNT_KEY")
    
    # ============================================
    # GOOGLE MAPS
    # ============================================
    GOOGLE_MAPS_API_KEY: Optional[str] = Field(default=None, env="GOOGLE_MAPS_API_KEY")
    
    # ============================================
    # WEATHER API (OpenWeather)
    # ============================================
    WEATHER_API_KEY: Optional[str] = Field(default=None, env="WEATHER_API_KEY")
    WEATHER_API_URL: str = Field(default="https://api.openweathermap.org/data/2.5/weather", env="WEATHER_API_URL")
    
    # ============================================
    # ML MODELS
    # ============================================
    ML_MODELS_PATH: str = Field(default="../../ml/models", env="ML_MODELS_PATH")
    XGBOOST_MODEL_PATH: str = Field(default="xgboost_model.pkl")
    LSTM_MODEL_PATH: str = Field(default="lstm_model.h5")
    HEALTH_MODEL_PATH: str = Field(default="random_forest_health.pkl")
    SHAP_EXPLAINER_PATH: str = Field(default="shap_explainer.pkl")
    SCALER_PATH: str = Field(default="scaler.pkl")
    
    # ============================================
    # RATE LIMITING
    # ============================================
    RATE_LIMIT_ENABLED: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    RATE_LIMIT_PER_MINUTE: int = Field(default=100, env="RATE_LIMIT_PER_MINUTE")
    AUTH_RATE_LIMIT_PER_MINUTE: int = Field(default=5, env="AUTH_RATE_LIMIT_PER_MINUTE")
    
    # ============================================
    # WORKERS (Background Jobs)
    # ============================================
    WORKERS_ENABLED: bool = Field(default=True, env="WORKERS_ENABLED")
    ENABLE_BACKGROUND_JOBS: bool = Field(default=True, env="ENABLE_BACKGROUND_JOBS")
    ASSIGNMENT_GENERATION_TIME: str = Field(default="06:00", env="ASSIGNMENT_GENERATION_TIME")
    ASSIGNMENT_GENERATION_SCHEDULE: str = Field(default="0 6 * * *", env="ASSIGNMENT_GENERATION_SCHEDULE")
    FORECAST_UPDATE_TIME: str = Field(default="00:00", env="FORECAST_UPDATE_TIME")
    FORECAST_UPDATE_SCHEDULE: str = Field(default="0 0 * * *", env="FORECAST_UPDATE_SCHEDULE")
    LEARNING_EXPORT_SCHEDULE: str = Field(default="0 23 * * *", env="LEARNING_EXPORT_SCHEDULE")
    CLEANUP_SCHEDULE: str = Field(default="0 3 * * *", env="CLEANUP_SCHEDULE")
    HEALTH_MONITOR_INTERVAL_SECONDS: int = Field(default=60, env="HEALTH_MONITOR_INTERVAL_SECONDS")
    HEALTH_MONITOR_INTERVAL: int = Field(default=60, env="HEALTH_MONITOR_INTERVAL")
    LEARNING_WORKER_TIME: str = Field(default="23:00", env="LEARNING_WORKER_TIME")
    CLEANUP_WORKER_TIME: str = Field(default="03:00", env="CLEANUP_WORKER_TIME")
    
    # ============================================
    # FAIRNESS ALGORITHM
    # ============================================
    FAIRNESS_MAX_PACKAGES_PER_DRIVER: int = Field(default=11, env="FAIRNESS_MAX_PACKAGES_PER_DRIVER")
    FAIRNESS_MIN_PACKAGES_PER_DRIVER: int = Field(default=10, env="FAIRNESS_MIN_PACKAGES_PER_DRIVER")
    FAIRNESS_VARIANCE_THRESHOLD: float = Field(default=10.0, env="FAIRNESS_VARIANCE_THRESHOLD")
    FAIRNESS_TIMEOUT_SECONDS: int = Field(default=300, env="FAIRNESS_TIMEOUT_SECONDS")
    
    # ============================================
    # HEALTH MONITORING
    # ============================================
    HEALTH_RISK_THRESHOLD_RED: int = Field(default=75, env="HEALTH_RISK_THRESHOLD_RED")
    HEALTH_RISK_THRESHOLD_YELLOW: int = Field(default=41, env="HEALTH_RISK_THRESHOLD_YELLOW")
    
    # ============================================
    # SWAP MARKETPLACE
    # ============================================
    SWAP_MAX_PER_DAY: int = Field(default=2, env="SWAP_MAX_PER_DAY")
    SWAP_COOLDOWN_MINUTES: int = Field(default=60, env="SWAP_COOLDOWN_MINUTES")
    SWAP_NOTIFICATION_TIMEOUT_MINUTES: int = Field(default=10, env="SWAP_NOTIFICATION_TIMEOUT_MINUTES")
    
    # ============================================
    # INSURANCE (Z-Score)
    # ============================================
    INSURANCE_Z_SCORE_MODERATE_THRESHOLD: float = Field(default=2.0, env="INSURANCE_Z_SCORE_MODERATE_THRESHOLD")
    INSURANCE_Z_SCORE_SEVERE_THRESHOLD: float = Field(default=3.0, env="INSURANCE_Z_SCORE_SEVERE_THRESHOLD")
    INSURANCE_BONUS_MODERATE: float = Field(default=25.0, env="INSURANCE_BONUS_MODERATE")
    INSURANCE_BONUS_SEVERE: float = Field(default=50.0, env="INSURANCE_BONUS_SEVERE")
    
    # ============================================
    # LOGGING
    # ============================================
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # ============================================
    # SENTRY (Optional)
    # ============================================
    SENTRY_DSN: Optional[str] = Field(default=None, env="SENTRY_DSN")
    SENTRY_TRACES_SAMPLE_RATE: float = Field(default=0.1, env="SENTRY_TRACES_SAMPLE_RATE")
    
    @property
    def async_database_url(self) -> str:
        """Convert DATABASE_URL to async format for asyncpg"""
        if self.DATABASE_URL.startswith("postgresql://"):
            return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        return self.DATABASE_URL
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
