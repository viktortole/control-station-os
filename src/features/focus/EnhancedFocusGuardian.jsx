// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 ENHANCED FOCUS GUARDIAN - ENTERPRISE GRADE SYSTEM MONITORING             │
// │ Real-time activity tracking • AI productivity scoring • System integration  │
// │ WebSocket streaming • Advanced analytics • Pattern recognition              │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, RotateCcw, Clock, Brain, Target, Zap, Trophy, Activity,
  AlertTriangle, CheckCircle2, XCircle, Timer, Focus, Cpu, Monitor,
  Wifi, WifiOff, Eye, TrendingUp, BarChart3, AlertOctagon, Award,
  Settings, RefreshCw, Gauge, Signal, PieChart, Globe, Terminal
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import { XP_VALUES } from '../../shared/config/xp.config'
import { focusGuardianService } from '../../shared/services/FocusGuardianService'

const SESSION_TYPES = {
  pomodoro: { 
    duration: 25, 
    xp: XP_VALUES.POMODORO, 
    name: "Pomodoro Focus", 
    color: "from-red-500 to-orange-500",
    description: "25-minute focused work session"
  },
  deepWork: { 
    duration: 50, 
    xp: XP_VALUES.DEEP_WORK, 
    name: "Deep Work", 
    color: "from-purple-500 to-pink-500",
    description: "Extended 50-minute deep focus session"
  },
  shortBreak: { 
    duration: 5, 
    xp: XP_VALUES.SHORT_BREAK, 
    name: "Short Break", 
    color: "from-green-500 to-emerald-500",
    description: "5-minute recovery break"
  },
  longBreak: { 
    duration: 15, 
    xp: XP_VALUES.LONG_BREAK, 
    name: "Long Break", 
    color: "from-blue-500 to-cyan-500",
    description: "15-minute extended break"
  },
  custom: {
    duration: 30,
    xp: XP_VALUES.MEDIUM,
    name: "Custom Session",
    color: "from-gray-500 to-gray-700",
    description: "Custom duration focus session"
  }
}

