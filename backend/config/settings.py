# =============================================================================
# settings.py - Environment Configuration for Control Station OS Backend
# =============================================================================
"""
Environment configuration with production-ready defaults.
Integrates with existing React frontend multi-user system.
"""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings

# Project root detection
BACKEND_ROOT = Path(__file__).parent.parent
PROJECT_ROOT = BACKEND_ROOT.parent

class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # API Configuration
    api_title: str = "Control Station OS Backend"
    api_version: str = "1.0.0"
    api_description: str = "Military-grade productivity system backend with real consequences"
    
    # Server Configuration  
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = True
    reload: bool = True
    
    # CORS Configuration (for React frontend)
    cors_origins: list[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:5174",  # Alternative Vite port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ]
    
    # Database Configuration
    database_url: str = f"sqlite:///{PROJECT_ROOT}/backend/data/control_station.db"
    
    # Focus Guardian Configuration (from original modules)
    focus_update_interval: float = 1.0  # seconds
    focus_log_dir: str = str(PROJECT_ROOT / "backend" / "data" / "focus_logs")
    
    # Pomodoro Configuration (from original pomodoro_engine.py)
    pomodoro_focus_minutes: int = 25
    pomodoro_short_break_minutes: int = 5
    pomodoro_long_break_minutes: int = 15
    pomodoro_long_break_cycle: int = 4
    
    # Security Configuration
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # Notification Configuration
    notifications_enabled: bool = True
    
    # System Monitoring Configuration
    system_monitoring_enabled: bool = True
    cross_platform_support: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
settings = Settings()

# Ensure required directories exist
def ensure_directories():
    """Create required directories if they don't exist."""
    directories = [
        Path(settings.focus_log_dir),
    ]
    
    # Handle database directory separately
    if settings.database_url.startswith("sqlite:///"):
        # Extract file path from SQLite URL
        db_path = settings.database_url.replace("sqlite:///", "")
        db_dir = Path(db_path).parent
        if db_dir and str(db_dir) != ".":
            directories.append(db_dir)
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

# Initialize on import
ensure_directories()