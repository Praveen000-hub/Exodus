"""
WebSocket Connection Manager
Manages active WebSocket connections
"""

from typing import Dict
from fastapi import WebSocket

from app.utils.helpers import setup_logger

logger = setup_logger(__name__)


class ConnectionManager:
    """
    Manages WebSocket connections for drivers
    """
    
    def __init__(self):
        # driver_id -> WebSocket
        self.active_connections: Dict[int, WebSocket] = {}
    
    async def connect(self, driver_id: int, websocket: WebSocket):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        self.active_connections[driver_id] = websocket
        logger.info(f"WebSocket connected: driver {driver_id}")
    
    def disconnect(self, driver_id: int):
        """Remove WebSocket connection"""
        if driver_id in self.active_connections:
            del self.active_connections[driver_id]
            logger.info(f"WebSocket disconnected: driver {driver_id}")
    
    async def send_personal_message(self, message: dict, driver_id: int):
        """Send message to specific driver"""
        if driver_id in self.active_connections:
            try:
                await self.active_connections[driver_id].send_json(message)
            except Exception as e:
                logger.error(f"Failed to send message to driver {driver_id}: {str(e)}")
                self.disconnect(driver_id)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected drivers"""
        disconnected = []
        
        for driver_id, connection in self.active_connections.items():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast to driver {driver_id}: {str(e)}")
                disconnected.append(driver_id)
        
        # Clean up disconnected clients
        for driver_id in disconnected:
            self.disconnect(driver_id)
