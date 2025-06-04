# =============================================================================
# main.py - FastAPI Application Entry Point
# =============================================================================
"""
Control Station OS Backend - Military-grade productivity system with real consequences.

Integrates with existing React frontend:
- Multi-user authentication system
- Real-time focus tracking via WebSocket
- Smart XP calculation based on actual productivity
- System monitoring and enforcement
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from datetime import datetime

from config.settings import settings
from api import health, focus, websocket

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.debug else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    debug=settings.debug,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Configure CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all unhandled exceptions gracefully."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Include API routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(focus.router, prefix="/api/focus", tags=["focus"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with system information."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "message": "🛡️ Control Station OS Backend - Military-grade productivity system"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info(f"🚀 Starting {settings.api_title} v{settings.api_version}")
    logger.info(f"📡 Server running on {settings.host}:{settings.port}")
    logger.info(f"🔒 CORS origins: {', '.join(settings.cors_origins)}")
    
    # Initialize database
    from models.database import init_database
    await init_database()
    
    # Initialize focus guardian service
    from services.focus_guardian.tracker import tracker
    await tracker.initialize()
    
    # Start WebSocket background updates
    from api.websocket import start_background_updates, setup_websocket_listeners
    await start_background_updates()
    
    # Initialize event listeners for real-time communication
    setup_websocket_listeners()
    
    logger.info("✅ All services initialized successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    logger.info("🛑 Shutting down Control Station OS Backend...")
    
    # Stop WebSocket background updates
    from api.websocket import stop_background_updates
    await stop_background_updates()
    
    # Stop focus guardian service
    from services.focus_guardian.tracker import tracker
    await tracker.cleanup()
    
    logger.info("✅ Shutdown complete")

# Development server entry point
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level="info" if settings.debug else "warning"
    )