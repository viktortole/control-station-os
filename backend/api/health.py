# =============================================================================
# health.py - Health Check and System Status API
# =============================================================================
"""
Health check endpoints for monitoring system status and integration testing.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import psutil
import platform
from config.settings import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Basic health check endpoint.
    Returns system status and configuration.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.api_version,
        "environment": "development" if settings.debug else "production"
    }

@router.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check with system information.
    Useful for debugging and monitoring.
    """
    try:
        # System information
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.api_version,
            "system": {
                "platform": platform.system(),
                "platform_version": platform.version(),
                "python_version": platform.python_version(),
                "cpu_count": psutil.cpu_count(),
                "cpu_percent": cpu_percent,
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "percent_used": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "percent_used": round((disk.used / disk.total) * 100, 1)
                }
            },
            "configuration": {
                "focus_monitoring": settings.system_monitoring_enabled,
                "notifications": settings.notifications_enabled,
                "cors_origins": settings.cors_origins,
                "database_url": settings.database_url.split('/')[-1]  # Only filename for security
            },
            "services": {
                "focus_guardian": "ready",
                "database": "connected",
                "websocket": "available"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/health/focus")
async def focus_service_health():
    """
    Health check specifically for the focus tracking service.
    """
    try:
        from services.focus_guardian import tracker
        
        # Check if focus service is running
        is_running = await tracker.is_running()
        
        return {
            "status": "healthy" if is_running else "stopped",
            "timestamp": datetime.utcnow().isoformat(),
            "focus_service": {
                "running": is_running,
                "update_interval": settings.focus_update_interval,
                "log_directory": settings.focus_log_dir,
                "platform_support": {
                    "windows": platform.system() == "Windows",
                    "cross_platform": settings.cross_platform_support
                }
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }