import pytest
from fastapi.testclient import TestClient

from config.settings import settings
from main import app


@pytest.fixture(scope="module")
def client():
    """Provide a TestClient with startup/shutdown events."""
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint_returns_expected_payload(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    payload = response.json()

    assert payload["status"] == "healthy"
    assert payload["version"] == settings.api_version
    expected_env = "development" if settings.debug else "production"
    assert payload["environment"] == expected_env
    assert "timestamp" in payload


def test_focus_status_shape(client):
    response = client.get("/api/focus/status")

    assert response.status_code == 200
    payload = response.json()

    expected_keys = {
        "active_app",
        "window_title",
        "elapsed_seconds",
        "is_monitoring",
        "productivity_score",
    }
    assert expected_keys.issubset(payload.keys())
    assert isinstance(payload["elapsed_seconds"], int)
    assert isinstance(payload["is_monitoring"], bool)


def test_pomodoro_status_includes_configuration(client):
    response = client.get("/api/focus/pomodoro/status")

    assert response.status_code == 200
    payload = response.json()

    config = payload.get("configuration")
    assert config is not None
    assert config["focus_minutes"] == settings.pomodoro_focus_minutes
    assert config["short_break_minutes"] == settings.pomodoro_short_break_minutes
    assert config["long_break_minutes"] == settings.pomodoro_long_break_minutes
    assert config["long_break_cycle"] == settings.pomodoro_long_break_cycle
    assert payload["phase"] in {"Focus", "Short Break", "Long Break"}
    assert isinstance(payload["seconds_left"], int)
    assert isinstance(payload["cycle_count"], int)
    assert isinstance(payload["is_running"], bool)
