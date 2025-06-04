// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 MODERN FOCUS GUARDIAN - COMPLETELY REDESIGNED FOR BACKEND INTEGRATION     │
// │ Real-time system monitoring • Advanced productivity tracking • Modern UI     │
// │ Enterprise-grade focus management with actual backend enforcement            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, Square, RotateCcw, Wifi, WifiOff, Activity, 
  Brain, Target, Zap, Clock, Eye, Monitor, Terminal, TrendingUp,
  AlertTriangle, CheckCircle2, Settings, Gauge, Signal, Cpu, RefreshCw
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import { XP_VALUES } from '../../shared/config/xp.config'

// Modern session types with enhanced visuals
const SESSION_TYPES = {
  focus: {
    name: "Focus Session",
    duration: 25,
    xp: XP_VALUES.POMODORO,
    color: "from-purple-500 to-violet-600",
    icon: Brain,
    description: "Deep focus work session"
  },
  deepwork: {
    name: "Deep Work",
    duration: 50,
    xp: XP_VALUES.DEEP_WORK,
    color: "from-blue-500 to-indigo-600", 
    icon: Target,
    description: "Extended concentration session"
  },
  sprint: {
    name: "Quick Sprint",
    duration: 15,
    xp: XP_VALUES.MEDIUM,
    color: "from-green-500 to-emerald-600",
    icon: Zap,
    description: "High-intensity burst session"
  },
  research: {
    name: "Research Mode", 
    duration: 30,
    xp: XP_VALUES.MEDIUM,
    color: "from-orange-500 to-amber-600",
    icon: Eye,
    description: "Learning and exploration"
  }
}

