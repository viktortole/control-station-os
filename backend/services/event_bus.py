# =============================================================================
# event_bus.py - Event Bus System for Service Communication
# =============================================================================
"""
Event bus system to handle communication between services without circular imports.
Allows services to emit events that other services can listen to.
"""

import asyncio
import logging
from typing import Dict, List, Callable, Any
from datetime import datetime
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Event:
    """Represents an event in the system."""
    type: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str

class EventBus:
    """Central event bus for service communication."""
    
    def __init__(self):
        self._listeners: Dict[str, List[Callable]] = {}
        self._async_listeners: Dict[str, List[Callable]] = {}
        
    def subscribe(self, event_type: str, callback: Callable):
        """Subscribe to synchronous events."""
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(callback)
        logger.debug(f"Subscribed to event: {event_type}")
    
    def subscribe_async(self, event_type: str, callback: Callable):
        """Subscribe to asynchronous events."""
        if event_type not in self._async_listeners:
            self._async_listeners[event_type] = []
        self._async_listeners[event_type].append(callback)
        logger.debug(f"Subscribed to async event: {event_type}")
    
    def emit(self, event_type: str, data: Dict[str, Any], source: str = "unknown"):
        """Emit synchronous event."""
        event = Event(
            type=event_type,
            data=data,
            timestamp=datetime.utcnow(),
            source=source
        )
        
        # Call synchronous listeners
        if event_type in self._listeners:
            for callback in self._listeners[event_type]:
                try:
                    callback(event)
                except Exception as e:
                    logger.error(f"Error in event listener for {event_type}: {e}")
    
    async def emit_async(self, event_type: str, data: Dict[str, Any], source: str = "unknown"):
        """Emit asynchronous event."""
        event = Event(
            type=event_type,
            data=data,
            timestamp=datetime.utcnow(),
            source=source
        )
        
        # Call async listeners
        if event_type in self._async_listeners:
            tasks = []
            for callback in self._async_listeners[event_type]:
                try:
                    tasks.append(asyncio.create_task(callback(event)))
                except Exception as e:
                    logger.error(f"Error creating task for {event_type}: {e}")
            
            # Wait for all tasks to complete
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
        
        # Also call sync listeners
        self.emit(event_type, data, source)

# Global event bus instance
event_bus = EventBus()

# Event types
class EventTypes:
    """Event type constants."""
    FOCUS_STATUS_CHANGED = "focus_status_changed"
    FOCUS_MONITORING_STARTED = "focus_monitoring_started"
    FOCUS_MONITORING_STOPPED = "focus_monitoring_stopped"
    ACTIVITY_LOGGED = "activity_logged"
    WINDOW_CHANGED = "window_changed"
    
    POMODORO_STARTED = "pomodoro_started"
    POMODORO_PAUSED = "pomodoro_paused"
    POMODORO_COMPLETED = "pomodoro_completed"
    POMODORO_PHASE_CHANGED = "pomodoro_phase_changed"
    
    WEBSOCKET_UPDATE = "websocket_update"
    WEBSOCKET_BROADCAST = "websocket_broadcast"