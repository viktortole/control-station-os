// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🚨 TACTICAL ERROR BOUNDARY - CONTROL STATION OS                             │
// │ Military-grade error handling and recovery system                            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { AlertTriangle, RefreshCw, Home, Shield, AlertOctagon } from 'lucide-react'
import { motion } from 'framer-motion'

class TacticalErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('🚨 TACTICAL ERROR BOUNDARY TRIGGERED:', error, errorInfo)
    
    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))
    
    // Store error in localStorage for debugging
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      // Get existing error log
      const existingLog = localStorage.getItem('cs_error_log')
      const errors = existingLog ? JSON.parse(existingLog) : []
      
      // Add new error (keep last 10)
      errors.unshift(errorLog)
      if (errors.length > 10) errors.pop()
      
      localStorage.setItem('cs_error_log', JSON.stringify(errors))
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Optionally reload the page
    if (this.state.errorCount > 2) {
      window.location.reload()
    }
  }

  handleFullReset = () => {
    // Clear all app data and start fresh
    if (confirm('⚠️ This will clear all application data and reset to factory defaults. Are you sure?')) {
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const isProduction = import.meta.env.PROD
      
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            {/* Main Error Card */}
            <div className="bg-gradient-to-br from-red-950/50 to-gray-900/50 rounded-2xl border-2 border-red-500/50 overflow-hidden">
              {/* Header */}
              <div className="bg-red-900/30 border-b border-red-500/30 p-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <AlertOctagon className="w-8 h-8 text-red-400" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                      System Malfunction
                    </h1>
                    <p className="text-red-300 text-sm font-mono">
                      CRITICAL ERROR • RECOVERY MODE ACTIVE
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="p-6 space-y-4">
                <div className="bg-black/50 rounded-lg p-4 border border-red-500/20">
                  <p className="text-red-300 font-mono text-sm mb-2">
                    ERROR CODE: {this.state.error?.name || 'UNKNOWN_ERROR'}
                  </p>
                  <p className="text-white/80">
                    {isProduction 
                      ? "An unexpected error has occurred. The system has logged this incident."
                      : this.state.error?.message || "Unknown error occurred"}
                  </p>
                </div>

                {/* Debug Info (Dev Only) */}
                {!isProduction && this.state.errorInfo && (
                  <details className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <summary className="cursor-pointer text-white/60 hover:text-white/80 font-mono text-sm">
                      Technical Details
                    </summary>
                    <pre className="mt-2 text-xs text-white/50 overflow-auto max-h-64">
                      {this.state.error?.stack}
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                {/* Recovery Options */}
                <div className="space-y-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={this.handleReset}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5" />
                    {this.state.errorCount > 2 ? 'Reload Application' : 'Try Again'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/'}
                    className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-white/80 transition-all flex items-center justify-center gap-3"
                  >
                    <Home className="w-5 h-5" />
                    Return to Base
                  </motion.button>

                  {this.state.errorCount > 1 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={this.handleFullReset}
                      className="w-full py-3 px-6 bg-red-900/50 hover:bg-red-900/70 border border-red-500/50 rounded-xl font-bold text-red-300 transition-all flex items-center justify-center gap-3"
                    >
                      <Shield className="w-5 h-5" />
                      Factory Reset (Clear All Data)
                    </motion.button>
                  )}
                </div>

                {/* Error Count Warning */}
                {this.state.errorCount > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-950/30 border border-yellow-500/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <p className="text-yellow-300 text-sm">
                        Multiple errors detected ({this.state.errorCount}). 
                        Consider clearing your browser cache or using Factory Reset.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-900/30 border-t border-gray-800 px-6 py-3">
                <p className="text-center text-white/40 text-xs font-mono">
                  CONTROL STATION OS • ERROR RECOVERY SYSTEM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default TacticalErrorBoundary