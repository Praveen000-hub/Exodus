"""
WebSocket Message Handlers
Handles different types of WebSocket messages
"""

from typing import Dict

from app.websocket.manager import ConnectionManager
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class WebSocketHandler:
    """
    Handles incoming WebSocket messages
    """
    
    def __init__(self, manager: ConnectionManager):
        self.manager = manager
    
    async def handle_message(self, driver_id: int, data: Dict):
        """
        Route message to appropriate handler
        
        Args:
            driver_id: Driver ID
            data: Message data with 'type' field
        """
        message_type = data.get('type')
        
        if message_type == 'ping':
            await self._handle_ping(driver_id)
        
        elif message_type == 'location_update':
            await self._handle_location_update(driver_id, data)
        
        elif message_type == 'delivery_status':
            await self._handle_delivery_status(driver_id, data)
        
        else:
            logger.warning(f"Unknown message type: {message_type}")
    
    async def _handle_ping(self, driver_id: int):
        """Handle ping/heartbeat message"""
        await self.manager.send_personal_message(
            message={'type': 'pong', 'timestamp': str(datetime.utcnow())},
            driver_id=driver_id
        )
    
    async def _handle_location_update(self, driver_id: int, data: Dict):
        """Handle GPS location update"""
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        logger.debug(f"Location update from driver {driver_id}: {latitude}, {longitude}")
        
        # Here you would update driver location in database
        # For now, just acknowledge
        await self.manager.send_personal_message(
            message={'type': 'location_received', 'status': 'ok'},
            driver_id=driver_id
        )
    
    async def _handle_delivery_status(self, driver_id: int, data: Dict):
        """Handle delivery status update"""
        package_id = data.get('package_id')
        status = data.get('status')
        
        logger.info(f"Delivery status from driver {driver_id}: package {package_id} -> {status}")
        
        # Acknowledge
        await self.manager.send_personal_message(
            message={'type': 'status_received', 'package_id': package_id},
            driver_id=driver_id
        )
