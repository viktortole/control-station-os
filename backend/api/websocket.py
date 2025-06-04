# =============================================================================
# websocket.py - Real-time WebSocket Communication
# =============================================================================
"""
WebSocket endpoints for real-time communication between Python backend and React frontend.
Provides live updates for focus tracking, pomodoro timer, and system monitoring.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import logging
from datetime import datetime
from typing import Set

from services.focus_guardian.tracker import tracker
from services.focus_guardian.pomodoro import pomodoro
from services.event_bus import event_bus, EventTypes, Event
from config.settings import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Connection manager for WebSocket clients
class ConnectionManager:
    """Manages WebSocket connections and broadcasts with thread safety."""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self._lock = asyncio.Lock()
    
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection."""
        await websocket.accept()
        async with self._lock:
            self.active_connections.add(websocket)
            logger.info(f"WebSocket client connected. Total connections: {len(self.active_connections)}")
    
    async def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection."""
        async with self._lock:
            self.active_connections.discard(websocket)
            logger.info(f"WebSocket client disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific client."""
        try:
            message_text = json.dumps(message, default=str)
            await websocket.send_text(message_text)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            await self.disconnect(websocket)
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients with thread safety."""
        async with self._lock:
            if not self.active_connections:
                return
            
            # Create snapshot to avoid "set changed during iteration"
            connections_snapshot = list(self.active_connections)
        
        # Broadcast outside of lock to avoid deadlock
        disconnected = []
        message_text = json.dumps(message, default=str)
        
        for connection in connections_snapshot:
            try:
                await connection.send_text(message_text)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected.append(connection)
        
        # Remove disconnected clients
        if disconnected:
            async with self._lock:
                for connection in disconnected:
                    self.active_connections.discard(connection)
                logger.info(f"Removed {len(disconnected)} disconnected clients. Active: {len(self.active_connections)}")

# Global connection manager
manager = ConnectionManager()

@router.websocket("/focus")
async def focus_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time focus tracking updates.
    Sends live data to React frontend components.
    """
    await manager.connect(websocket)
    
    try:
        # Send initial status
        focus_status = await tracker.get_current_status()
        pomodoro_status = await pomodoro.get_status()
        
        await manager.send_personal_message({
            "type": "initial_status",
            "timestamp": datetime.utcnow().isoformat(),
            "focus": focus_status,
            "pomodoro": pomodoro_status
        }, websocket)
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for client message or timeout
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                message = json.loads(data)
                
                # Handle client commands
                await handle_websocket_command(message, websocket)
                
            except asyncio.TimeoutError:
                # No message received, continue loop
                continue
            except json.JSONDecodeError:
                await manager.send_personal_message({
                    "type": "error",
                    "message": "Invalid JSON format"
                }, websocket)
                
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await manager.disconnect(websocket)

async def handle_websocket_command(message: dict, websocket: WebSocket):
    """Handle commands received from WebSocket clients."""
    command = message.get("command")
    
    try:
        if command == "start_focus":
            success = await tracker.start_monitoring()
            await manager.send_personal_message({
                "type": "command_response",
                "command": command,
                "success": success,
                "message": "Focus monitoring started" if success else "Failed to start"
            }, websocket)
            
        elif command == "stop_focus":
            success = await tracker.stop_monitoring()
            await manager.send_personal_message({
                "type": "command_response",
                "command": command,
                "success": success,
                "message": "Focus monitoring stopped" if success else "Failed to stop"
            }, websocket)
            
        elif command == "start_pomodoro":
            success = await pomodoro.start()
            await manager.send_personal_message({
                "type": "command_response",
                "command": command,
                "success": success,
                "message": "Pomodoro started" if success else "Failed to start"
            }, websocket)
            
        elif command == "pause_pomodoro":
            success = await pomodoro.pause()
            await manager.send_personal_message({
                "type": "command_response",
                "command": command,
                "success": success,
                "message": "Pomodoro paused" if success else "Failed to pause"
            }, websocket)
            
        elif command == "ping":
            await manager.send_personal_message({
                "type": "pong",
                "timestamp": datetime.utcnow().isoformat()
            }, websocket)
            
        else:
            await manager.send_personal_message({
                "type": "error",
                "message": f"Unknown command: {command}"
            }, websocket)
            
    except Exception as e:
        logger.error(f"Error handling WebSocket command {command}: {e}")
        await manager.send_personal_message({
            "type": "error",
            "message": f"Command failed: {str(e)}"
        }, websocket)

# Background task to broadcast real-time updates
async def broadcast_updates():
    """Background task to send real-time updates to all connected clients."""
    while True:
        try:
            if manager.active_connections:
                # Get current status
                focus_status = await tracker.get_current_status()
                pomodoro_status = await pomodoro.get_status()
                
                # Broadcast to all clients
                await manager.broadcast({
                    "type": "status_update",
                    "timestamp": datetime.utcnow().isoformat(),
                    "focus": focus_status,
                    "pomodoro": pomodoro_status
                })
            
            # Wait before next update
            await asyncio.sleep(settings.focus_update_interval)
            
        except Exception as e:
            logger.error(f"Error in broadcast updates: {e}")
            await asyncio.sleep(5)  # Wait longer on error

# Start background update task when module is imported
background_task = None

async def start_background_updates():
    """Start the background update task."""
    global background_task
    if background_task is None:
        background_task = asyncio.create_task(broadcast_updates())
        logger.info("WebSocket background updates started")

async def stop_background_updates():
    """Stop the background update task."""
    global background_task
    if background_task:
        background_task.cancel()
        try:
            await background_task
        except asyncio.CancelledError:
            pass
        background_task = None
        logger.info("WebSocket background updates stopped")

# Event-based update system (replaces direct function calls)
async def on_websocket_event(event: Event):
    """Handle events that should be broadcast to WebSocket clients."""
    try:
        if event.type == EventTypes.FOCUS_STATUS_CHANGED:
            await manager.broadcast({
                "type": "focus_update",
                "timestamp": event.timestamp.isoformat(),
                "data": event.data
            })
        
        elif event.type == EventTypes.WINDOW_CHANGED:
            await manager.broadcast({
                "type": "window_changed",
                "timestamp": event.timestamp.isoformat(),
                "data": event.data
            })
            
        elif event.type == EventTypes.ACTIVITY_LOGGED:
            await manager.broadcast({
                "type": "activity_logged",
                "timestamp": event.timestamp.isoformat(),
                "data": event.data
            })
            
        elif event.type in [EventTypes.POMODORO_STARTED, EventTypes.POMODORO_PAUSED, 
                           EventTypes.POMODORO_COMPLETED, EventTypes.POMODORO_PHASE_CHANGED]:
            await manager.broadcast({
                "type": "pomodoro_update",
                "timestamp": event.timestamp.isoformat(),
                "data": event.data
            })
            
        elif event.type == EventTypes.WEBSOCKET_BROADCAST:
            # Generic broadcast event
            await manager.broadcast(event.data)
            
    except Exception as e:
        logger.error(f"Error handling WebSocket event {event.type}: {e}")

# Initialize event listeners
def setup_websocket_listeners():
    """Set up event listeners for WebSocket broadcasts."""
    event_bus.subscribe_async(EventTypes.FOCUS_STATUS_CHANGED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.WINDOW_CHANGED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.ACTIVITY_LOGGED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.POMODORO_STARTED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.POMODORO_PAUSED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.POMODORO_COMPLETED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.POMODORO_PHASE_CHANGED, on_websocket_event)
    event_bus.subscribe_async(EventTypes.WEBSOCKET_BROADCAST, on_websocket_event)
    logger.info("WebSocket event listeners initialized")