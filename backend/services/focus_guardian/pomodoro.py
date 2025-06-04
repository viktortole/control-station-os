# =============================================================================
# pomodoro.py - Modernized Pomodoro Engine Service for FastAPI
# =============================================================================
"""
Modernized version of the original FocusGuardian pomodoro_engine.py for FastAPI backend.
Provides complete pomodoro timer functionality with notifications and achievement integration.

Original: DONT_EDIT_ControlStation/Modules/FocusGuardian/pomodoro_engine.py (247 lines)
Modernized: Async FastAPI service with WebSocket integration
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from plyer import notification

from config.settings import settings
from models.database import db_manager

logger = logging.getLogger(__name__)

class PomodoroService:
    """
    Modernized Pomodoro timer service.
    Handles focus/break cycles, notifications, and session tracking.
    """
    
    def __init__(self):
        # Configuration (can be updated via API)
        self.focus_minutes = settings.pomodoro_focus_minutes
        self.short_break_minutes = settings.pomodoro_short_break_minutes
        self.long_break_minutes = settings.pomodoro_long_break_minutes
        self.long_break_cycle = settings.pomodoro_long_break_cycle
        
        # Current state
        self.phase = "Focus"  # Focus, Short Break, Long Break
        self.seconds_left = self.focus_minutes * 60
        self.cycle_count = 0
        self.is_running = False
        self.auto_cycle = True
        self.current_user_id = "default"  # TODO: Get from auth
        
        # Background task
        self._timer_task: Optional[asyncio.Task] = None
        self._lock = asyncio.Lock()
        
        # Session tracking
        self.current_session_id: Optional[int] = None
        self.session_start_time: Optional[datetime] = None
    
    async def initialize(self):
        """Initialize the pomodoro service."""
        logger.info("🍅 Initializing Pomodoro Service")
        logger.info("✅ Pomodoro Service initialized")
    
    async def cleanup(self):
        """Clean up resources."""
        if self.is_running:
            await self.pause()
        logger.info("🛑 Pomodoro Service cleaned up")
    
    # ===== PUBLIC API =====
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current pomodoro status."""
        return {
            "phase": self.phase,
            "seconds_left": self.seconds_left,
            "cycle_count": self.cycle_count,
            "is_running": self.is_running,
            "auto_cycle": self.auto_cycle,
            "configuration": {
                "focus_minutes": self.focus_minutes,
                "short_break_minutes": self.short_break_minutes,
                "long_break_minutes": self.long_break_minutes,
                "long_break_cycle": self.long_break_cycle
            }
        }
    
    async def start(self) -> bool:
        """Start or resume pomodoro timer."""
        async with self._lock:
            if self.is_running:
                return True
            
            try:
                self.is_running = True
                
                # Ensure we have valid time left
                if self.seconds_left <= 0:
                    self._reset_phase_timer()
                
                # Create new session in database
                if not self.current_session_id:
                    await self._create_session()
                
                # Start timer task
                self._timer_task = asyncio.create_task(self._timer_loop())
                
                logger.info(f"▶️ Pomodoro {self.phase} started ({self.seconds_left}s)")
                await self._send_websocket_update()
                return True
                
            except Exception as e:
                logger.error(f"Failed to start pomodoro: {e}")
                self.is_running = False
                return False
    
    async def pause(self) -> bool:
        """Pause pomodoro timer."""
        async with self._lock:
            if not self.is_running:
                return True
            
            try:
                self.is_running = False
                
                if self._timer_task:
                    self._timer_task.cancel()
                    try:
                        await self._timer_task
                    except asyncio.CancelledError:
                        pass
                    self._timer_task = None
                
                # Update session in database
                if self.current_session_id:
                    await self._update_session()
                
                logger.info("⏸️ Pomodoro paused")
                await self._send_websocket_update()
                return True
                
            except Exception as e:
                logger.error(f"Failed to pause pomodoro: {e}")
                return False
    
    async def skip(self) -> bool:
        """Skip current phase and move to next."""
        async with self._lock:
            if self.is_running:
                await self.pause()
            
            try:
                # Complete current session as skipped
                if self.current_session_id:
                    await self._complete_session(skipped=True)
                
                # Move to next phase
                await self._transition_phase()
                
                logger.info(f"⏭️ Pomodoro phase skipped to {self.phase}")
                await self._send_websocket_update()
                return True
                
            except Exception as e:
                logger.error(f"Failed to skip pomodoro: {e}")
                return False
    
    async def reset(self) -> bool:
        """Reset pomodoro timer to initial state."""
        async with self._lock:
            if self.is_running:
                await self.pause()
            
            try:
                # Complete current session
                if self.current_session_id:
                    await self._complete_session(completed=False)
                
                # Reset to initial state
                self.phase = "Focus"
                self.cycle_count = 0
                self._reset_phase_timer()
                
                logger.info("🔄 Pomodoro reset")
                await self._send_websocket_update()
                return True
                
            except Exception as e:
                logger.error(f"Failed to reset pomodoro: {e}")
                return False
    
    async def update_config(self, config: Dict[str, Any]) -> bool:
        """Update pomodoro configuration."""
        try:
            if "focus_minutes" in config:
                self.focus_minutes = config["focus_minutes"]
            if "short_break_minutes" in config:
                self.short_break_minutes = config["short_break_minutes"]
            if "long_break_minutes" in config:
                self.long_break_minutes = config["long_break_minutes"]
            if "auto_cycle" in config:
                self.auto_cycle = config["auto_cycle"]
            
            # Reset current timer if not running
            if not self.is_running:
                self._reset_phase_timer()
            
            logger.info("⚙️ Pomodoro configuration updated")
            await self._send_websocket_update()
            return True
            
        except Exception as e:
            logger.error(f"Failed to update config: {e}")
            return False
    
    # ===== TIMER LOOP =====
    
    async def _timer_loop(self):
        """Main timer countdown loop."""
        logger.info(f"🔄 Starting {self.phase} timer ({self.seconds_left}s)")
        
        while self.is_running and self.seconds_left > 0:
            try:
                await asyncio.sleep(1)
                if self.is_running:  # Check again in case paused during sleep
                    self.seconds_left -= 1
                    
                    # Send periodic updates (every 10 seconds)
                    if self.seconds_left % 10 == 0:
                        await self._send_websocket_update()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Timer loop error: {e}")
                break
        
        # Timer completed naturally
        if self.is_running and self.seconds_left <= 0:
            await self._complete_session(completed=True)
            await self._transition_phase()
            
            # Auto-cycle if enabled
            if self.auto_cycle:
                await asyncio.sleep(1)  # Brief pause between phases
                await self.start()
        
        logger.info("🛑 Timer loop stopped")
    
    # ===== PHASE MANAGEMENT =====
    
    async def _transition_phase(self):
        """Transition to next pomodoro phase."""
        previous_phase = self.phase
        
        if previous_phase == "Focus":
            self.cycle_count += 1
            # Long break every N cycles, otherwise short break
            if self.cycle_count % self.long_break_cycle == 0:
                self.phase = "Long Break"
            else:
                self.phase = "Short Break"
        else:
            # Any break phase returns to focus
            self.phase = "Focus"
        
        self._reset_phase_timer()
        
        # Send notification
        await self._send_notification(f"{previous_phase} complete! Starting {self.phase}")
        
        logger.info(f"🔄 Phase transition: {previous_phase} → {self.phase} (Cycle {self.cycle_count})")
        await self._send_websocket_update()
    
    def _reset_phase_timer(self):
        """Reset timer for current phase."""
        if self.phase == "Focus":
            self.seconds_left = self.focus_minutes * 60
        elif self.phase == "Short Break":
            self.seconds_left = self.short_break_minutes * 60
        else:  # Long Break
            self.seconds_left = self.long_break_minutes * 60
    
    # ===== SESSION TRACKING =====
    
    async def _create_session(self):
        """Create new pomodoro session in database."""
        try:
            planned_duration = self.seconds_left
            session = db_manager.create_pomodoro_session(
                user_id=self.current_user_id,
                phase=self.phase,
                planned_duration=planned_duration,
                cycle_number=self.cycle_count + 1 if self.phase == "Focus" else self.cycle_count
            )
            
            self.current_session_id = session.id
            self.session_start_time = session.start_time
            logger.debug(f"Created session {self.current_session_id} for {self.phase}")
            
        except Exception as e:
            logger.error(f"Failed to create session: {e}")
    
    async def _update_session(self):
        """Update current session with elapsed time."""
        if not self.current_session_id or not self.session_start_time:
            return
        
        try:
            elapsed = (datetime.utcnow() - self.session_start_time).total_seconds()
            actual_duration = int(elapsed)
            
            db_manager.update_pomodoro_session(
                self.current_session_id,
                actual_duration=actual_duration
            )
            
            logger.debug(f"Updated session {self.current_session_id} with {actual_duration}s")
            
        except Exception as e:
            logger.error(f"Failed to update session: {e}")
    
    async def _complete_session(self, completed: bool = True, skipped: bool = False):
        """Complete current session."""
        if not self.current_session_id:
            return
        
        try:
            elapsed = 0
            if self.session_start_time:
                elapsed = (datetime.utcnow() - self.session_start_time).total_seconds()
            
            db_manager.update_pomodoro_session(
                self.current_session_id,
                actual_duration=int(elapsed),
                completed=completed,
                skipped=skipped,
                end_time=datetime.utcnow()
            )
            
            logger.debug(f"Completed session {self.current_session_id} (completed={completed}, skipped={skipped})")
            
            # Reset session tracking
            self.current_session_id = None
            self.session_start_time = None
            
            # Trigger achievements for completed focus sessions
            if completed and not skipped and self.phase == "Focus":
                await self._check_achievements()
            
        except Exception as e:
            logger.error(f"Failed to complete session: {e}")
    
    # ===== NOTIFICATIONS =====
    
    async def _send_notification(self, message: str):
        """Send desktop notification."""
        if not settings.notifications_enabled:
            return
        
        try:
            notification.notify(
                title="🍅 Pomodoro Timer",
                message=message,
                app_name="Control Station OS",
                timeout=5
            )
            logger.debug(f"Notification sent: {message}")
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
    
    # ===== ACHIEVEMENTS =====
    
    async def _check_achievements(self):
        """Check and trigger achievements for completed focus sessions."""
        try:
            # Simple achievement triggers
            if self.cycle_count == 1:
                await self._trigger_achievement("first_pomodoro", "🍅 First Pomodoro", "Completed your first focus session!")
            elif self.cycle_count == 4:
                await self._trigger_achievement("pomodoro_pro", "🏆 Pomodoro Pro", "Completed 4 focus sessions!")
            elif self.cycle_count % 10 == 0:
                await self._trigger_achievement("focus_master", "💎 Focus Master", f"Completed {self.cycle_count} focus sessions!")
            
        except Exception as e:
            logger.error(f"Failed to check achievements: {e}")
    
    async def _trigger_achievement(self, achievement_id: str, title: str, description: str):
        """Trigger achievement notification."""
        try:
            # Send notification
            await self._send_notification(f"{title}: {description}")
            
            # TODO: Integrate with React frontend achievement system
            # This would send achievement data to the frontend via WebSocket
            logger.info(f"🏆 Achievement unlocked: {title}")
            
        except Exception as e:
            logger.error(f"Failed to trigger achievement: {e}")
    
    # ===== WEBSOCKET INTEGRATION =====
    
    async def _send_websocket_update(self):
        """Send real-time update via WebSocket."""
        try:
            from api.websocket import send_pomodoro_update
            
            status = await self.get_status()
            await send_pomodoro_update(status)
        except Exception as e:
            logger.error(f"Failed to send WebSocket update: {e}")

# Global pomodoro service instance
pomodoro = PomodoroService()