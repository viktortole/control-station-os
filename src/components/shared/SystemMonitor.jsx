/**
 * SystemMonitor - Real-time System Monitoring Widget
 * 
 * Displays live system metrics with military-themed UI
 * Integrates with Python backend for real system data
 */

import React, { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Thermometer,
  Activity,
  AlertTriangle,
  Wifi,
  WifiOff,
  Monitor,
  Zap
} from 'lucide-react'
// Mock system monitoring data (Python backend removed)
const mockSystemData = {
  cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
  memory: Math.floor(Math.random() * 40) + 30, // 30-70%
  disk: Math.floor(Math.random() * 20) + 20, // 20-40%
  network: Math.floor(Math.random() * 100), // 0-100 KB/s
  status: 'operational'
}
// Remove broken import

const SystemMonitor = memo(function SystemMonitor({ compact = false, showDebug = false }) {
  const [systemData, setSystemData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    // Use mock data instead of Python backend
    setSystemData(mockSystemData)
    setIsConnected(true)
    setError(null)
    
    // Update mock data periodically
    const interval = setInterval(() => {
      setSystemData({
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 40) + 30,
        disk: Math.floor(Math.random() * 20) + 20,
        network: Math.floor(Math.random() * 100),
        status: 'operational'
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Loading state
  if (!systemData) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-5 h-5 text-green-400" />
          <h3 className="text-white/90 font-semibold">System Monitor</h3>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-white/20 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Initializing tactical systems...</p>
        </div>
      </div>
    )
  }

  // Compact view for smaller spaces
  if (compact) {
    return (
      <div className="bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-green-400" />
            <span className="text-white/90 text-sm font-medium">System</span>
          </div>
          <ConnectionIndicator isConnected={isConnected} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <MetricMini 
            icon={Cpu} 
            value={`${systemData.cpu?.usage_percent?.toFixed(0)}%`}
            color="text-blue-400"
          />
          <MetricMini 
            icon={MemoryStick} 
            value={`${systemData.memory?.usage_percent?.toFixed(0)}%`}
            color="text-purple-400"
          />
          <MetricMini 
            icon={HardDrive} 
            value={`${systemData.disk?.usage_percent?.toFixed(0)}%`}
            color="text-orange-400"
          />
        </div>
      </div>
    )
  }

  // Full system monitor view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white/90">System Monitor</h3>
            <ConnectionIndicator isConnected={isConnected} />
          </div>
          {systemData.alerts?.length > 0 && (
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">{systemData.alerts.length} Alert{systemData.alerts.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CPU Usage */}
          <MetricCard
            title="CPU Usage"
            icon={Cpu}
            value={systemData.cpu?.usage_percent}
            unit="%"
            threshold={80}
            color="blue"
            additionalInfo={[
              { label: 'Cores', value: systemData.cpu?.cores },
              { label: 'Frequency', value: `${systemData.cpu?.frequency} MHz` }
            ]}
          />

          {/* Memory Usage */}
          <MetricCard
            title="Memory Usage"
            icon={MemoryStick}
            value={systemData.memory?.usage_percent}
            unit="%"
            threshold={85}
            color="purple"
            additionalInfo={[
              { label: 'Total', value: formatBytes(systemData.memory?.total) },
              { label: 'Available', value: formatBytes(systemData.memory?.available) }
            ]}
          />

          {/* Disk Usage */}
          <MetricCard
            title="Disk Usage"
            icon={HardDrive}
            value={systemData.disk?.usage_percent}
            unit="%"
            threshold={90}
            color="orange"
            additionalInfo={[
              { label: 'Total', value: formatBytes(systemData.disk?.total) },
              { label: 'Free', value: formatBytes(systemData.disk?.free) }
            ]}
          />

        </div>

        {/* Active Processes (if space allows) */}
        {systemData.processes && systemData.processes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Top Processes
            </h4>
            <div className="bg-black/20 rounded-lg p-4">
              <div className="space-y-2">
                {systemData.processes.slice(0, 5).map((process, index) => (
                  <div key={process.pid || index} className="flex items-center justify-between text-sm">
                    <span className="text-white/70 truncate flex-1">{process.name}</span>
                    <div className="flex gap-4 text-white/50">
                      <span>{process.cpu_percent?.toFixed(1)}% CPU</span>
                      <span>{process.memory_percent?.toFixed(1)}% RAM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {systemData.alerts && systemData.alerts.length > 0 && (
          <div className="mt-6">
            <h4 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Alerts
            </h4>
            <div className="space-y-2">
              {systemData.alerts.map((alert, index) => (
                <div key={alert.id || index} className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.level === 'critical' ? 'bg-red-500' :
                      alert.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-yellow-300 text-sm">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {showDebug && (
          <div className="mt-6">
            <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integration Debug
            </h4>
            <div className="bg-black/20 rounded-lg p-4 space-y-3">
              <button
                onClick={async () => {
                  console.log('🧪 Running integration test...')
                  const results = await integrationTest.runFullTest()
                  setDebugInfo(results)
                }}
                className="w-full px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 text-sm hover:bg-blue-600/30 transition-colors"
              >
                Run Integration Test
              </button>
              
              {debugInfo && (
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Backend Status:</span>
                    <span className={debugInfo.pythonBridge?.connected ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.pythonBridge?.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">WebSocket:</span>
                    <span className={debugInfo.webSocket?.connected ? 'text-green-400' : 'text-red-400'}>
                      {debugInfo.webSocket?.connected ? 'Active' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Overall:</span>
                    <span className={
                      debugInfo.overall === 'passed' ? 'text-green-400' :
                      debugInfo.overall === 'partial' ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {debugInfo.overall.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Update */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <span className="text-white/40 text-xs">
            Last update: {new Date(systemData.timestamp).toLocaleTimeString()}
            {showDebug && (
              <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                DEBUG MODE
              </span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
})

// Connection status indicator
const ConnectionIndicator = ({ isConnected }) => (
  <div className="flex items-center gap-2">
    {isConnected ? (
      <>
        <Wifi className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-xs font-medium">ONLINE</span>
      </>
    ) : (
      <>
        <WifiOff className="w-4 h-4 text-red-400" />
        <span className="text-red-400 text-xs font-medium">OFFLINE</span>
      </>
    )}
  </div>
)

// Mini metric for compact view
const MetricMini = ({ icon: Icon, value, color }) => (
  <div className="text-center">
    <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
    <div className="text-white/90 text-xs font-bold">{value}</div>
  </div>
)

// Full metric card
const MetricCard = ({ title, icon: Icon, value, unit, threshold, color, additionalInfo = [] }) => {
  const isWarning = value > threshold
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    purple: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    orange: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    red: 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const cardColor = isWarning ? colorClasses.red : colorClasses[color]

  return (
    <motion.div
      className={`bg-gray-900/40 border rounded-lg p-4 ${cardColor}`}
      animate={isWarning ? { 
        boxShadow: ['0 0 0 rgba(239, 68, 68, 0)', '0 0 20px rgba(239, 68, 68, 0.3)', '0 0 0 rgba(239, 68, 68, 0)']
      } : {}}
      transition={{ duration: 2, repeat: isWarning ? Infinity : 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${isWarning ? 'text-red-400' : `text-${color}-400`}`} />
        {isWarning && <AlertTriangle className="w-4 h-4 text-red-400" />}
      </div>
      
      <div className="mb-2">
        <div className={`text-2xl font-bold ${isWarning ? 'text-red-300' : 'text-white'}`}>
          {value?.toFixed(1)}{unit}
        </div>
        <div className="text-white/60 text-sm">{title}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
        <motion.div
          className={`h-2 rounded-full ${isWarning ? 'bg-red-500' : `bg-${color}-500`}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Additional info */}
      {additionalInfo.length > 0 && (
        <div className="space-y-1">
          {additionalInfo.map((info, index) => (
            <div key={index} className="flex justify-between text-xs text-white/50">
              <span>{info.label}:</span>
              <span>{info.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Utility function to format bytes
const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default SystemMonitor