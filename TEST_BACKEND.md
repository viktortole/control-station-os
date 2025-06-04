# 🧪 Backend Testing Guide

## Quick Start

I've overhauled the frontend Focus Guardian components to make it easy to test the Python backend. Here's how to use it:

### 1. Start the Backend (if not running)
```bash
cd backend
python main.py
```
Backend should start on http://localhost:8000

### 2. Start the Frontend
```bash
npm run dev
```
Frontend starts on http://localhost:5173

### 3. Access the Backend Test Console

**Option A: Via Navigation**
- Click on "Backend Test" in the left sidebar navigation

**Option B: Via Debug Command**
- Open Developer Tools (bottom left terminal icon in dev mode)
- Type: `view focustest`
- Press Enter

### 4. Test Backend Functionality

The Backend Test Console provides:

#### Connection Testing
- **WebSocket Connection**: Connect/disconnect to test real-time communication
- **Health Check**: Test if backend API is accessible
- **Connection Status**: Real-time indicator of backend connectivity

#### API Testing
- **Run All Tests**: Automated test of all backend endpoints
- **Health Check**: Test `/api/health` endpoint
- **Focus Status**: Test `/api/focus/status` endpoint
- **Pomodoro Status**: Test `/api/focus/pomodoro/status` endpoint

#### Pomodoro Controls
- **Start**: Test starting a pomodoro session
- **Pause**: Test pausing a session
- **Reset**: Test resetting a session
- **Refresh Status**: Test getting current status

#### Real-time Monitoring
- **WebSocket Messages**: Live log of all WebSocket messages
- **API Calls**: Log of all REST API calls with success/failure status
- **Backend Data Display**: Live view of health, focus status, and pomodoro data

#### Offline Mode
- **Automatic Fallback**: When backend unavailable, shows local system info
- **Browser Monitoring**: Local app usage tracking
- **Session History**: Offline session storage

## Backend Endpoints Tested

The component tests these key endpoints:
- `GET /api/health` - Backend health check
- `GET /api/focus/status` - Current focus tracking status
- `GET /api/focus/pomodoro/status` - Pomodoro timer status
- `POST /api/focus/pomodoro/start` - Start pomodoro
- `POST /api/focus/pomodoro/pause` - Pause pomodoro  
- `POST /api/focus/pomodoro/reset` - Reset pomodoro
- `WebSocket /ws/focus` - Real-time communication

## Expected Backend Response Examples

### Health Check Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-04T04:28:48.823867",
  "version": "1.0.0", 
  "environment": "development"
}
```

### Focus Status Response:
```json
{
  "active_app": "code.exe",
  "window_title": "Control Station OS - Visual Studio Code",
  "elapsed_seconds": 1247,
  "is_monitoring": true,
  "productivity_score": 0.85
}
```

### Pomodoro Status Response:
```json
{
  "phase": "Focus",
  "seconds_left": 1200,
  "cycle_count": 2,
  "is_running": true,
  "auto_cycle": true,
  "configuration": {
    "focus_minutes": 25,
    "short_break_minutes": 5,
    "long_break_minutes": 15,
    "long_break_cycle": 4
  }
}
```

## Troubleshooting

### Backend Not Accessible
- Check if Python backend is running on port 8000
- Verify `backend/main.py` is running without errors
- Check `backend/server.log` for error messages

### WebSocket Connection Fails
- Backend may be running but WebSocket endpoint not working
- Check CORS settings in `backend/config/settings.py`
- Verify FastAPI WebSocket implementation in `backend/api/websocket.py`

### API Calls Fail
- Check if backend API endpoints are correctly defined
- Verify CORS allows requests from http://localhost:5173
- Check network tab in browser dev tools for detailed error messages

## Features Ready for Testing

✅ **Complete Backend Test UI** - Interactive testing console
✅ **Real-time WebSocket** - Live connection status and message logging  
✅ **REST API Testing** - All major endpoints covered
✅ **Offline Mode Fallback** - Works when backend unavailable
✅ **Error Handling** - Detailed error messages and retry logic
✅ **Debug Commands** - Easy access via developer console

The frontend is now fully prepared to help you test and debug the Python backend integration!