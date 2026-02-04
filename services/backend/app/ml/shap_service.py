"""
SHAP Explainability Service - Innovation 3
Provides interpretable AI explanations for assignment decisions
"""

import shap
import numpy as np
from typing import Dict, List, Optional
import pickle

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class SHAPService:
    """
    **INNOVATION 3: SHAP-based Explainability**
    
    Generates human-readable explanations for ML predictions
    using SHAP (SHapley Additive exPlanations)
    """
    
    def __init__(self, model_loader):
        """
        Initialize SHAP service with trained model
        
        Args:
            model_loader: ModelLoader instance with loaded models
        """
        self.model_loader = model_loader
        self.explainer = None
        
    def initialize_explainer(self, background_data: np.ndarray):
        """
        Initialize SHAP explainer with background dataset
        
        Args:
            background_data: Representative sample of training data
        """
        try:
            if self.model_loader.xgboost_model is not None:
                self.explainer = shap.TreeExplainer(
                    self.model_loader.xgboost_model,
                    background_data
                )
                logger.info("SHAP explainer initialized successfully")
            else:
                logger.warning("XGBoost model not loaded, cannot initialize SHAP explainer")
        except Exception as e:
            logger.error(f"Failed to initialize SHAP explainer: {e}")
    
    def explain_prediction(
        self,
        features: np.ndarray,
        feature_names: List[str]
    ) -> Dict:
        """
        Generate SHAP explanation for a single prediction
        
        Args:
            features: Feature vector for prediction
            feature_names: Names of features
        
        Returns:
            Dict with SHAP values and base values
        """
        if self.explainer is None:
            logger.warning("SHAP explainer not initialized")
            return {
                "error": "SHAP explainer not available",
                "shap_values": None,
                "base_value": None
            }
        
        try:
            # Calculate SHAP values
            shap_values = self.explainer.shap_values(features)
            base_value = self.explainer.expected_value
            
            # Format explanation
            explanation = {
                "shap_values": shap_values.tolist() if isinstance(shap_values, np.ndarray) else shap_values,
                "base_value": float(base_value),
                "feature_contributions": {
                    feature_names[i]: float(shap_values[i])
                    for i in range(len(feature_names))
                },
                "prediction": float(base_value + np.sum(shap_values))
            }
            
            # Sort features by absolute contribution
            sorted_features = sorted(
                explanation["feature_contributions"].items(),
                key=lambda x: abs(x[1]),
                reverse=True
            )
            
            explanation["top_features"] = sorted_features[:5]
            
            return explanation
            
        except Exception as e:
            logger.error(f"SHAP explanation failed: {e}")
            return {
                "error": str(e),
                "shap_values": None,
                "base_value": None
            }
    
    def explain_batch(
        self,
        features_batch: np.ndarray,
        feature_names: List[str]
    ) -> List[Dict]:
        """
        Generate SHAP explanations for multiple predictions
        
        Args:
            features_batch: Batch of feature vectors
            feature_names: Names of features
        
        Returns:
            List of explanation dictionaries
        """
        explanations = []
        
        for features in features_batch:
            explanation = self.explain_prediction(features, feature_names)
            explanations.append(explanation)
        
        return explanations
    
    def get_feature_importance(self) -> Dict:
        """
        Get global feature importance from SHAP values
        
        Returns:
            Dict with feature importance rankings
        """
        if self.explainer is None:
            return {"error": "SHAP explainer not initialized"}
        
        try:
            # This requires computing SHAP values on a dataset
            # For now, return placeholder
            return {
                "message": "Feature importance requires background dataset",
                "method": "Run explain_batch on representative data"
            }
        except Exception as e:
            logger.error(f"Feature importance calculation failed: {e}")
            return {"error": str(e)}
    
    def generate_force_plot_data(
        self,
        features: np.ndarray,
        feature_names: List[str]
    ) -> Dict:
        """
        Generate data for SHAP force plot visualization
        
        Args:
            features: Feature vector
            feature_names: Names of features
        
        Returns:
            Dict with force plot data
        """
        explanation = self.explain_prediction(features, feature_names)
        
        if "error" in explanation:
            return explanation
        
        return {
            "base_value": explanation["base_value"],
            "prediction": explanation["prediction"],
            "features": [
                {
                    "name": name,
                    "value": float(features[i]),
                    "contribution": explanation["feature_contributions"][name]
                }
                for i, name in enumerate(feature_names)
            ]
        }


def create_shap_service(model_loader) -> SHAPService:
    """Factory function to create SHAP service"""
    return SHAPService(model_loader)
