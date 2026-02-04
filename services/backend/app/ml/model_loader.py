"""
Model Loader - Central ML Model Management
Loads and manages all ML models as singletons
"""

import pickle
import os
from pathlib import Path
from typing import Optional
import asyncio

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class ModelLoader:
    """
    Singleton model loader for all ML models
    Loads models once and reuses them across the application
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self._initialized = True
        self.is_loaded = False
        
        # Model paths
        self.models_path = Path(settings.ML_MODELS_PATH)
        
        # Models
        self.xgboost_model = None
        self.lstm_model = None
        self.health_model = None
        self.shap_explainer = None
        self.scaler = None
    
    async def load_all_models(self):
        """
        Load all ML models asynchronously
        """
        if self.is_loaded:
            logger.info("Models already loaded")
            return
        
        try:
            logger.info("Loading ML models...")
            
            # Run model loading in thread pool (blocking I/O)
            await asyncio.to_thread(self._load_models_sync)
            
            self.is_loaded = True
            logger.info("✅ All ML models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load ML models: {str(e)}")
            logger.warning("⚠️ Application will use fallback predictions")
            self.is_loaded = False
    
    def _load_models_sync(self):
        """
        Synchronous model loading (runs in thread pool)
        """
        try:
            # Load XGBoost model
            xgboost_path = self.models_path / settings.XGBOOST_MODEL_PATH
            if xgboost_path.exists():
                with open(xgboost_path, 'rb') as f:
                    self.xgboost_model = pickle.load(f)
                logger.info(f"✅ Loaded XGBoost model from {xgboost_path}")
            else:
                logger.warning(f"⚠️ XGBoost model not found: {xgboost_path}")
            
            # Load LSTM model
            lstm_path = self.models_path / settings.LSTM_MODEL_PATH
            if lstm_path.exists():
                try:
                    from tensorflow import keras
                    self.lstm_model = keras.models.load_model(lstm_path)
                    logger.info(f"✅ Loaded LSTM model from {lstm_path}")
                except ImportError:
                    logger.warning("⚠️ TensorFlow not installed, LSTM model skipped")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to load LSTM model: {e}")
            else:
                logger.warning(f"⚠️ LSTM model not found: {lstm_path}")
            
            # Load Health model
            health_path = self.models_path / settings.HEALTH_MODEL_PATH
            if health_path.exists():
                with open(health_path, 'rb') as f:
                    self.health_model = pickle.load(f)
                logger.info(f"✅ Loaded Health model from {health_path}")
            else:
                logger.warning(f"⚠️ Health model not found: {health_path}")
            
            # Load SHAP explainer
            shap_path = self.models_path / settings.SHAP_EXPLAINER_PATH
            if shap_path.exists():
                with open(shap_path, 'rb') as f:
                    self.shap_explainer = pickle.load(f)
                logger.info(f"✅ Loaded SHAP explainer from {shap_path}")
            else:
                logger.warning(f"⚠️ SHAP explainer not found: {shap_path}")
            
            # Load Scaler
            scaler_path = self.models_path / settings.SCALER_PATH
            if scaler_path.exists():
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                logger.info(f"✅ Loaded Scaler from {scaler_path}")
            else:
                logger.warning(f"⚠️ Scaler not found: {scaler_path}")
            
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise
    
    def get_xgboost_model(self):
        """Get XGBoost model"""
        if self.xgboost_model is None:
            logger.warning("XGBoost model not loaded, using fallback")
        return self.xgboost_model
    
    def get_lstm_model(self):
        """Get LSTM model"""
        if self.lstm_model is None:
            logger.warning("LSTM model not loaded, using fallback")
        return self.lstm_model
    
    def get_health_model(self):
        """Get Health prediction model"""
        if self.health_model is None:
            logger.warning("Health model not loaded, using fallback")
        return self.health_model
    
    def get_shap_explainer(self):
        """Get SHAP explainer"""
        if self.shap_explainer is None:
            logger.warning("SHAP explainer not loaded, using fallback")
        return self.shap_explainer
    
    def get_scaler(self):
        """Get feature scaler"""
        if self.scaler is None:
            logger.warning("Scaler not loaded, using fallback")
        return self.scaler
