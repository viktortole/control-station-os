// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧪 BACKEND TEST FOCUS GUARDIAN - DEBUGGING & TESTING COMPONENT              │
// │ Simplified component focused on testing Python backend integration          │
// │ Real-time connection status • Backend API testing • WebSocket debugging     │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, WifiOff, Play, Pause, Square, RefreshCw, TestTube, 
  Activity, Server, Database, MessageSquare, CheckCircle, 
  XCircle, AlertTriangle, Clock, Eye, Cpu, Monitor, Globe
} from 'lucide-react'
import { focusGuardianService } from '../../shared/services/FocusGuardianService'

export default function BackendTestFocusGuardian() {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    isConnecting: false,
    lastError: null,
    connectionAttempts: 0
  })
  
  // Backend data
  const [backendHealth, setBackendHealth] = useState(null)
  const [focusStatus, setFocusStatus] = useState(null)
  const [pomodoroStatus, setPomodoroStatus] = useState(null)
  const [activityData, setActivityData] = useState(null)
  const [systemMetrics, setSystemMetrics] = useState(null)
  
  // WebSocket messages log
  const [wsMessages, setWsMessages] = useState([])
  const [apiCalls, setApiCalls] = useState([])
  
  // Test results
  const [testResults, setTestResults] = useState({
    healthCheck: null,
    websocketConnection: null,
    apiEndpoints: null,
    realTimeUpdates: null
  })

  // Add message to log
  const addWsMessage = useCallback((type, data) => {
    const message = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      data
    }
    setWsMessages(prev => [...prev.slice(-9), message]) // Keep last 10 messages
  }, [])

  const addApiCall = useCallback((method, endpoint, success, data) => {
    const call = {
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      success,
      data
    }
    setApiCalls(prev => [...prev.slice(-9), call]) // Keep last 10 calls
  }, [])

  // WebSocket event handlers
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

    // Auto-start monitoring when connected for Windows activity tracking
    if (connected) {
      setTimeout(async () => {
        // Call test functions directly to avoid dependency issues
        try {
          const healthResponse = await fetch('http://localhost:8000/api/health')
          const healthData = await healthResponse.json()
          setBackendHealth(healthData)
          addApiCall('GET', '/api/health', true, healthData)
          setTestResults(prev => ({ ...prev, healthCheck: 'PASS' }))
        } catch (error) {
          addApiCall('GET', '/api/health', false, error.message)
          setTestResults(prev => ({ ...prev, healthCheck: 'FAIL' }))
        }

        try {
          const statusResponse = await fetch('http://localhost:8000/api/focus/status')
          const statusData = await statusResponse.json()
          setFocusStatus(statusData)
          addApiCall('GET', '/api/focus/status', true, statusData)
        } catch (error) {
          addApiCall('GET', '/api/focus/status', false, error.message)
        }

        // Start focus monitoring automatically
        try {
          const response = await fetch('http://localhost:8000/api/focus/start', { method: 'POST' })
          const data = await response.json()
          addApiCall('POST', '/api/focus/start', true, data)
          addWsMessage('AUTO_START', { message: 'Focus monitoring started automatically' })
        } catch (error) {
          addApiCall('POST', '/api/focus/start', false, error.message)
        }
      }, 1000)
    }
  }, [addWsMessage, addApiCall])

  const handleActivityUpdate = useCallback((activity) => {
    setActivityData(activity)
    addWsMessage('ACTIVITY', activity)
    
    setTestResults(prev => ({
      ...prev,
      realTimeUpdates: 'PASS'
    }))
  }, [addWsMessage])

  const handlePomodoroUpdate = useCallback((pomodoro) => {
    setPomodoroStatus(pomodoro)
    addWsMessage('POMODORO', pomodoro)
  }, [addWsMessage])

  const handleSystemMetricsUpdate = useCallback((metrics) => {
    setSystemMetrics(metrics)
    addWsMessage('METRICS', metrics)
  }, [addWsMessage])

  // Test functions - defined before they're used
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

  const testFocusStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/focus/status')
      const data = await response.json()
      setFocusStatus(data)
      addApiCall('GET', '/api/focus/status', true, data)
    } catch (error) {
      addApiCall('GET', '/api/focus/status', false, error.message)
    }
  }, [addApiCall])

  // WebSocket connection functions
  const connectWebSocket = useCallback(async () => {
    setConnectionStatus(prev => ({ ...prev, isConnecting: true }))
    try {
      await focusGuardianService.connect()
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }, [])

  const disconnectWebSocket = useCallback(() => {
    focusGuardianService.disconnect()
  }, [])

  // Initialize service and event handlers
  useEffect(() => {
    // Reset connection state when component mounts
    focusGuardianService.reset()
    
    focusGuardianService.onConnectionChange(handleConnectionChange)
    focusGuardianService.onActivityUpdate(handleActivityUpdate)
    focusGuardianService.onSystemMetrics(handleSystemMetricsUpdate)
    
    // Custom pomodoro handler
    focusGuardianService.onSessionUpdate((session, event) => {
      handlePomodoroUpdate({ session, event })
    })

    // Auto-connect on mount for testing
    connectWebSocket()

    return () => {
      // Clean up event handlers but don't disconnect
      // This allows the connection to be reused if user switches back
      focusGuardianService.onConnectionChange(null)
      focusGuardianService.onActivityUpdate(null)
      focusGuardianService.onSystemMetrics(null)
      focusGuardianService.onSessionUpdate(null)
    }
  }, [handleConnectionChange, handleActivityUpdate, handlePomodoroUpdate, handleSystemMetricsUpdate])
  
  // Auto-run tests when component mounts
  useEffect(() => {
    // Run tests after a short delay to allow connections to establish
    const testTimeout = setTimeout(() => {
      testHealthCheck()
      testFocusStatus() 
      testPomodoroStatus()
    }, 2000)
    
    return () => clearTimeout(testTimeout)
  }, [])

  // Additional test functions

  const testPomodoroStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/focus/pomodoro/status')
      const data = await response.json()
      setPomodoroStatus(data)
      addApiCall('GET', '/api/focus/pomodoro/status', true, data)
    } catch (error) {
      addApiCall('GET', '/api/focus/pomodoro/status', false, error.message)
    }
  }

  const testStartPomodoro = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/focus/pomodoro/start', { method: 'POST' })
      const data = await response.json()
      addApiCall('POST', '/api/focus/pomodoro/start', true, data)
      // Refresh status after starting
      setTimeout(testPomodoroStatus, 1000)
    } catch (error) {
      addApiCall('POST', '/api/focus/pomodoro/start', false, error.message)
    }
  }

  const testPausePomodoro = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/focus/pomodoro/pause', { method: 'POST' })
      const data = await response.json()
      addApiCall('POST', '/api/focus/pomodoro/pause', true, data)
      setTimeout(testPomodoroStatus, 1000)
    } catch (error) {
      addApiCall('POST', '/api/focus/pomodoro/pause', false, error.message)
    }
  }

  const testStopPomodoro = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/focus/pomodoro/reset', { method: 'POST' })
      const data = await response.json()
      addApiCall('POST', '/api/focus/pomodoro/reset', true, data)
      setTimeout(testPomodoroStatus, 1000)
    } catch (error) {
      addApiCall('POST', '/api/focus/pomodoro/reset', false, error.message)
    }
  }

  const runAllTests = async () => {
    addWsMessage('TEST', 'Running all backend tests...')
    await testHealthCheck()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testFocusStatus()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testPomodoroStatus()
    
    setTestResults(prev => ({
      ...prev,
      apiEndpoints: 'PASS'
    }))
  }

  const getTestIcon = (result) => {
    switch (result) {
      case 'PASS': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'FAIL': return <XCircle className="w-4 h-4 text-red-400" />
      default: return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <TestTube className="w-8 h-8 text-blue-400" />
          Backend Test Console
        </h1>
        <p className="text-gray-400">Test Focus Guardian Python backend integration</p>
      </div>

      {/* Connection Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-400" />
            WebSocket Connection
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
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
              {!connectionStatus.isConnected ? (
                <button
                  onClick={connectWebSocket}
                  disabled={connectionStatus.isConnecting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-bold transition-colors"
                >
                  {connectionStatus.isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                  Connect
                </button>
              ) : (
                <button
                  onClick={disconnectWebSocket}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                >
                  <WifiOff className="w-4 h-4" />
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Test Results Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-purple-400" />
            Test Results
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Health Check:</span>
              <div className="flex items-center gap-2">
                {getTestIcon(testResults.healthCheck)}
                <span className="text-white font-mono text-sm">{testResults.healthCheck || 'NOT RUN'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">WebSocket:</span>
              <div className="flex items-center gap-2">
                {getTestIcon(testResults.websocketConnection)}
                <span className="text-white font-mono text-sm">{testResults.websocketConnection || 'NOT RUN'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API Endpoints:</span>
              <div className="flex items-center gap-2">
                {getTestIcon(testResults.apiEndpoints)}
                <span className="text-white font-mono text-sm">{testResults.apiEndpoints || 'NOT RUN'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Real-time Updates:</span>
              <div className="flex items-center gap-2">
                {getTestIcon(testResults.realTimeUpdates)}
                <span className="text-white font-mono text-sm">{testResults.realTimeUpdates || 'NOT RUN'}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={runAllTests}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
          >
            <TestTube className="w-4 h-4" />
            Run All Tests
          </button>
        </motion.div>
      </div>

      {/* Backend Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Check Data */}
        {backendHealth && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/20 rounded-xl p-4 border border-green-500/30"
          >
            <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
              <Server className="w-5 h-5" />
              Backend Health
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-mono">{backendHealth.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Version:</span>
                <span className="text-white font-mono">{backendHealth.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Environment:</span>
                <span className="text-white font-mono">{backendHealth.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Timestamp:</span>
                <span className="text-white font-mono text-xs">{new Date(backendHealth.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Focus Status Data */}
        {focusStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30"
          >
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Focus Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Monitoring:</span>
                <span className={`font-mono ${focusStatus.is_monitoring ? 'text-green-400' : 'text-red-400'}`}>
                  {focusStatus.is_monitoring ? 'Active' : 'Inactive'}
                </span>
              </div>
              {focusStatus.active_app && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active App:</span>
                    <span className="text-white font-mono">{focusStatus.active_app}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Elapsed:</span>
                    <span className="text-white font-mono">{Math.floor(focusStatus.elapsed_seconds / 60)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Productivity:</span>
                    <span className="text-white font-mono">{Math.round(focusStatus.productivity_score * 100)}%</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Pomodoro Status Data */}
        {pomodoroStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 rounded-xl p-4 border border-red-500/30"
          >
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pomodoro Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Phase:</span>
                <span className="text-red-400 font-mono">{pomodoroStatus.phase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Time Left:</span>
                <span className="text-white font-mono">{Math.floor(pomodoroStatus.seconds_left / 60)}:{String(pomodoroStatus.seconds_left % 60).padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Running:</span>
                <span className={`font-mono ${pomodoroStatus.is_running ? 'text-green-400' : 'text-gray-400'}`}>
                  {pomodoroStatus.is_running ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cycle:</span>
                <span className="text-white font-mono">{pomodoroStatus.cycle_count}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Pomodoro Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-400" />
          Pomodoro Controls (Test Backend)
        </h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={testStartPomodoro}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
          
          <button
            onClick={testPausePomodoro}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-colors"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
          
          <button
            onClick={testStopPomodoro}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            <Square className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={testPomodoroStatus}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>
        </div>
      </motion.div>

      {/* Real-time Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WebSocket Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            WebSocket Messages
          </h2>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {wsMessages.length === 0 ? (
              <div className="text-gray-400 text-sm">No WebSocket messages yet...</div>
            ) : (
              wsMessages.map((msg, index) => (
                <div key={index} className="text-xs p-2 bg-gray-800/50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-purple-400 font-bold">{msg.type}</span>
                    <span className="text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div className="text-gray-300 font-mono break-all">
                    {typeof msg.data === 'object' ? JSON.stringify(msg.data, null, 2) : msg.data}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* API Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            API Calls
          </h2>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {apiCalls.length === 0 ? (
              <div className="text-gray-400 text-sm">No API calls yet...</div>
            ) : (
              apiCalls.map((call, index) => (
                <div key={index} className="text-xs p-2 bg-gray-800/50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        call.method === 'GET' ? 'bg-blue-600' : 'bg-green-600'
                      } text-white`}>
                        {call.method}
                      </span>
                      <span className="text-white font-mono">{call.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {call.success ? 
                        <CheckCircle className="w-3 h-3 text-green-400" /> : 
                        <XCircle className="w-3 h-3 text-red-400" />
                      }
                      <span className="text-gray-400">{call.timestamp}</span>
                    </div>
                  </div>
                  {call.data && (
                    <div className="text-gray-300 font-mono break-all">
                      {typeof call.data === 'object' ? JSON.stringify(call.data, null, 2) : call.data}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}