// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🚀 ULTIMATE FOCUS GUARDIAN - UNIFIED ACTIVITY TRACKING & PRODUCTIVITY      │
// │ Real-time Windows monitoring • Pomodoro timer • Advanced analytics • Debug │
// │ The FUCKING AMAZING unified focus management system                        │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, Square, RotateCcw, Wifi, WifiOff, Activity, Brain,
  Target, Zap, Clock, Eye, Monitor, Terminal, TrendingUp, BarChart3,
  AlertTriangle, CheckCircle2, Settings, Gauge, Signal, Cpu, RefreshCw,
  Timer, Focus, Trophy, PieChart, Globe, Code, FileText, Video,
  TestTube, Database, MessageSquare, AlertOctagon, Flame, Star
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import { XP_VALUES } from '../../shared/config/xp.config'
import { focusGuardianService } from '../../shared/services/FocusGuardianService'

// ===== ENHANCED SESSION TYPES =====
const SESSION_TYPES = {
  pomodoro: { 
    duration: 25, 
    xp: XP_VALUES.POMODORO, 
    name: "Pomodoro Focus", 
    color: "from-red-500 to-orange-500",
    icon: Brain,
    description: "25-minute focused work session"
  },
  deepWork: { 
    duration: 50, 
    xp: XP_VALUES.DEEP_WORK, 
    name: "Deep Work", 
    color: "from-purple-500 to-pink-500",
    icon: Target,
    description: "Extended 50-minute deep focus session"
  },
  sprint: {
    duration: 15,
    xp: XP_VALUES.MEDIUM,
    name: "Quick Sprint",
    color: "from-green-500 to-emerald-500", 
    icon: Zap,
    description: "High-intensity 15-minute burst"
  },
  research: {
    duration: 30,
    xp: XP_VALUES.MEDIUM,
    name: "Research Mode",
    color: "from-blue-500 to-cyan-500",
    icon: Eye,
    description: "Learning and exploration session"
  }
}

// ===== APP ICONS MAPPING =====
const APP_ICONS = {
  'firefox': Globe, 'chrome': Globe, 'safari': Globe, 'edge': Globe,
  'code': Code, 'cursor': Code, 'vim': Code, 'emacs': Code,
  'terminal': Terminal, 'cmd': Terminal, 'powershell': Terminal,
  'notepad': FileText, 'word': FileText, 'excel': FileText,
  'youtube': Video, 'netflix': Video, 'video': Video,
  'spotify': Activity, 'music': Activity,
  'steam': Trophy, 'game': Trophy,
  'default': Monitor
}

const getAppIcon = (appName) => {
  if (!appName) return APP_ICONS.default
  const name = appName.toLowerCase()
  for (const [key, icon] of Object.entries(APP_ICONS)) {
    if (name.includes(key)) return icon
  }
  return APP_ICONS.default
}

