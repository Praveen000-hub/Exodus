"""
SHAP Explainability Service - Innovation 5
Transparency via SHAP explanations
"""

import numpy as np
import shap
from typing import Dict, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.ml.model_loader import ModelLoader

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class SHAPService:
    """
    SHAP explainability service
    Provides feature importance explanations for model predictions
    """
    
    def __init__(self, model_loader: "ModelLoader"):
        self.explainer = model_loader.get_shap_explainer()
        self.xgboost_model = model_loader.get_xgboost_model()
        self.scaler = model_loader.get_scaler()
        
        # Feature names for interpretability
        self.feature_names = [
            "Driver Experience (days)",
            "Average Delivery Time (min)",
            "Success Rate",
            "Vehicle Capacity (kg)",
            "Package Weight (kg)",
            "Delivery Distance (km)",
            "Floor Number",
            "Is Fragile",
            "Time Window (hours)",
            "Weight/Capacity Ratio",
            "Experience/Distance Ratio",
            "Success × Weight",
            "Distance × Floor",
            "Time Pressure",
            "Complexity Score"
        ]
    
    def explain_difficulty_prediction(
        self,
        driver_features: Dict,
        package_features: Dict
    ) -> Dict:
        """
        **INNOVATION 5: Transparency via SHAP**
        
        Generate SHAP explanation for difficulty prediction
        
        Args:
            driver_features: Driver characteristics
            package_features: Package characteristics
        
        Returns:
            Dict: SHAP explanation with feature importance
        """
        try:
            # Build feature vector (same as XGBoost service)
            from app.ml.model_loader import XGBoostService
            xgb_service = XGBoostService(type('obj', (object,), {
                'get_xgboost_model': lambda: self.xgboost_model,
                'get_scaler': lambda: self.scaler
            })())
            
            features = xgb_service._build_feature_vector(driver_features, package_features)
            features_scaled = self.scaler.transform([features])
            
            # Get SHAP values
            shap_values = self.explainer.shap_values(features_scaled)
            
            # Handle different SHAP value formats
            if isinstance(shap_values, list):
                shap_values = shap_values[0]  # For tree models
            
            # Get base value and prediction
            base_value = self.explainer.expected_value
            if isinstance(base_value, np.ndarray):
                base_value = base_value[0]
            
            prediction = self.xgboost_model.predict(features_scaled)[0]
            
            # Build feature importance ranking
            feature_importance = []
            for i, (name, shap_val, feat_val) in enumerate(
                zip(self.feature_names, shap_values[0], features)
            ):
                feature_importance.append({
                    'feature_name': name,
                    'feature_value': float(feat_val),
                    'shap_value': float(shap_val),
                    'impact': 'positive' if shap_val > 0 else 'negative',
                    'importance_rank': 0  # Will be set after sorting
                })
            
            # Sort by absolute SHAP value
            feature_importance.sort(key=lambda x: abs(x['shap_value']), reverse=True)
            
            # Set importance ranks
            for rank, item in enumerate(feature_importance, 1):
                item['importance_rank'] = rank
            
            # Generate human-readable explanation
            explanation_text = self._generate_explanation_text(
                feature_importance[:5],  # Top 5 features
                prediction
            )
            
            result = {
                'predicted_difficulty': float(prediction),
                'base_difficulty': float(base_value),
                'feature_contributions': feature_importance,
                'top_positive_factors': [
                    f for f in feature_importance if f['shap_value'] > 0
                ][:3],
                'top_negative_factors': [
                    f for f in feature_importance if f['shap_value'] < 0
                ][:3],
                'explanation_text': explanation_text
            }
            
            logger.info(f"SHAP explanation generated: difficulty={prediction:.2f}")
            
            return result
        
        except Exception as e:
            logger.error(f"SHAP explanation failed: {str(e)}")
            return self._generate_fallback_explanation()
    
    def _generate_explanation_text(
        self,
        top_features: List[Dict],
        prediction: float
    ) -> str:
        """
        Generate human-readable explanation from SHAP values
        """
        lines = [f"Predicted difficulty score: {prediction:.1f}/100"]
        
        lines.append("\nKey factors influencing this score:")
        
        for i, feat in enumerate(top_features, 1):
            impact = "increases" if feat['shap_value'] > 0 else "decreases"
            lines.append(
                f"{i}. {feat['feature_name']} (value: {feat['feature_value']:.2f}) "
                f"{impact} difficulty by {abs(feat['shap_value']):.2f} points"
            )
        
        return "\n".join(lines)
    
    def _generate_fallback_explanation(self) -> Dict:
        """
        Generate fallback explanation if SHAP fails
        """
        return {
            'predicted_difficulty': 50.0,
            'base_difficulty': 50.0,
            'feature_contributions': [],
            'top_positive_factors': [],
            'top_negative_factors': [],
            'explanation_text': "Unable to generate detailed explanation at this time."
        }
