# =============================================================================
# database.py - Database Models and Initialization
# =============================================================================
"""
SQLite database models for Control Station OS backend.
Stores activity logs, focus sessions, and analytics data.
Complements existing localStorage approach in React frontend.
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import logging

from config.settings import settings

logger = logging.getLogger(__name__)

# Database setup
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class ActivityLog(Base):
    """Activity log entries from focus tracking."""
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # For multi-user support
    app_name = Column(String, nullable=False)
    window_title = Column(Text)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    duration_seconds = Column(Float, nullable=False)
    tag = Column(String, default="Untagged")
    productivity_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class PomodoroSession(Base):
    """Pomodoro timer session records."""
    __tablename__ = "pomodoro_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    phase = Column(String, nullable=False)  # Focus, Short Break, Long Break
    planned_duration = Column(Integer, nullable=False)  # in seconds
    actual_duration = Column(Integer, nullable=False)   # in seconds
    completed = Column(Boolean, default=False)
    skipped = Column(Boolean, default=False)
    cycle_number = Column(Integer, default=1)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class FocusSession(Base):
    """Focus tracking session records."""
    __tablename__ = "focus_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    total_duration = Column(Integer, default=0)  # in seconds
    productive_duration = Column(Integer, default=0)  # in seconds
    distraction_count = Column(Integer, default=0)
    productivity_score = Column(Float, default=0.0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserAnalytics(Base):
    """Daily analytics summaries for users."""
    __tablename__ = "user_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    date = Column(String, nullable=False)  # YYYY-MM-DD format
    total_focus_time = Column(Integer, default=0)
    productive_time = Column(Integer, default=0)
    distraction_time = Column(Integer, default=0)
    pomodoro_sessions = Column(Integer, default=0)
    completed_pomodoros = Column(Integer, default=0)
    productivity_percentage = Column(Float, default=0.0)
    top_productive_app = Column(String)
    top_distraction_app = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database operations
async def init_database():
    """Initialize database tables."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions for database operations
class DatabaseManager:
    """Database operations manager."""
    
    @staticmethod
    def create_activity_log(
        user_id: str,
        app_name: str,
        window_title: str,
        start_time: datetime,
        end_time: datetime,
        duration_seconds: float,
        tag: str = "Untagged",
        productivity_score: float = 0.0
    ):
        """Create new activity log entry."""
        db = SessionLocal()
        try:
            log_entry = ActivityLog(
                user_id=user_id,
                app_name=app_name,
                window_title=window_title,
                start_time=start_time,
                end_time=end_time,
                duration_seconds=duration_seconds,
                tag=tag,
                productivity_score=productivity_score
            )
            db.add(log_entry)
            db.commit()
            db.refresh(log_entry)
            return log_entry
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create activity log: {e}")
            raise
        finally:
            db.close()
    
    @staticmethod
    def get_activity_logs(user_id: str, date_filter: str = None, limit: int = 100):
        """Get activity logs for user."""
        db = SessionLocal()
        try:
            query = db.query(ActivityLog).filter(ActivityLog.user_id == user_id)
            
            if date_filter:
                # Filter by date (YYYY-MM-DD format)
                query = query.filter(
                    ActivityLog.start_time >= f"{date_filter} 00:00:00",
                    ActivityLog.start_time < f"{date_filter} 23:59:59"
                )
            
            return query.order_by(ActivityLog.start_time.desc()).limit(limit).all()
        except Exception as e:
            logger.error(f"Failed to get activity logs: {e}")
            return []
        finally:
            db.close()
    
    @staticmethod
    def create_pomodoro_session(
        user_id: str,
        phase: str,
        planned_duration: int,
        cycle_number: int = 1
    ):
        """Create new pomodoro session."""
        db = SessionLocal()
        try:
            session = PomodoroSession(
                user_id=user_id,
                phase=phase,
                planned_duration=planned_duration,
                actual_duration=0,
                cycle_number=cycle_number,
                start_time=datetime.utcnow()
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            return session
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to create pomodoro session: {e}")
            raise
        finally:
            db.close()
    
    @staticmethod
    def update_pomodoro_session(session_id: int, **kwargs):
        """Update pomodoro session."""
        db = SessionLocal()
        try:
            session = db.query(PomodoroSession).filter(PomodoroSession.id == session_id).first()
            if session:
                for key, value in kwargs.items():
                    setattr(session, key, value)
                db.commit()
                db.refresh(session)
                return session
            return None
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update pomodoro session: {e}")
            raise
        finally:
            db.close()
    
    @staticmethod
    def get_user_analytics(user_id: str, date_filter: str):
        """Get or create user analytics for date."""
        db = SessionLocal()
        try:
            analytics = db.query(UserAnalytics).filter(
                UserAnalytics.user_id == user_id,
                UserAnalytics.date == date_filter
            ).first()
            
            if not analytics:
                analytics = UserAnalytics(
                    user_id=user_id,
                    date=date_filter
                )
                db.add(analytics)
                db.commit()
                db.refresh(analytics)
            
            return analytics
        except Exception as e:
            logger.error(f"Failed to get user analytics: {e}")
            return None
        finally:
            db.close()

# Export database manager instance
db_manager = DatabaseManager()