// ===== MAIN COMPONENT =====
export default function UltimateFocusGuardian({ onXPAnimation, initialTab = 'timer' }) {
  const { addXP, settings } = useGameStore()

  // ===== ACTIVE TAB STATE =====
  const [activeTab, setActiveTab] = useState(initialTab)
  
  // Update active tab when initialTab prop changes (navigation)
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])
  const tabs = [
    { id: 'timer', label: 'Timer', icon: Timer, color: 'text-red-400' },
    { id: 'activity', label: 'Live Activity', icon: Activity, color: 'text-green-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-blue-400' },
    { id: 'debug', label: 'Debug', icon: TestTube, color: 'text-purple-400' }
  ]

  // ===== CONNECTION STATE =====
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    isConnecting: false,
    lastError: null,
    connectionAttempts: 0
  })

  // ===== TIMER STATE =====
  const [currentSessionType, setCurrentSessionType] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES.pomodoro.duration * 60)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [completedSessions, setCompletedSessions] = useState(0)

  // ===== REAL-TIME ACTIVITY STATE =====
  const [currentActivity, setCurrentActivity] = useState(null)
  const [activityData, setActivityData] = useState(null)
  const [systemMetrics, setSystemMetrics] = useState(null)
  const [productivityScore, setProductivityScore] = useState(0)

  // ===== ANALYTICS STATE =====
  const [todayStats, setTodayStats] = useState({
    totalFocusTime: 0,
    productiveTime: 0,
    distractionTime: 0,
    topApps: [],
    hourlyBreakdown: Array(24).fill(0)
  })
  
  // ===== DEBUG STATE =====
  const [wsMessages, setWsMessages] = useState([])
  const [apiCalls, setApiCalls] = useState([])
  const [backendHealth, setBackendHealth] = useState(null)
  const [testResults, setTestResults] = useState({
    healthCheck: null,
    websocketConnection: null,
    activityTracking: null
  })

  // ===== HELPER FUNCTIONS =====
  const addWsMessage = useCallback((type, data) => {
    const message = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      data
    }
    setWsMessages(prev => [...prev.slice(-19), message]) // Keep last 20 messages
  }, [])

  const addApiCall = useCallback((method, endpoint, success, data) => {
    const call = {
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      success,
      data
    }
    setApiCalls(prev => [...prev.slice(-19), call]) // Keep last 20 calls
  }, [])

  // ===== CONNECTION MANAGEMENT =====
  const handleConnectionChange = useCallback((connected, error) => {
    setConnectionStatus(prev => ({
      ...prev,
      isConnected: connected,
      isConnecting: false,
      lastError: error,
      connectionAttempts: connected ? 0 : prev.connectionAttempts + 1
    }))
    
    addWsMessage('CONNECTION', { connected, error: error?.message })
    
    setTestResults(prev => ({
      ...prev,
      websocketConnection: connected ? 'PASS' : 'FAIL'
    }))

    // Auto-start monitoring when connected
    if (connected) {
      setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:8000/api/focus/start', { method: 'POST' })
          const data = await response.json()
          addApiCall('POST', '/api/focus/start', true, data)
          addWsMessage('AUTO_START', { message: 'Activity monitoring started automatically' })
        } catch (error) {
          addApiCall('POST', '/api/focus/start', false, error.message)
        }
      }, 1000)
    }
  }, [addWsMessage, addApiCall])

  const handleActivityUpdate = useCallback((activity) => {
    setCurrentActivity(activity)
    setActivityData(activity)
    addWsMessage('ACTIVITY', activity)
    
    // Update productivity score based on activity
    if (activity && activity.productivity_score !== undefined) {
      setProductivityScore(activity.productivity_score * 100)
    }
    
    setTestResults(prev => ({
      ...prev,
      activityTracking: 'PASS'
    }))
  }, [addWsMessage])

  const handleSystemMetricsUpdate = useCallback((metrics) => {
    setSystemMetrics(metrics)
    addWsMessage('METRICS', metrics)
  }, [addWsMessage])

  // ===== INITIALIZE WEBSOCKET CONNECTION =====
  useEffect(() => {
    // Reset and connect
    focusGuardianService.reset()
    focusGuardianService.onConnectionChange(handleConnectionChange)
    focusGuardianService.onActivityUpdate(handleActivityUpdate)
    focusGuardianService.onSystemMetrics(handleSystemMetricsUpdate)
    
    // Auto-connect
    focusGuardianService.connect()

    return () => {
      focusGuardianService.onConnectionChange(null)
      focusGuardianService.onActivityUpdate(null)
      focusGuardianService.onSystemMetrics(null)
    }
  }, [handleConnectionChange, handleActivityUpdate, handleSystemMetricsUpdate])

  // ===== TIMER LOGIC =====
  useEffect(() => {
    let interval = null
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSessionComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, isPaused, timeLeft])

  const handleSessionComplete = useCallback(() => {
    const session = SESSION_TYPES[currentSessionType]
    setIsActive(false)
    setIsPaused(false)
    setCompletedSessions(prev => prev + 1)
    
    // Award XP
    const result = addXP(session.xp, `${session.name} Complete`)
    if (onXPAnimation && result) {
      onXPAnimation(result.amount, result.bonusType, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }
    
    // Play completion sound
    if (settings.soundEnabled) {
      TacticalAudio.focusComplete()
    }
  }, [currentSessionType, addXP, onXPAnimation, settings.soundEnabled])

  // ===== TIMER CONTROLS =====
  const startSession = () => {
    setIsActive(true)
    setIsPaused(false)
    setSessionStartTime(Date.now())
    if (settings.soundEnabled) {
      TacticalAudio.focusStart()
    }
  }

  const pauseSession = () => {
    setIsPaused(!isPaused)
  }

  const resetSession = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(SESSION_TYPES[currentSessionType].duration * 60)
    setSessionStartTime(null)
  }

  const changeSessionType = (type) => {
    if (isActive) resetSession()
    setCurrentSessionType(type)
    setTimeLeft(SESSION_TYPES[type].duration * 60)
  }

  // ===== TESTING FUNCTIONS =====
  const testHealthCheck = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health')
      const data = await response.json()
      setBackendHealth(data)
      addApiCall('GET', '/api/health', true, data)
      setTestResults(prev => ({ ...prev, healthCheck: 'PASS' }))
    } catch (error) {
      addApiCall('GET', '/api/health', false, error.message)
      setTestResults(prev => ({ ...prev, healthCheck: 'FAIL' }))
    }
  }, [addApiCall])

  const runAllTests = async () => {
    addWsMessage('TEST', 'Running comprehensive backend tests...')
    await testHealthCheck()
    
    // Test WebSocket connection
    if (!connectionStatus.isConnected) {
      await focusGuardianService.connect()
    }
  }

  // ===== FORMAT HELPERS =====
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getConnectionStatusColor = () => {
    if (connectionStatus.isConnected) return 'text-green-400'
    if (connectionStatus.isConnecting) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getTestIcon = (result) => {
    switch (result) {
      case 'PASS': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'FAIL': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return <RefreshCw className="w-4 h-4 text-gray-400" />
    }
  }

  // ===== COMPUTED VALUES =====
  const currentSession = SESSION_TYPES[currentSessionType]
  const progress = ((currentSession.duration * 60 - timeLeft) / (currentSession.duration * 60)) * 100
  const SessionIcon = currentSession.icon

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Ultimate Focus Guardian
          </h1>
          <Focus className="w-8 h-8 text-purple-400" />
        </motion.div>
        
        {/* Live Status Bar */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className={getConnectionStatusColor()}>
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {currentActivity && (
            <div className="flex items-center gap-2 text-blue-400">
              <Activity className="w-4 h-4" />
              <span>
                Tracking: {currentActivity.active_app || 'Unknown'} 
                {currentActivity.window_title && ` - ${currentActivity.window_title.slice(0, 30)}...`}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-green-400">
            <Gauge className="w-4 h-4" />
            <span>Productivity: {Math.round(productivityScore)}%</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-900/50 rounded-xl p-1 border border-white/10">
          {tabs.map(tab => {
            const TabIcon = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg"
                  />
                )}
                <TabIcon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* TIMER TAB */}
          {activeTab === 'timer' && (
            <div className="space-y-6">
              {/* Session Type Selector */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SESSION_TYPES).map(([key, session]) => {
                  const SessionTypeIcon = session.icon
                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => changeSessionType(key)}
                      disabled={isActive && !isPaused}
                      className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
                        currentSessionType === key
                          ? 'border-white/30 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      } ${isActive && !isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${session.color} opacity-10`} />
                      <div className="relative flex items-center gap-3">
                        <SessionTypeIcon className="w-6 h-6 text-white/80" />
                        <div className="text-left">
                          <p className="font-bold text-white/90 text-sm">{session.name}</p>
                          <p className="text-xs text-white/60">{session.duration}min • +{session.xp} XP</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Main Timer Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSession.color} opacity-20`} />
                <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
                
                <div className="relative p-12 text-center">
                  {/* Progress Ring */}
                  <div className="relative w-80 h-80 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="2"
                      />
                      <motion.circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100)
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#EF4444" />
                          <stop offset="100%" stopColor="#F97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <motion.div
                          animate={isActive && !isPaused ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-6xl font-black font-mono text-white mb-2"
                        >
                          {formatTime(timeLeft)}
                        </motion.div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <SessionIcon className="w-6 h-6 text-white/60" />
                          <p className="text-xl text-white/60 uppercase tracking-wider font-bold">
                            {currentSession.name}
                          </p>
                        </div>
                        <p className="text-sm text-white/40">{currentSession.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-6">
                    {!isActive ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startSession}
                        className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-bold text-xl text-white transition-colors"
                      >
                        <Play className="w-6 h-6" />
                        Start Session
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={pauseSession}
                          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-colors ${
                            isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                          }`}
                        >
                          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetSession}
                          className="flex items-center gap-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-bold text-white transition-colors"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Reset
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Session Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">Sessions Today</h3>
                  </div>
                  <p className="text-3xl font-black text-yellow-400 font-mono">{completedSessions}</p>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">XP Available</h3>
                  </div>
                  <p className="text-3xl font-black text-blue-400 font-mono">+{currentSession.xp}</p>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Progress</h3>
                  </div>
                  <p className="text-3xl font-black text-green-400 font-mono">{Math.round(progress)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* LIVE ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Activity */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  Live Activity Monitor
                </h2>
                
                {currentActivity ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                      {(() => {
                        const AppIcon = getAppIcon(currentActivity.active_app)
                        return <AppIcon className="w-8 h-8 text-blue-400" />
                      })()}
                      <div className="flex-1">
                        <p className="font-bold text-white">{currentActivity.active_app || 'Unknown Application'}</p>
                        <p className="text-sm text-white/60 truncate">
                          {currentActivity.window_title || 'No window title'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <div className="text-2xl font-black text-green-400">
                          {Math.round(productivityScore)}%
                        </div>
                        <div className="text-xs text-white/50">Productivity</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                        <div className="text-2xl font-black text-blue-400">
                          {currentActivity.elapsed_seconds || 0}s
                        </div>
                        <div className="text-xs text-white/50">Active Time</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activity data available</p>
                    <p className="text-sm">Check your backend connection</p>
                  </div>
                )}
              </div>

              {/* System Metrics */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-purple-400" />
                  System Metrics
                </h2>
                
                {systemMetrics ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">CPU Usage:</span>
                      <span className="text-white font-mono">{systemMetrics.cpu_percent || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Memory:</span>
                      <span className="text-white font-mono">{systemMetrics.memory_percent || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Active Processes:</span>
                      <span className="text-white font-mono">{systemMetrics.process_count || 0}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <Gauge className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No system metrics available</p>
                  </div>
                )}
              </div>

              {/* Recent Activity Feed */}
              <div className="lg:col-span-2 bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Activity Feed
                </h2>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {wsMessages.slice(-10).reverse().map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-sm"
                    >
                      <span className="text-white/40 font-mono">{msg.timestamp}</span>
                      <span className={`font-bold uppercase px-2 py-1 rounded text-xs ${
                        msg.type === 'CONNECTION' ? 'bg-blue-500/20 text-blue-400' :
                        msg.type === 'ACTIVITY' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {msg.type}
                      </span>
                      <span className="text-white/80 flex-1 truncate">
                        {typeof msg.data === 'object' ? JSON.stringify(msg.data).slice(0, 100) : msg.data}
                      </span>
                    </motion.div>
                  ))}
                  
                  {wsMessages.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No activity messages yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Placeholder Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Productivity Trend</h3>
                  </div>
                  <p className="text-3xl font-black text-green-400 font-mono">+12%</p>
                  <p className="text-sm text-white/60">vs last week</p>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Focus Time Today</h3>
                  </div>
                  <p className="text-3xl font-black text-blue-400 font-mono">2h 34m</p>
                  <p className="text-sm text-white/60">Goal: 4h</p>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Focus Score</h3>
                  </div>
                  <p className="text-3xl font-black text-purple-400 font-mono">87</p>
                  <p className="text-sm text-white/60">Excellent</p>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-white/10">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics Dashboard</h3>
                <p className="text-white/60 mb-4">Comprehensive productivity insights and detailed reports</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Daily/weekly productivity trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>App usage patterns and insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Focus session performance analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Distraction tracking and alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Productivity scoring algorithms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Custom goal tracking and reporting</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEBUG TAB */}
          {activeTab === 'debug' && (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-blue-400" />
                    Connection Status
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">WebSocket:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          connectionStatus.isConnected ? 'bg-green-500' : 
                          connectionStatus.isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                        }`} />
                        <span className="text-white font-mono text-sm">
                          {connectionStatus.isConnected ? 'Connected' : 
                           connectionStatus.isConnecting ? 'Connecting...' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                    
                    {connectionStatus.lastError && (
                      <div className="text-red-300 text-sm p-2 bg-red-900/20 rounded">
                        Error: {connectionStatus.lastError.message}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => focusGuardianService.connect()}
                        disabled={connectionStatus.isConnecting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
                      >
                        {connectionStatus.isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                        Connect
                      </button>
                      <button
                        onClick={runAllTests}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                      >
                        <TestTube className="w-4 h-4" />
                        Run Tests
                      </button>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Test Results
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Health Check:</span>
                      <div className="flex items-center gap-2">
                        {getTestIcon(testResults.healthCheck)}
                        <span className="text-sm font-mono">{testResults.healthCheck || 'NOT RUN'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">WebSocket:</span>
                      <div className="flex items-center gap-2">
                        {getTestIcon(testResults.websocketConnection)}
                        <span className="text-sm font-mono">{testResults.websocketConnection || 'NOT RUN'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Activity Tracking:</span>
                      <div className="flex items-center gap-2">
                        {getTestIcon(testResults.activityTracking)}
                        <span className="text-sm font-mono">{testResults.activityTracking || 'NOT RUN'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Calls Log */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  API Calls Log
                </h2>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {apiCalls.slice(-10).reverse().map((call, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded text-sm">
                      <span className="text-white/40 font-mono">{call.timestamp}</span>
                      <span className={`font-bold px-2 py-1 rounded text-xs ${
                        call.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        call.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {call.method}
                      </span>
                      <span className="text-white/60">{call.endpoint}</span>
                      <span className={`ml-auto ${call.success ? 'text-green-400' : 'text-red-400'}`}>
                        {call.success ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                  
                  {apiCalls.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No API calls logged yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}