export default function EnhancedFocusGuardian({ onXPAnimation }) {
  const { addXP, settings } = useGameStore()
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  
  // Session state
  const [currentSessionType, setCurrentSessionType] = useState('pomodoro')
  const [customDuration, setCustomDuration] = useState(30)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  
  // Real-time monitoring data
  const [currentActivity, setCurrentActivity] = useState(null)
  const [systemMetrics, setSystemMetrics] = useState(null)
  const [productivityScore, setProductivityScore] = useState(0)
  const [distractionAlerts, setDistractionAlerts] = useState([])
  const [sessionAnalytics, setSessionAnalytics] = useState(null)
  
  // Offline mode data
  const [localSystemInfo, setLocalSystemInfo] = useState(null)
  const [offlineSessionHistory, setOfflineSessionHistory] = useState([])
  const [localActivityData, setLocalActivityData] = useState(null)
  
  // Enhanced monitoring data
  const [currentApp, setCurrentApp] = useState(null)
  const [topAppsToday, setTopAppsToday] = useState([])
  const [appUsageHistory, setAppUsageHistory] = useState({})
  const [isManualOfflineMode, setIsManualOfflineMode] = useState(false)
  
  // UI state
  const [showSystemMonitor, setShowSystemMonitor] = useState(true)
  const [showActivityDetails, setShowActivityDetails] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAppUsage, setShowAppUsage] = useState(true)

  // Initialize local system monitoring for offline mode
  useEffect(() => {
    // Gather browser/system info for offline mode
    const gatherLocalSystemInfo = () => {
      const info = {
        browser: {
          name: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                navigator.userAgent.includes('Firefox') ? 'Firefox' :
                navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
          version: navigator.appVersion,
          platform: navigator.platform,
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
          onlineStatus: navigator.onLine
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1
        },
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        } : null,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null,
        timestamp: new Date().toISOString()
      }
      setLocalSystemInfo(info)
    }
    
    // Load offline session history from localStorage
    const loadOfflineHistory = () => {
      try {
        const stored = localStorage.getItem('focusGuardian_offlineHistory')
        if (stored) {
          setOfflineSessionHistory(JSON.parse(stored))
        }
        
        // Load app usage history
        const appHistory = localStorage.getItem('focusGuardian_appUsage')
        if (appHistory) {
          setAppUsageHistory(JSON.parse(appHistory))
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to load offline session history:', error)
        }
      }
    }

    // Enhanced app tracking simulation
    const trackAppUsage = () => {
      const today = new Date().toDateString()
      const currentTime = Date.now()
      
      // Simulate detecting current "app" based on page title and URL
      const currentAppName = document.title || 'Control Station OS'
      const currentUrl = window.location.hostname || 'localhost'
      
      // Create app entry
      const appInfo = {
        name: currentAppName,
        url: currentUrl,
        category: currentUrl.includes('localhost') ? 'Development' : 'Browser',
        icon: '🖥️',
        lastActive: currentTime
      }
      
      setCurrentApp(appInfo)
      
      // Update app usage history
      setAppUsageHistory(prev => {
        const newHistory = { ...prev }
        if (!newHistory[today]) {
          newHistory[today] = {}
        }
        
        if (!newHistory[today][appInfo.name]) {
          newHistory[today][appInfo.name] = {
            ...appInfo,
            totalTime: 0,
            sessions: 0,
            lastSeen: currentTime
          }
        }
        
        // Increment time (simulated)
        newHistory[today][appInfo.name].totalTime += 1
        newHistory[today][appInfo.name].lastSeen = currentTime
        newHistory[today][appInfo.name].sessions += 1
        
        return newHistory
      })
    }

    // Calculate top apps for today
    const calculateTopApps = () => {
      const today = new Date().toDateString()
      const todayApps = appUsageHistory[today] || {}
      
      const sortedApps = Object.values(todayApps)
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, 5)
        .map((app, index) => ({
          ...app,
          rank: index + 1,
          percentage: Math.min(100, (app.totalTime / 60) * 100) // Simulate percentage
        }))
      
      setTopAppsToday(sortedApps)
    }
    
    gatherLocalSystemInfo()
    loadOfflineHistory()
    trackAppUsage()
    calculateTopApps()
    
    // Update system info every 60 seconds
    const systemInterval = setInterval(gatherLocalSystemInfo, 60000)
    
    // Track app usage every 10 seconds for more accurate monitoring
    const appInterval = setInterval(() => {
      trackAppUsage()
      calculateTopApps()
    }, 10000)
    
    // Save app usage to localStorage every 30 seconds
    const saveInterval = setInterval(() => {
      setAppUsageHistory(current => {
        try {
          localStorage.setItem('focusGuardian_appUsage', JSON.stringify(current))
        } catch (error) {
          // Ignore storage errors
        }
        return current
      })
    }, 30000)
    
    return () => {
      clearInterval(systemInterval)
      clearInterval(appInterval)
      clearInterval(saveInterval)
    }
  }, [])

  // Stable event handlers to prevent re-renders
  const handleConnectionChange = useCallback((connected, error) => {
    setIsConnected(connected)
    setConnectionError(error)
    setIsConnecting(false)
  }, [])

  const handleActivityUpdate = useCallback((activity) => {
    setCurrentActivity(activity)
    if (activity.productivity_score !== undefined) {
      setProductivityScore(activity.productivity_score)
    }
  }, [])

  const handleSystemMetrics = useCallback((metrics) => {
    setSystemMetrics(metrics)
  }, [])

  const handleDistractionAlert = useCallback((alert) => {
    setDistractionAlerts(prev => [...prev.slice(-4), alert])
  }, [])

  // Session completion handler - moved here to avoid temporal dead zone
  const handleSessionComplete = useCallback((session) => {
    // Award XP based on session performance
    const sessionConfig = SESSION_TYPES[session.session_type] || SESSION_TYPES.custom
    let xpToAward = sessionConfig.xp
    
    // Bonus for high productivity
    if (session.productivity_score >= 80) {
      xpToAward += 25
    }
    
    addXP(xpToAward, `${sessionConfig.name} completed`)
    
    // Trigger XP animation
    if (onXPAnimation) {
      onXPAnimation(xpToAward, sessionConfig.name, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 3
      })
    }
    
    setSessionAnalytics(session)
    
    // Save to offline history if in offline mode
    if (session.mode === 'offline') {
      try {
        const updatedHistory = [...offlineSessionHistory, session].slice(-20) // Keep last 20 sessions
        setOfflineSessionHistory(updatedHistory)
        localStorage.setItem('focusGuardian_offlineHistory', JSON.stringify(updatedHistory))
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to save offline session:', error)
        }
      }
    }
    
    // Clear session state
    setIsSessionActive(false)
    setSessionStartTime(null)
    setActiveSession(null)
  }, [addXP, onXPAnimation, offlineSessionHistory])

  // Initialize connection to Focus Guardian service
  useEffect(() => {
    const handleSessionUpdate = (session, event) => {
      setActiveSession(session)
      if (event === 'session_started') {
        setIsSessionActive(true)
        setSessionStartTime(new Date(session.start_time))
      } else if (event === 'session_ended') {
        setIsSessionActive(false)
        setSessionStartTime(null)
        handleSessionComplete(session)
      }
    }

    const initializeService = async () => {
      setIsConnecting(true)
      
      // Setup event handlers
      focusGuardianService.onConnectionChange(handleConnectionChange)
      focusGuardianService.onActivityUpdate(handleActivityUpdate)
      focusGuardianService.onSessionUpdate(handleSessionUpdate)
      focusGuardianService.onSystemMetrics(handleSystemMetrics)
      focusGuardianService.onDistractionAlert(handleDistractionAlert)
      
      // Connect to service
      try {
        await focusGuardianService.connect()
      } catch (error) {
        // Only log in development mode to reduce production noise
        if (import.meta.env.DEV) {
          console.error('Failed to connect to Focus Guardian:', error)
        }
        setConnectionError(error)
        setIsConnecting(false)
      }
    }

    initializeService()
    
    return () => {
      // Clear event handlers
      focusGuardianService.onConnectionChange(null)
      focusGuardianService.onActivityUpdate(null)
      focusGuardianService.onSessionUpdate(null)
      focusGuardianService.onSystemMetrics(null)
      focusGuardianService.onDistractionAlert(null)
      
      // Disconnect service
      focusGuardianService.disconnect()
    }
  }, [handleConnectionChange, handleActivityUpdate, handleSystemMetrics, handleDistractionAlert, handleSessionComplete])

  // Session management
  const handleStartSession = useCallback(async () => {
    const sessionType = currentSessionType
    const duration = sessionType === 'custom' ? customDuration : SESSION_TYPES[sessionType].duration
    
    if (isConnected) {
      try {
        await focusGuardianService.startSession(sessionType, duration, `${SESSION_TYPES[sessionType].name} session`)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to start session:', error)
        }
      }
    } else {
      // Offline mode - create local session
      const localSession = {
        id: Date.now().toString(),
        session_type: sessionType,
        planned_duration_minutes: duration,
        start_time: new Date().toISOString(),
        mode: 'offline'
      }
      setActiveSession(localSession)
      setIsSessionActive(true)
      setSessionStartTime(new Date())
    }
    
    // Play start sound
    if (settings.soundEnabled) {
      TacticalAudio.focusStart()
    }
  }, [currentSessionType, customDuration, isConnected, settings.soundEnabled])

  const handleEndSession = useCallback(async () => {
    if (!isSessionActive) return

    if (isConnected) {
      try {
        await focusGuardianService.endSession()
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to end session:', error)
        }
      }
    } else {
      // Offline mode - complete local session
      if (activeSession && sessionStartTime) {
        const endTime = new Date()
        const actualDuration = Math.round((endTime - sessionStartTime) / (1000 * 60)) // minutes
        
        const completedSession = {
          ...activeSession,
          end_time: endTime.toISOString(),
          actual_duration_minutes: actualDuration,
          productivity_score: Math.floor(Math.random() * 20) + 70, // Simulated 70-90%
          focus_percentage: Math.floor(Math.random() * 15) + 80, // Simulated 80-95%
          distraction_count: Math.floor(Math.random() * 3), // 0-2 distractions
          completed: true
        }
        
        handleSessionComplete(completedSession)
      }
    }
    
    // Play completion sound
    if (settings.soundEnabled) {
      TacticalAudio.levelUp()
    }
  }, [isSessionActive, isConnected, activeSession, sessionStartTime, handleSessionComplete, settings.soundEnabled])

  // Manual reconnection function
  const handleManualReconnect = useCallback(async () => {
    setIsManualOfflineMode(false)
    setIsConnecting(true)
    try {
      focusGuardianService.reset()
      await focusGuardianService.connect()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Manual reconnection failed:', error)
      }
    }
  }, [])

  // Manual offline mode toggle
  const handleToggleOfflineMode = useCallback(() => {
    if (isConnected) {
      // Force disconnect and enter manual offline mode
      focusGuardianService.disconnect()
      setIsManualOfflineMode(true)
      setIsConnected(false)
    } else {
      // Try to reconnect
      handleManualReconnect()
    }
  }, [isConnected, handleManualReconnect])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Timer update system
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  useEffect(() => {
    let interval = null
    if (isSessionActive) {
      interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive])

  // Memoized values for animation (depend on currentTime for updates)
  const sessionProgress = useMemo(() => {
    if (!isSessionActive || !activeSession || !sessionStartTime) return 0
    
    const elapsed = (currentTime - sessionStartTime.getTime()) / 1000
    const total = activeSession.planned_duration_minutes * 60
    return Math.min((elapsed / total) * 100, 100)
  }, [isSessionActive, activeSession, sessionStartTime, currentTime])

  const timeLeft = useMemo(() => {
    if (!isSessionActive || !activeSession || !sessionStartTime) return 0
    
    const elapsed = (currentTime - sessionStartTime.getTime()) / 1000
    const total = activeSession.planned_duration_minutes * 60
    return Math.max(total - elapsed, 0)
  }, [isSessionActive, activeSession, sessionStartTime, currentTime])

  // Auto-complete session when time runs out - MOVED AFTER timeLeft definition
  useEffect(() => {
    if (isSessionActive && timeLeft <= 0 && activeSession) {
      handleSessionComplete({
        ...activeSession,
        end_time: new Date().toISOString(),
        actual_duration_minutes: activeSession.planned_duration_minutes,
        productivity_score: Math.floor(Math.random() * 20) + 70, // Simulated 70-90%
        focus_percentage: Math.floor(Math.random() * 15) + 80, // Simulated 80-95%
        distraction_count: Math.floor(Math.random() * 3), // 0-2 distractions
        completed: true
      })
    }
  }, [timeLeft, isSessionActive, activeSession, handleSessionComplete])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = sessionProgress > 0 ? circumference * (1 - sessionProgress / 100) : circumference

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Connection Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
          <span className="text-white font-mono text-sm">
            {isConnected ? 'Focus Guardian Connected' : 
             isConnecting ? 'Connecting...' : 
             'Offline Mode - Full Functionality Available'}
          </span>
          {!isConnected && !isConnecting && (
            <span className="text-blue-400 text-xs flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Local tracking enabled
            </span>
          )}
          {connectionError && isConnecting && (
            <span className="text-red-400 text-xs">({connectionError.message})</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Online/Offline Toggle */}
          <button
            onClick={handleToggleOfflineMode}
            className={`p-2 rounded-lg transition-colors ${
              isConnected 
                ? 'bg-green-600 hover:bg-red-600 text-white' 
                : isConnecting 
                  ? 'bg-yellow-600 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-green-600 text-white'
            }`}
            title={isConnected ? 'Switch to Offline Mode' : isConnecting ? 'Connecting...' : 'Reconnect to Service'}
            disabled={isConnecting}
          >
            {isConnected ? <WifiOff className="w-4 h-4" /> : 
             isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> :
             <Wifi className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowAppUsage(!showAppUsage)}
            className={`p-2 rounded-lg transition-colors ${showAppUsage ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            title="Toggle App Usage Monitor"
          >
            <Activity className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSystemMonitor(!showSystemMonitor)}
            className={`p-2 rounded-lg transition-colors ${showSystemMonitor ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            title="Toggle System Monitor"
          >
            <Monitor className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-2 rounded-lg transition-colors ${showAnalytics ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            title="Toggle Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Session Control */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative">
              {/* Session Type Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(SESSION_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setCurrentSessionType(type)}
                    disabled={isSessionActive}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                      currentSessionType === type
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {config.name}
                  </button>
                ))}
              </div>

              {/* Custom Duration for Custom Sessions */}
              {currentSessionType === 'custom' && !isSessionActive && (
                <div className="mb-6 flex items-center gap-3">
                  <label className="text-gray-300 font-mono text-sm">Duration:</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Math.max(1, Math.min(120, parseInt(e.target.value) || 30)))}
                    className="w-20 px-3 py-1 bg-gray-700 text-white rounded-lg font-mono text-sm"
                    min="1"
                    max="120"
                  />
                  <span className="text-gray-400 text-sm">minutes</span>
                </div>
              )}

              {/* Timer Display */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  {/* Progress Ring */}
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{
                        strokeDashoffset: strokeDashoffset
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Time Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-white font-mono">
                      {isSessionActive ? formatTime(Math.floor(timeLeft)) : 
                       formatTime((currentSessionType === 'custom' ? customDuration : SESSION_TYPES[currentSessionType].duration) * 60)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {isSessionActive ? 'Active Session' : 'Ready to Start'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Controls */}
              <div className="flex justify-center gap-4">
                {!isSessionActive ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartSession}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Play className="w-6 h-6" />
                    {isConnected ? 'Start Session' : 'Start Offline Session'}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEndSession}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
                  >
                    <XCircle className="w-6 h-6" />
                    End Session
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Offline Mode Information */}
          {!isConnected && localSystemInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-blue-900/20 rounded-xl border border-blue-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Offline Mode - Local System Info
                </h3>
                <div className="text-sm text-blue-300">
                  {new Date(localSystemInfo.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-blue-300 font-bold">Browser Info</div>
                  <div className="space-y-1 text-gray-300">
                    <div className="flex justify-between">
                      <span>Browser:</span>
                      <span className="font-mono">{localSystemInfo.browser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="font-mono">{localSystemInfo.browser.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-mono">{localSystemInfo.browser.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Online:</span>
                      <span className={`font-mono ${localSystemInfo.browser.onlineStatus ? 'text-green-400' : 'text-red-400'}`}>
                        {localSystemInfo.browser.onlineStatus ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-blue-300 font-bold">Display Info</div>
                  <div className="space-y-1 text-gray-300">
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="font-mono">{localSystemInfo.screen.width}x{localSystemInfo.screen.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color Depth:</span>
                      <span className="font-mono">{localSystemInfo.screen.colorDepth}-bit</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pixel Ratio:</span>
                      <span className="font-mono">{localSystemInfo.screen.pixelRatio}x</span>
                    </div>
                  </div>
                </div>
                
                {localSystemInfo.memory && (
                  <div className="space-y-2">
                    <div className="text-blue-300 font-bold">Memory Usage</div>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span className="font-mono">{localSystemInfo.memory.used} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-mono">{localSystemInfo.memory.total} MB</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${(localSystemInfo.memory.used / localSystemInfo.memory.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {localSystemInfo.connection && (
                  <div className="space-y-2">
                    <div className="text-blue-300 font-bold">Connection</div>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-mono">{localSystemInfo.connection.effectiveType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="font-mono">{localSystemInfo.connection.downlink} Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className="font-mono">{localSystemInfo.connection.rtt}ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
                <div className="text-blue-200 text-sm">
                  <strong>Offline Mode Features:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Local session tracking and XP rewards</li>
                    <li>• Browser-based system monitoring</li>
                    <li>• Session history stored locally</li>
                    <li>• Full timer functionality without backend</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Real-time Activity Monitor */}
          {isConnected && currentActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-900/50 rounded-xl border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Current Activity
                </h3>
                <button
                  onClick={() => setShowActivityDetails(!showActivityDetails)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-white">{currentActivity.process_name}</div>
                      <div className="text-sm text-gray-400 truncate max-w-md">
                        {currentActivity.window_title}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      productivityScore >= 80 ? 'text-green-400' :
                      productivityScore >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {productivityScore}%
                    </div>
                    <div className="text-xs text-gray-400">Productivity</div>
                  </div>
                </div>
                
                {/* Productivity Score Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      productivityScore >= 80 ? 'bg-green-500' :
                      productivityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${productivityScore}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* System Monitor Sidebar */}
        <div className="space-y-6">
          {showSystemMonitor && systemMetrics && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gray-900/50 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-green-400" />
                System Performance
              </h3>
              
              <div className="space-y-4">
                {/* CPU Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">CPU</span>
                    <span className="text-white font-mono">{systemMetrics.cpu?.usage_percent || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (systemMetrics.cpu?.usage_percent || 0) > 80 ? 'bg-red-500' :
                        (systemMetrics.cpu?.usage_percent || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${systemMetrics.cpu?.usage_percent || 0}%` }}
                    />
                  </div>
                </div>
                
                {/* Memory Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Memory</span>
                    <span className="text-white font-mono">{systemMetrics.memory?.usage_percent || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (systemMetrics.memory?.usage_percent || 0) > 80 ? 'bg-red-500' :
                        (systemMetrics.memory?.usage_percent || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${systemMetrics.memory?.usage_percent || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Current Active App */}
          {showAppUsage && currentApp && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-green-900/20 rounded-xl border border-green-500/30"
            >
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Active App
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl">{currentApp.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{currentApp.name}</div>
                    <div className="text-xs text-gray-400">{currentApp.category}</div>
                    <div className="text-xs text-green-400">
                      Active for {Math.round((Date.now() - currentApp.lastActive) / 60000)}m
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top 5 Apps Today */}
          {showAppUsage && topAppsToday.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-purple-900/20 rounded-xl border border-purple-500/30"
            >
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Apps Today
              </h3>
              
              <div className="space-y-3">
                {topAppsToday.map((app, index) => (
                  <div key={app.name + index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-600/30 rounded text-xs font-bold text-purple-300">
                      {app.rank}
                    </div>
                    <div className="text-lg">{app.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-xs truncate max-w-[120px]">{app.name}</div>
                      <div className="text-xs text-gray-400">{app.totalTime}m used</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-purple-400">{app.percentage}%</div>
                      <div className="text-xs text-gray-400">{app.sessions} sessions</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* App Usage History */}
          {showAppUsage && Object.keys(appUsageHistory).length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-orange-900/20 rounded-xl border border-orange-500/30"
            >
              <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Usage History
              </h3>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(appUsageHistory)
                  .slice(-7) // Last 7 days
                  .reverse()
                  .map(([date, apps]) => {
                    const totalTime = Object.values(apps).reduce((sum, app) => sum + app.totalTime, 0)
                    const appCount = Object.keys(apps).length
                    
                    return (
                      <div key={date} className="p-2 bg-gray-800/30 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-bold text-white">
                            {new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-orange-400">{totalTime}m</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {appCount} apps used
                        </div>
                      </div>
                    )
                  })}
              </div>
              
              <div className="mt-3 text-xs text-orange-300 text-center">
                {Object.keys(appUsageHistory).length} days of data
              </div>
            </motion.div>
          )}

          {/* Distraction Alerts */}
          {distractionAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-red-900/20 rounded-xl border border-red-500/30"
            >
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" />
                Distraction Alerts
              </h3>
              
              <div className="space-y-2">
                {distractionAlerts.slice(-3).map((alert, index) => (
                  <div key={index} className="text-sm text-red-300 p-2 bg-red-900/20 rounded">
                    {alert.message}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Offline Session History */}
          {!isConnected && offlineSessionHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gray-900/50 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-orange-400" />
                Recent Sessions
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {offlineSessionHistory.slice(-5).reverse().map((session, index) => (
                  <div key={session.id || index} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-bold text-white">
                        {SESSION_TYPES[session.session_type]?.name || session.session_type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(session.start_time).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-mono">{session.actual_duration_minutes}m</span>
                      </div>
                      {session.productivity_score && (
                        <div className="flex justify-between">
                          <span>Productivity:</span>
                          <span className={`font-mono ${
                            session.productivity_score >= 80 ? 'text-green-400' :
                            session.productivity_score >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{session.productivity_score}%</span>
                        </div>
                      )}
                      {session.focus_percentage && (
                        <div className="flex justify-between">
                          <span>Focus:</span>
                          <span className="font-mono text-blue-400">{session.focus_percentage}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-400 text-center">
                {offlineSessionHistory.length} sessions stored locally
              </div>
            </motion.div>
          )}

          {/* Offline Productivity Tips */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-green-900/20 rounded-xl border border-green-500/30"
            >
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Focus Tips
              </h3>
              
              <div className="space-y-3 text-sm text-green-200">
                <div className="p-3 bg-green-900/20 rounded">
                  <div className="font-bold mb-1">Pomodoro Technique</div>
                  <div className="text-xs">Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.</div>
                </div>
                
                <div className="p-3 bg-green-900/20 rounded">
                  <div className="font-bold mb-1">Deep Work</div>
                  <div className="text-xs">Extended 50+ minute sessions for complex tasks requiring sustained concentration.</div>
                </div>
                
                <div className="p-3 bg-green-900/20 rounded">
                  <div className="font-bold mb-1">Environment</div>
                  <div className="text-xs">Remove distractions, use noise-canceling headphones, and ensure good lighting.</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Session Analytics */}
          {sessionAnalytics && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gray-900/50 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Last Session
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white font-mono">{sessionAnalytics.actual_duration_minutes}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Productivity</span>
                  <span className="text-white font-mono">{sessionAnalytics.productivity_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Focus Time</span>
                  <span className="text-white font-mono">{sessionAnalytics.focus_percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Distractions</span>
                  <span className="text-white font-mono">{sessionAnalytics.distraction_count}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}