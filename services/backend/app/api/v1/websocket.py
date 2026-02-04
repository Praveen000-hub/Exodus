"""
WebSocket Endpoint
Real-time updates for drivers
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.websocket.manager import ConnectionManager
from app.websocket.handlers import WebSocketHandler
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

router = APIRouter()

# Global connection manager
manager = ConnectionManager()


@router.websocket("/{driver_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    driver_id: int
):
    """
    WebSocket endpoint for real-time updates
    
    Handles:
    - Health alerts
    - Assignment updates
    - Swap notifications
    - System messages
    
    Args:
        websocket: WebSocket connection
        driver_id: Driver ID
    """
    await manager.connect(driver_id, websocket)
    
    handler = WebSocketHandler(manager)
    
    try:
        logger.info(f"WebSocket connected: driver {driver_id}")
        
        # Send welcome message
        await manager.send_personal_message(
            message={
                "type": "connected",
                "message": "WebSocket connection established",
                "driver_id": driver_id
            },
            driver_id=driver_id
        )
        
        # Keep connection alive and handle messages
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            # Handle different message types
            await handler.handle_message(driver_id, data)
    
    except WebSocketDisconnect:
        manager.disconnect(driver_id)
        logger.info(f"WebSocket disconnected: driver {driver_id}")
    
    except Exception as e:
        logger.error(f"WebSocket error for driver {driver_id}: {str(e)}")
        manager.disconnect(driver_id)
