# =============================================================================
# focus.py - Focus Tracking and Pomodoro API Endpoints
# =============================================================================
"""
REST API endpoints for focus tracking, productivity monitoring, and pomodoro timer.
Integrates with React frontend useGameStore and focus components.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional, Dict, Any
import logging

from services.focus_guardian.tracker import tracker
from services.focus_guardian.pomodoro import pomodoro
from config.settings import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Pydantic models for API requests/responses
class FocusSession(BaseModel):
    """Current focus session data."""
    active_app: Optional[str] = None
    window_title: Optional[str] = None
    elapsed_seconds: int = 0
    is_monitoring: bool = False
    productivity_score: float = 0.0

class PomodoroState(BaseModel):
    """Current pomodoro timer state."""
    phase: str = "Focus"  # Focus, Short Break, Long Break
    seconds_left: int = 1500  # 25 minutes default
    cycle_count: int = 0
    is_running: bool = False
    auto_cycle: bool = True

class ActivityLog(BaseModel):
    """Activity log entry."""
    app: str
    title: str
    start_time: datetime
    end_time: datetime
    duration_seconds: float
    tag: str = "Untagged"
    productivity_score: Optional[float] = None

class FocusAnalytics(BaseModel):
    """Focus analytics and productivity insights."""
    total_focused_time: int
    productivity_percentage: float
    top_apps: List[Dict[str, Any]]
    hourly_breakdown: List[int]
    distraction_count: int
    flow_sessions: int

# ===== FOCUS TRACKING ENDPOINTS =====

@router.get("/status", response_model=FocusSession)
async def get_focus_status():
    """
    Get current focus tracking status.
    Used by React frontend for real-time display.
    """
    try:
        status = await tracker.get_current_status()
        return FocusSession(**status)
    except Exception as e:
        logger.error(f"Error getting focus status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get focus status")

@router.post("/start")
async def start_focus_monitoring():
    """
    Start focus tracking and monitoring.
    Begins system monitoring and activity logging.
    """
    try:
        success = await tracker.start_monitoring()
        if success:
            return {"status": "started", "message": "Focus monitoring started"}
        else:
            raise HTTPException(status_code=400, detail="Failed to start monitoring")
    except Exception as e:
        logger.error(f"Error starting focus monitoring: {e}")
        raise HTTPException(status_code=500, detail="Failed to start monitoring")

@router.post("/stop")
async def stop_focus_monitoring():
    """
    Stop focus tracking and monitoring.
    Saves current session and stops background monitoring.
    """
    try:
        success = await tracker.stop_monitoring()
        if success:
            return {"status": "stopped", "message": "Focus monitoring stopped"}
        else:
            raise HTTPException(status_code=400, detail="Failed to stop monitoring")
    except Exception as e:
        logger.error(f"Error stopping focus monitoring: {e}")
        raise HTTPException(status_code=500, detail="Failed to stop monitoring")

@router.post("/reset")
async def reset_focus_session():
    """
    Reset current focus session.
    Clears current session data and starts fresh.
    """
    try:
        success = await tracker.reset_session()
        if success:
            return {"status": "reset", "message": "Focus session reset"}
        else:
            raise HTTPException(status_code=400, detail="Failed to reset session")
    except Exception as e:
        logger.error(f"Error resetting focus session: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset session")

# ===== ACTIVITY LOGS ENDPOINTS =====

@router.get("/logs", response_model=List[ActivityLog])
async def get_activity_logs(
    date_filter: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    limit: int = Query(100, description="Maximum number of logs to return")
):
    """
    Get activity logs for analysis and timeline display.
    Used by React frontend for productivity analytics.
    """
    try:
        target_date = date.fromisoformat(date_filter) if date_filter else date.today()
        logs = await tracker.get_activity_logs(target_date, limit)
        return [ActivityLog(**log) for log in logs]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error getting activity logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get activity logs")

@router.get("/analytics", response_model=FocusAnalytics)
async def get_focus_analytics(
    date_filter: Optional[str] = Query(None, description="Date in YYYY-MM-DD format")
):
    """
    Get focus analytics and productivity insights.
    Used by React dashboard for charts and metrics.
    """
    try:
        target_date = date.fromisoformat(date_filter) if date_filter else date.today()
        analytics = await tracker.get_analytics(target_date)
        return FocusAnalytics(**analytics)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error getting focus analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

@router.get("/activity/live")
async def get_live_activity():
    """
    Get current live activity data including active app and real-time metrics.
    """
    try:
        status = await tracker.get_current_status()
        return {
            "active_app": status.get("active_app"),
            "window_title": status.get("window_title"),
            "elapsed_seconds": status.get("elapsed_seconds", 0),
            "productivity_score": status.get("productivity_score", 0),
            "is_monitoring": status.get("is_monitoring", False),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting live activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to get live activity")

@router.get("/activity/timeline")
async def get_activity_timeline(
    date_filter: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    hours: int = Query(24, description="Number of hours to look back")
):
    """
    Get detailed activity timeline showing app switches, time spent, and productivity.
    """
    try:
        target_date = date.fromisoformat(date_filter) if date_filter else date.today()
        
        # Get activity logs
        logs = await tracker.get_activity_logs(target_date, limit=1000)
        
        # Format timeline data
        timeline = []
        for log in logs:
            timeline.append({
                "timestamp": log.get("start_time"),
                "app_name": log.get("app_name"),
                "window_title": log.get("window_title"),
                "duration_seconds": log.get("duration_seconds"),
                "productivity_score": log.get("productivity_score", 0),
                "tag": log.get("tag", "Untagged"),
                "end_time": log.get("end_time")
            })
        
        return {
            "date": target_date.isoformat(),
            "total_entries": len(timeline),
            "timeline": timeline
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error getting activity timeline: {e}")
        raise HTTPException(status_code=500, detail="Failed to get activity timeline")

@router.get("/activity/apps")
async def get_app_usage_stats(
    date_filter: Optional[str] = Query(None, description="Date in YYYY-MM-DD format")
):
    """
    Get detailed app usage statistics and rankings.
    """
    try:
        target_date = date.fromisoformat(date_filter) if date_filter else date.today()
        logs = await tracker.get_activity_logs(target_date, limit=1000)
        
        # Aggregate app usage
        app_stats = {}
        total_time = 0
        
        for log in logs:
            app_name = log.get("app_name", "Unknown")
            duration = log.get("duration_seconds", 0)
            productivity = log.get("productivity_score", 0)
            
            if app_name not in app_stats:
                app_stats[app_name] = {
                    "app_name": app_name,
                    "total_time": 0,
                    "session_count": 0,
                    "productivity_avg": 0,
                    "productivity_scores": []
                }
            
            app_stats[app_name]["total_time"] += duration
            app_stats[app_name]["session_count"] += 1
            app_stats[app_name]["productivity_scores"].append(productivity)
            total_time += duration
        
        # Calculate averages and percentages
        app_list = []
        for app_name, stats in app_stats.items():
            avg_productivity = sum(stats["productivity_scores"]) / len(stats["productivity_scores"]) if stats["productivity_scores"] else 0
            percentage = (stats["total_time"] / total_time * 100) if total_time > 0 else 0
            
            app_list.append({
                "app_name": app_name,
                "total_time": stats["total_time"],
                "session_count": stats["session_count"],
                "productivity_avg": round(avg_productivity, 2),
                "time_percentage": round(percentage, 2),
                "minutes": round(stats["total_time"] / 60, 1)
            })
        
        # Sort by time spent
        app_list.sort(key=lambda x: x["total_time"], reverse=True)
        
        return {
            "date": target_date.isoformat(),
            "total_time": total_time,
            "total_apps": len(app_list),
            "apps": app_list
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error getting app usage stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get app usage stats")

# ===== POMODORO TIMER ENDPOINTS =====

@router.get("/pomodoro/status", response_model=PomodoroState)
async def get_pomodoro_status():
    """
    Get current pomodoro timer status.
    Used by React pomodoro component for real-time display.
    """
    try:
        status = await pomodoro.get_status()
        return PomodoroState(**status)
    except Exception as e:
        logger.error(f"Error getting pomodoro status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get pomodoro status")

@router.post("/pomodoro/start")
async def start_pomodoro():
    """
    Start or resume pomodoro timer.
    """
    try:
        success = await pomodoro.start()
        if success:
            return {"status": "started", "message": "Pomodoro timer started"}
        else:
            raise HTTPException(status_code=400, detail="Failed to start pomodoro")
    except Exception as e:
        logger.error(f"Error starting pomodoro: {e}")
        raise HTTPException(status_code=500, detail="Failed to start pomodoro")

@router.post("/pomodoro/pause")
async def pause_pomodoro():
    """
    Pause pomodoro timer.
    """
    try:
        success = await pomodoro.pause()
        if success:
            return {"status": "paused", "message": "Pomodoro timer paused"}
        else:
            raise HTTPException(status_code=400, detail="Failed to pause pomodoro")
    except Exception as e:
        logger.error(f"Error pausing pomodoro: {e}")
        raise HTTPException(status_code=500, detail="Failed to pause pomodoro")

@router.post("/pomodoro/skip")
async def skip_pomodoro():
    """
    Skip current pomodoro phase and move to next.
    """
    try:
        success = await pomodoro.skip()
        if success:
            return {"status": "skipped", "message": "Pomodoro phase skipped"}
        else:
            raise HTTPException(status_code=400, detail="Failed to skip pomodoro")
    except Exception as e:
        logger.error(f"Error skipping pomodoro: {e}")
        raise HTTPException(status_code=500, detail="Failed to skip pomodoro")

@router.post("/pomodoro/reset")
async def reset_pomodoro():
    """
    Reset pomodoro timer to initial state.
    """
    try:
        success = await pomodoro.reset()
        if success:
            return {"status": "reset", "message": "Pomodoro timer reset"}
        else:
            raise HTTPException(status_code=400, detail="Failed to reset pomodoro")
    except Exception as e:
        logger.error(f"Error resetting pomodoro: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset pomodoro")

@router.post("/pomodoro/config")
async def update_pomodoro_config(
    focus_minutes: Optional[int] = None,
    short_break_minutes: Optional[int] = None,
    long_break_minutes: Optional[int] = None,
    auto_cycle: Optional[bool] = None
):
    """
    Update pomodoro timer configuration.
    """
    try:
        config = {}
        if focus_minutes is not None:
            config["focus_minutes"] = focus_minutes
        if short_break_minutes is not None:
            config["short_break_minutes"] = short_break_minutes
        if long_break_minutes is not None:
            config["long_break_minutes"] = long_break_minutes
        if auto_cycle is not None:
            config["auto_cycle"] = auto_cycle
            
        success = await pomodoro.update_config(config)
        if success:
            return {"status": "updated", "message": "Pomodoro configuration updated"}
        else:
            raise HTTPException(status_code=400, detail="Failed to update configuration")
    except Exception as e:
        logger.error(f"Error updating pomodoro config: {e}")
        raise HTTPException(status_code=500, detail="Failed to update configuration")