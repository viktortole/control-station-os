// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📊 ACTIVITY DASHBOARD - COMPREHENSIVE REAL-TIME MONITORING                  │
// │ Live activity feed • Detailed history • App usage analytics • Timeline     │
// │ Real-time WebSocket updates • Comprehensive tracking visualization          │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Clock, Eye, TrendingUp, BarChart3, PieChart, History,
  Monitor, Wifi, RefreshCw, Calendar, Filter, Search, Download,
  ChevronRight, ChevronDown, Play, Pause, AlertCircle, CheckCircle,
  Globe, Terminal, Code, FileText, Video, Music, Gamepad2, ShoppingCart
} from 'lucide-react'

// App icons mapping for better visual representation
const APP_ICONS = {
  'firefox': Globe,
  'chrome': Globe,
  'safari': Globe,
  'code': Code,
  'cursor': Code,
  'terminal': Terminal,
  'cmd': Terminal,
  'powershell': Terminal,
  'notepad': FileText,
  'word': FileText,
  'excel': FileText,
  'video': Video,
  'youtube': Video,
  'netflix': Video,
  'spotify': Music,
  'music': Music,
  'game': Gamepad2,
  'steam': Gamepad2,
  'shop': ShoppingCart,
  'amazon': ShoppingCart,
  'default': Monitor
}

// Get appropriate icon for app
const getAppIcon = (appName) => {
  if (!appName) return APP_ICONS.default
  const name = appName.toLowerCase()
  for (const [key, icon] of Object.entries(APP_ICONS)) {
    if (name.includes(key)) return icon
  }
  return APP_ICONS.default
}

// Productivity color coding
const getProductivityColor = (score) => {
  if (score >= 80) return 'text-green-400 bg-green-900/20 border-green-500/30'
  if (score >= 60) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
  if (score >= 40) return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
  return 'text-red-400 bg-red-900/20 border-red-500/30'
}

