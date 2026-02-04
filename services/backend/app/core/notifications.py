"""
Push Notification Service
Firebase Cloud Messaging (FCM) integration
"""

import firebase_admin
from firebase_admin import credentials, messaging
from typing import Dict, List, Optional
import json

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class NotificationService:
    """
    FCM push notification service
    Sends real-time alerts to driver mobile apps
    """
    
    def __init__(self):
        self.initialized = False
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """
        Initialize Firebase Admin SDK
        """
        try:
            if settings.FIREBASE_CREDENTIALS_PATH:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                self.initialized = True
                logger.info("Firebase Admin SDK initialized successfully")
            else:
                logger.warning("Firebase credentials not configured - notifications disabled")
        
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            self.initialized = False
    
    async def send_notification(
        self,
        fcm_token: str,
        title: str,
        body: str,
        data: Optional[Dict] = None
    ) -> bool:
        """
        Send push notification to a single device
        
        Args:
            fcm_token: Device FCM registration token
            title: Notification title
            body: Notification body
            data: Additional data payload
        
        Returns:
            bool: True if sent successfully
        """
        if not self.initialized:
            logger.warning("Firebase not initialized - skipping notification")
            return False
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=fcm_token
            )
            
            response = messaging.send(message)
            logger.info(f"Notification sent successfully: {response}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to send notification: {str(e)}")
            return False
    
    async def send_batch_notifications(
        self,
        tokens: List[str],
        title: str,
        body: str,
        data: Optional[Dict] = None
    ) -> Dict:
        """
        Send notifications to multiple devices
        
        Args:
            tokens: List of FCM tokens
            title: Notification title
            body: Notification body
            data: Additional data payload
        
        Returns:
            Dict: Success/failure statistics
        """
        if not self.initialized:
            logger.warning("Firebase not initialized - skipping batch notifications")
            return {'success': 0, 'failure': len(tokens)}
        
        try:
            message = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                tokens=tokens
            )
            
            response = messaging.send_multicast(message)
            
            logger.info(f"Batch notification sent: {response.success_count} success, {response.failure_count} failure")
            
            return {
                'success': response.success_count,
                'failure': response.failure_count
            }
        
        except Exception as e:
            logger.error(f"Failed to send batch notifications: {str(e)}")
            return {'success': 0, 'failure': len(tokens)}
    
    async def send_health_alert(
        self,
        fcm_token: str,
        driver_name: str,
        risk_score: float,
        break_duration: int
    ) -> bool:
        """
        Send health risk alert notification
        """
        return await self.send_notification(
            fcm_token=fcm_token,
            title="⚠️ Health Alert",
            body=f"Hi {driver_name}, your health risk is {risk_score:.1f}. Take a {break_duration} min break.",
            data={
                'type': 'health_alert',
                'risk_score': str(risk_score),
                'break_duration': str(break_duration)
            }
        )
    
    async def send_assignment_notification(
        self,
        fcm_token: str,
        driver_name: str,
        package_count: int
    ) -> bool:
        """
        Send new assignment notification
        """
        return await self.send_notification(
            fcm_token=fcm_token,
            title="📦 New Assignments",
            body=f"Hi {driver_name}, you have {package_count} new packages to deliver today.",
            data={
                'type': 'new_assignment',
                'package_count': str(package_count)
            }
        )
    
    async def send_swap_notification(
        self,
        fcm_token: str,
        driver_name: str,
        swap_details: Dict
    ) -> bool:
        """
        Send swap request notification
        """
        return await self.send_notification(
            fcm_token=fcm_token,
            title="🔄 Swap Request",
            body=f"Hi {driver_name}, you have a new package swap request.",
            data={
                'type': 'swap_request',
                'swap_id': str(swap_details['swap_id'])
            }
        )