export default function ModernFocusGuardian({ onXPAnimation }) {
  const { addXP, settings } = useGameStore()
  
  // Connection & Backend State
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    connecting: false,
    lastError: null,
    wsConnected: false
  })
  
  // Session Management
  const [activeSession, setActiveSession] = useState(null)
  const [sessionType, setSessionType] = useState('focus')
  const [customDuration, setCustomDuration] = useState(25)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  
  // Real-time Data from Backend
  const [systemMonitoring, setSystemMonitoring] = useState({
    activeApp: null,
    windowTitle: null,
    productivityScore: 0,
    isMonitoring: false
  })
  
  // Advanced Analytics
  const [sessionStats, setSessionStats] = useState({
    todayFocusTime: 0,
    sessionsCompleted: 0,
    productivityAvg: 0,
    streakDays: 0
  })
  
  // WebSocket connection management
  const [ws, setWs] = useState(null)
  
  // Initialize backend connection
  useEffect(() => {
    connectToBackend()
    
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])
  
  const connectToBackend = useCallback(async () => {
    setBackendStatus(prev => ({ ...prev, connecting: true, lastError: null }))
    
    try {
      // Test API connectivity
      const healthResponse = await fetch('http://localhost:8000/api/health')
      if (!healthResponse.ok) throw new Error('Backend health check failed')
      
      // Get initial focus status
      const statusResponse = await fetch('http://localhost:8000/api/focus/status')
      if (statusResponse.ok) {
        const status = await statusResponse.json()
        setSystemMonitoring({
          activeApp: status.active_app,
          windowTitle: status.window_title,
          productivityScore: status.productivity_score * 100,
          isMonitoring: status.is_monitoring
        })
      }
      
      // Connect WebSocket
      const websocket = new WebSocket('ws://localhost:8000/ws/focus')
      
      websocket.onopen = () => {
        setBackendStatus(prev => ({ 
          ...prev, 
          connected: true, 
          connecting: false,
          wsConnected: true 
        }))
        setWs(websocket)
        
        // Send initial handshake
        websocket.send(JSON.stringify({
          type: 'handshake',
          data: { client: 'Modern Focus Guardian' }
        }))
      }
      
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleWebSocketMessage(message)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }
      
      websocket.onclose = () => {
        setBackendStatus(prev => ({ ...prev, wsConnected: false }))
        setWs(null)
        // Auto-reconnect after 3 seconds
        setTimeout(connectToBackend, 3000)
      }
      
      websocket.onerror = (error) => {
        setBackendStatus(prev => ({ 
          ...prev, 
          lastError: error, 
          connecting: false,
          connected: false 
        }))
      }
      
    } catch (error) {
      setBackendStatus(prev => ({ 
        ...prev, 
        lastError: error, 
        connecting: false,
        connected: false 
      }))
      // Retry after 5 seconds
      setTimeout(connectToBackend, 5000)
    }
  }, [ws])
  
  const handleWebSocketMessage = useCallback((message) => {
    switch (message.type) {
      case 'status_update':
        if (message.focus) {
          setSystemMonitoring({
            activeApp: message.focus.active_app,
            windowTitle: message.focus.window_title,
            productivityScore: message.focus.productivity_score * 100,
            isMonitoring: message.focus.is_monitoring
          })
        }
        if (message.pomodoro) {
          updatePomodoroFromBackend(message.pomodoro)
        }
        break
        
      case 'focus_update':
        setSystemMonitoring(prev => ({ ...prev, ...message.data }))
        break
        
      case 'session_complete':
        handleSessionComplete(message.data)
        break
        
      default:
        console.log('Unknown WebSocket message:', message)
    }
  }, [])
  
  const updatePomodoroFromBackend = useCallback((pomodoroData) => {
    setTimeLeft(pomodoroData.seconds_left)
    setIsRunning(pomodoroData.is_running)
    
    if (pomodoroData.is_running && !activeSession) {
      setActiveSession({
        type: sessionType,
        startTime: Date.now(),
        plannedDuration: pomodoroData.seconds_left + (SESSION_TYPES[sessionType].duration * 60 - pomodoroData.seconds_left)
      })
    }
  }, [sessionType, activeSession])
  
  // Session Controls
  const startSession = useCallback(async () => {
    if (!backendStatus.connected) {
      // Fallback to local mode
      const session = SESSION_TYPES[sessionType]
      setActiveSession({
        type: sessionType,
        startTime: Date.now(),
        plannedDuration: session.duration * 60
      })
      setTimeLeft(session.duration * 60)
      setIsRunning(true)
      setSessionStartTime(Date.now())
      return
    }
    
    try {
      // Start monitoring
      await fetch('http://localhost:8000/api/focus/start', { method: 'POST' })
      
      // Start pomodoro
      await fetch('http://localhost:8000/api/focus/pomodoro/start', { method: 'POST' })
      
      // Update local state
      const session = SESSION_TYPES[sessionType]
      setActiveSession({
        type: sessionType,
        startTime: Date.now(),
        plannedDuration: session.duration * 60
      })
      setTimeLeft(session.duration * 60)
      setIsRunning(true)
      setSessionStartTime(Date.now())
      
      // Play start sound
      if (settings.soundEnabled) {
        TacticalAudio.focusStart()
      }
      
    } catch (error) {
      console.error('Failed to start session:', error)
      // Fallback to local mode
      startSession()
    }
  }, [sessionType, backendStatus.connected, settings.soundEnabled])
  
  const pauseSession = useCallback(async () => {
    if (!backendStatus.connected) {
      setIsRunning(!isRunning)
      return
    }
    
    try {
      await fetch('http://localhost:8000/api/focus/pomodoro/pause', { method: 'POST' })
      setIsRunning(!isRunning)
    } catch (error) {
      console.error('Failed to pause session:', error)
      setIsRunning(!isRunning)
    }
  }, [isRunning, backendStatus.connected])
  
  const stopSession = useCallback(async () => {
    if (!backendStatus.connected) {
      // Local mode cleanup
      setActiveSession(null)
      setIsRunning(false)
      setTimeLeft(0)
      setSessionStartTime(null)
      return
    }
    
    try {
      await fetch('http://localhost:8000/api/focus/pomodoro/reset', { method: 'POST' })
      await fetch('http://localhost:8000/api/focus/stop', { method: 'POST' })
      
      setActiveSession(null)
      setIsRunning(false) 
      setTimeLeft(0)
      setSessionStartTime(null)
      
    } catch (error) {
      console.error('Failed to stop session:', error)
      stopSession()
    }
  }, [backendStatus.connected])
  
  const handleSessionComplete = useCallback((sessionData) => {
    const session = SESSION_TYPES[sessionType]
    const xpGained = session.xp
    
    // Award XP
    addXP(xpGained, `${session.name} completed`)
    
    // Trigger XP animation
    if (onXPAnimation) {
      onXPAnimation(xpGained, session.name, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 3
      })
    }
    
    // Play completion sound
    if (settings.soundEnabled) {
      TacticalAudio.levelUp()
    }
    
    // Update stats
    setSessionStats(prev => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1,
      todayFocusTime: prev.todayFocusTime + session.duration
    }))
    
    // Reset session
    setActiveSession(null)
    setIsRunning(false)
    setTimeLeft(0)
    setSessionStartTime(null)
    
  }, [sessionType, addXP, onXPAnimation, settings.soundEnabled])
  
  // Local timer for offline mode
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSessionComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, handleSessionComplete])
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Progress calculation
  const progress = useMemo(() => {
    if (!activeSession) return 0
    const session = SESSION_TYPES[sessionType]
    const totalTime = session.duration * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }, [activeSession, sessionType, timeLeft])
  
  const selectedSession = SESSION_TYPES[sessionType]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header with Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Focus Guardian</h1>
              <p className="text-gray-400">Advanced productivity monitoring</p>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
              {backendStatus.connected ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">Backend Connected</span>
                </>
              ) : backendStatus.connecting ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-yellow-400 text-sm font-medium">Connecting...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-400 text-sm font-medium">Offline Mode</span>
                </>
              )}
            </div>
            
            <button
              onClick={connectToBackend}
              disabled={backendStatus.connecting}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-white ${backendStatus.connecting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Session Type Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {Object.entries(SESSION_TYPES).map(([key, session]) => {
                const IconComponent = session.icon
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !activeSession && setSessionType(key)}
                    disabled={activeSession}
                    className={`relative overflow-hidden rounded-2xl p-4 border-2 transition-all ${
                      sessionType === key
                        ? 'border-white/30 bg-white/10 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    } ${activeSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${session.color} opacity-10`} />
                    <div className="relative text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-white" />
                      <h3 className="font-bold text-white text-sm">{session.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{session.duration}min • +{session.xp} XP</p>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
            
            {/* Main Timer Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedSession.color} opacity-5`} />
              
              <div className="relative p-8 text-center">
                
                {/* Progress Ring */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#timerGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <defs>
                      <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Timer Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl font-black text-white font-mono tracking-tighter"
                    >
                      {formatTime(activeSession ? timeLeft : selectedSession.duration * 60)}
                    </motion.div>
                    <p className="text-lg text-gray-400 mt-2 font-medium">
                      {activeSession ? selectedSession.name : 'Ready to Focus'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                      <span className="text-sm text-gray-500">
                        {isRunning ? 'Active' : 'Standby'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!activeSession ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startSession}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all bg-gradient-to-r ${selectedSession.color} text-white shadow-lg hover:shadow-xl`}
                    >
                      <Play className="w-6 h-6" />
                      Start {selectedSession.name}
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={pauseSession}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                          isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isRunning ? 'Pause' : 'Resume'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopSession}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                      >
                        <Square className="w-5 h-5" />
                        Stop
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar - Analytics & Monitoring */}
          <div className="space-y-6">
            
            {/* Real-time System Monitoring */}
            {backendStatus.connected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-6 border border-blue-500/20"
              >
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Live System Monitor
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Status:</span>
                    <span className={`text-sm font-bold ${systemMonitoring.isMonitoring ? 'text-green-400' : 'text-gray-400'}`}>
                      {systemMonitoring.isMonitoring ? 'Monitoring' : 'Standby'}
                    </span>
                  </div>
                  
                  {systemMonitoring.activeApp && (
                    <>
                      <div className="space-y-2">
                        <span className="text-gray-400 text-xs">Active Application:</span>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-white font-mono text-sm">{systemMonitoring.activeApp}</p>
                          {systemMonitoring.windowTitle && (
                            <p className="text-gray-400 text-xs mt-1 truncate">{systemMonitoring.windowTitle}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-xs">Productivity Score:</span>
                          <span className="text-white text-sm font-bold">{Math.round(systemMonitoring.productivityScore)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              systemMonitoring.productivityScore >= 70 ? 'bg-green-500' :
                              systemMonitoring.productivityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${systemMonitoring.productivityScore}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Session Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20"
            >
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Today's Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{sessionStats.sessionsCompleted}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{sessionStats.todayFocusTime}m</div>
                  <div className="text-xs text-gray-400">Focus Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{Math.round(sessionStats.productivityAvg)}%</div>
                  <div className="text-xs text-gray-400">Productivity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{sessionStats.streakDays}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={connectToBackend}
                  disabled={backendStatus.connecting || backendStatus.connected}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">
                    {backendStatus.connected ? 'Connected' : backendStatus.connecting ? 'Connecting...' : 'Connect Backend'}
                  </span>
                </button>
                
                {/* Backend connection error */}
                {backendStatus.lastError && (
                  <div className="text-xs text-red-400 p-2 bg-red-900/20 rounded border border-red-500/30">
                    Connection failed: Backend may not be running on port 8000
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}