export default function ActivityDashboard() {
  // Connection state
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState(null)
  
  // Real-time data
  const [liveActivity, setLiveActivity] = useState(null)
  const [realtimeUpdates, setRealtimeUpdates] = useState([])
  
  // Historical data
  const [activityTimeline, setActivityTimeline] = useState([])
  const [appUsageStats, setAppUsageStats] = useState([])
  const [analytics, setAnalytics] = useState(null)
  
  // UI state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('live') // live, timeline, apps, analytics
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [searchFilter, setSearchFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Connect to WebSocket for real-time updates
  useEffect(() => {
    connectWebSocket()
    return () => {
      if (ws) ws.close()
    }
  }, [])
  
  const connectWebSocket = useCallback(() => {
    try {
      const websocket = new WebSocket('ws://localhost:8000/ws/focus')
      
      websocket.onopen = () => {
        setIsConnected(true)
        setWs(websocket)
        console.log('Activity Dashboard WebSocket connected')
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
        setIsConnected(false)
        setWs(null)
        // Auto-reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      setIsConnected(false)
      // Retry after 5 seconds
      setTimeout(connectWebSocket, 5000)
    }
  }, [ws])
  
  const handleWebSocketMessage = useCallback((message) => {
    switch (message.type) {
      case 'initial_status':
      case 'status_update':
        if (message.focus) {
          const activityUpdate = {
            timestamp: message.timestamp,
            ...message.focus
          }
          setLiveActivity(activityUpdate)
          
          // Add to real-time updates feed with enhanced detection
          setRealtimeUpdates(prev => [
            {
              id: Date.now(),
              timestamp: message.timestamp,
              type: 'status_update',
              data: activityUpdate,
              enhanced: true
            },
            ...prev.slice(0, 49) // Keep last 50 updates
          ])
        }
        break
        
      case 'focus_update':
        const updatedData = { ...message.data }
        setLiveActivity(prev => ({ ...prev, ...updatedData }))
        
        // Add focused update to feed
        setRealtimeUpdates(prev => [
          {
            id: Date.now(),
            timestamp: message.timestamp,
            type: 'focus_update',
            data: updatedData,
            enhanced: true
          },
          ...prev.slice(0, 49)
        ])
        break
        
      case 'window_changed':
        // Handle detailed window change events
        setRealtimeUpdates(prev => [
          {
            id: Date.now(),
            timestamp: message.timestamp,
            type: 'window_changed',
            data: message.data,
            enhanced: true
          },
          ...prev.slice(0, 49)
        ])
        break
        
      case 'activity_logged':
        // Handle activity logging events
        setRealtimeUpdates(prev => [
          {
            id: Date.now(),
            timestamp: message.timestamp,
            type: 'activity_logged',
            data: message.data,
            enhanced: true
          },
          ...prev.slice(0, 49)
        ])
        break
        
      default:
        console.log('Unknown WebSocket message:', message.type)
    }
  }, [])
  
  // Load historical data
  const loadHistoricalData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Load multiple data sources in parallel
      const [timelineRes, appsRes, analyticsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/focus/activity/timeline?date_filter=${selectedDate}`),
        fetch(`http://localhost:8000/api/focus/activity/apps?date_filter=${selectedDate}`),
        fetch(`http://localhost:8000/api/focus/analytics?date_filter=${selectedDate}`)
      ])
      
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json()
        setActivityTimeline(timelineData.timeline || [])
      }
      
      if (appsRes.ok) {
        const appsData = await appsRes.json()
        setAppUsageStats(appsData.apps || [])
      }
      
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
      
    } catch (error) {
      console.error('Failed to load historical data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate])
  
  // Load data when date changes
  useEffect(() => {
    loadHistoricalData()
  }, [selectedDate, loadHistoricalData])
  
  // Filter timeline by search
  const filteredTimeline = activityTimeline.filter(item => 
    !searchFilter || 
    item.app_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.window_title?.toLowerCase().includes(searchFilter.toLowerCase())
  )
  
  // Format time for display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    if (mins < 60) return `${mins}m ${secs}s`
    const hours = Math.floor(mins / 60)
    return `${hours}h ${mins % 60}m`
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Activity Dashboard</h1>
              <p className="text-gray-400">Real-time monitoring & detailed analytics</p>
            </div>
          </div>
          
          {/* Connection Status & Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
            />
            
            <button
              onClick={loadHistoricalData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>
        
        {/* View Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 p-1 bg-gray-800/50 rounded-lg"
        >
          {[
            { id: 'live', label: 'Live Activity', icon: Activity },
            { id: 'timeline', label: 'Timeline', icon: History },
            { id: 'apps', label: 'App Usage', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {viewMode === 'live' && (
                <motion.div
                  key="live"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Current Activity */}
                  {liveActivity && (
                    <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-500/20">
                      <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Current Activity
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            {React.createElement(getAppIcon(liveActivity.active_app), { 
                              className: "w-8 h-8 text-blue-400" 
                            })}
                            <div>
                              <p className="text-lg font-bold text-white">{liveActivity.active_app || 'No app detected'}</p>
                              <p className="text-sm text-gray-400 truncate max-w-md">
                                {liveActivity.window_title || 'No window title'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Duration:</span>
                              <span className="text-white font-mono">{formatDuration(liveActivity.elapsed_seconds || 0)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-300">Status:</span>
                              <span className={`font-bold ${liveActivity.is_monitoring ? 'text-green-400' : 'text-gray-400'}`}>
                                {liveActivity.is_monitoring ? 'Monitoring' : 'Standby'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-300">Productivity Score:</span>
                              <span className="text-white font-bold">
                                {Math.round((liveActivity.productivity_score || 0) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                              <motion.div
                                className={`h-3 rounded-full ${
                                  (liveActivity.productivity_score || 0) >= 0.7 ? 'bg-green-500' :
                                  (liveActivity.productivity_score || 0) >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(liveActivity.productivity_score || 0) * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Last updated: {formatTime(liveActivity.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Real-time Updates Feed */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Live Activity Stream
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-xs font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                          {isConnected ? 'LIVE' : 'OFFLINE'}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {realtimeUpdates.length} updates
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {realtimeUpdates.length === 0 ? (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
                          <div className="text-gray-400 mb-2">
                            {isConnected ? 'Real-time monitoring active...' : 'Connecting to live feed...'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Enhanced activity tracking will appear here
                          </div>
                        </div>
                      ) : (
                        realtimeUpdates.map((update, index) => {
                          const getUpdateTypeInfo = (type) => {
                            switch (type) {
                              case 'window_changed':
                                return { icon: '🔄', label: 'Window Changed', color: 'text-blue-400' }
                              case 'activity_logged':
                                return { icon: '📝', label: 'Activity Logged', color: 'text-green-400' }
                              case 'focus_update':
                                return { icon: '⚡', label: 'Focus Update', color: 'text-yellow-400' }
                              case 'status_update':
                                return { icon: '📊', label: 'Status Update', color: 'text-purple-400' }
                              default:
                                return { icon: '🔴', label: 'System Update', color: 'text-gray-400' }
                            }
                          }
                          
                          const typeInfo = getUpdateTypeInfo(update.type)
                          const appName = update.data.active_app || update.data.app_name || 'Unknown'
                          const windowTitle = update.data.window_title || 'No title'
                          
                          return (
                            <motion.div
                              key={update.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group hover:bg-gray-800/50 p-3 rounded-lg border border-transparent hover:border-gray-600 transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{typeInfo.icon}</span>
                                    <span className={`text-xs font-medium ${typeInfo.color}`}>
                                      {typeInfo.label}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(update.timestamp)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mb-1">
                                    {React.createElement(getAppIcon(appName), { 
                                      className: "w-4 h-4 text-blue-400 flex-shrink-0" 
                                    })}
                                    <span className="text-white font-medium truncate">{appName}</span>
                                    {update.data.productivity_score && (
                                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        update.data.productivity_score > 0.7 ? 'bg-green-900/30 text-green-400' :
                                        update.data.productivity_score > 0.4 ? 'bg-yellow-900/30 text-yellow-400' :
                                        'bg-red-900/30 text-red-400'
                                      }`}>
                                        {Math.round(update.data.productivity_score * 100)}%
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-400 truncate leading-relaxed">
                                    {windowTitle}
                                  </div>
                                  
                                  {update.data.duration_seconds && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Duration: {formatDuration(update.data.duration_seconds)}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
                    
                    {realtimeUpdates.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
                        <span>Real-time tracking active</span>
                        <button 
                          onClick={() => setRealtimeUpdates([])}
                          className="hover:text-white transition-colors"
                        >
                          Clear feed
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {viewMode === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Search Filter */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search apps, titles, or activities..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <span className="text-sm text-gray-400">
                      {filteredTimeline.length} of {activityTimeline.length} entries
                    </span>
                  </div>
                  
                  {/* Timeline */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6">Activity Timeline</h3>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredTimeline.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">
                          {searchFilter ? 'No activities match your search.' : 'No activity data for this date.'}
                        </div>
                      ) : (
                        filteredTimeline.map((item, index) => {
                          const Icon = getAppIcon(item.app_name)
                          const productivityColor = getProductivityColor(item.productivity_score * 100)
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Icon className="w-6 h-6 text-blue-400" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-white">{item.app_name}</span>
                                    <span className={`px-2 py-1 text-xs rounded border ${productivityColor}`}>
                                      {Math.round(item.productivity_score * 100)}%
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400 truncate max-w-md">
                                    {item.window_title || 'No title'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-white font-mono text-sm">
                                  {formatDuration(item.duration_seconds)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatTime(item.timestamp)}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {viewMode === 'apps' && (
                <motion.div
                  key="apps"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-6">App Usage Statistics</h3>
                  
                  <div className="space-y-4">
                    {appUsageStats.length === 0 ? (
                      <div className="text-gray-400 text-center py-8">
                        No app usage data for this date.
                      </div>
                    ) : (
                      appUsageStats.map((app, index) => {
                        const Icon = getAppIcon(app.app_name)
                        const productivityColor = getProductivityColor(app.productivity_avg)
                        
                        return (
                          <motion.div
                            key={app.app_name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg"
                          >
                            <Icon className="w-8 h-8 text-blue-400" />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-white text-lg">{app.app_name}</span>
                                <span className={`px-2 py-1 text-xs rounded border ${productivityColor}`}>
                                  {app.productivity_avg}% avg
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">Time:</span>
                                  <span className="text-white font-mono ml-2">{app.minutes}m</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Sessions:</span>
                                  <span className="text-white font-mono ml-2">{app.session_count}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Percentage:</span>
                                  <span className="text-white font-mono ml-2">{app.time_percentage}%</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full bg-blue-500"
                                      style={{ width: `${Math.min(app.time_percentage, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              )}
              
              {viewMode === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-6">Analytics Overview</h3>
                  
                  {analytics ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                        <div className="text-3xl font-black text-blue-400">{Math.round(analytics.total_focused_time / 60)}m</div>
                        <div className="text-sm text-blue-300">Total Focus Time</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                        <div className="text-3xl font-black text-green-400">{Math.round(analytics.productivity_percentage)}%</div>
                        <div className="text-sm text-green-300">Productivity</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <div className="text-3xl font-black text-purple-400">{analytics.top_apps?.length || 0}</div>
                        <div className="text-sm text-purple-300">Apps Used</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                        <div className="text-3xl font-black text-orange-400">{analytics.flow_sessions || 0}</div>
                        <div className="text-sm text-orange-300">Flow Sessions</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      No analytics data available for this date.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            {/* Connection Info */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                Connection Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Backend:</span>
                  <span className={`font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Real-time:</span>
                  <span className={`font-bold ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                    {isConnected ? 'Active' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updates:</span>
                  <span className="text-white font-mono">{realtimeUpdates.length}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={loadHistoricalData}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="text-blue-400 text-sm">Refresh Data</span>
                </button>
                
                <button
                  onClick={connectWebSocket}
                  disabled={isConnected}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">
                    {isConnected ? 'Connected' : 'Reconnect'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}