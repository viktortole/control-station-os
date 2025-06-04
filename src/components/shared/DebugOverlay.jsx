// 🔍 SMART DEBUG OVERLAY - Collapsible, non-intrusive debugging
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, ChevronDown, ChevronUp, X } from 'lucide-react'
import useAuthStore from '../../shared/stores/useAuthStore'
import useGameStore from '../../shared/stores/useGameStore'

export default function DebugOverlay() {
  const { currentUser, isAuthenticated, isLoading } = useAuthStore()
  const { currentView, level, totalXP, commander } = useGameStore()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  // Get App component states via global debug object
  const [appStates, setAppStates] = React.useState({})
  
  React.useEffect(() => {
    // Check for debug states every 500ms
    const interval = setInterval(() => {
      if (window.debugStates) {
        setAppStates(window.debugStates)
      }
    }, 500)
    
    return () => clearInterval(interval)
  }, [])
  
  // Only show in development
  if (import.meta.env.PROD) return null
  
  // If hidden, don't render
  if (!isVisible) return null
  
  // Quick status indicators
  const authStatus = isAuthenticated ? '✅' : '❌'
  const loadingStatus = isLoading ? '🔄' : '✅'
  const appStatus = appStates.isAppReady ? '✅' : '❌'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-[9999] font-mono text-xs max-h-[80vh] overflow-y-auto"
    >
      <motion.div
        className="bg-black/95 text-white rounded-lg border border-green-500/50 shadow-2xl backdrop-blur-sm"
        layout
      >
        {/* Collapsed Header - Always Visible */}
        <div className="flex items-center justify-between p-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <Bug className="w-3 h-3 text-green-400" />
            <span className="text-green-400 font-bold text-xs">Debug</span>
            <div className="flex items-center gap-1">
              <span title="Auth Status">{authStatus}</span>
              <span title="Loading Status">{loadingStatus}</span>
              <span title="App Status">{appStatus}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
              title="Hide debug overlay"
            >
              <X className="w-3 h-3" />
            </button>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </div>
        
        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-green-500/30"
            >
              <div className="p-3 space-y-2 max-w-xs">
                <div className="text-yellow-400 font-bold">AUTH:</div>
                <div className="grid grid-cols-2 gap-x-2 text-xs">
                  <div>Loaded: {loadingStatus}</div>
                  <div>Auth: {authStatus}</div>
                  <div className="col-span-2">User: {currentUser || 'null'}</div>
                </div>
                
                <div className="text-yellow-400 font-bold">APP:</div>
                <div className="grid grid-cols-2 gap-x-2 text-xs">
                  <div>Ready: {appStatus}</div>
                  <div>Boot: {appStates.showBoot ? '✅' : '❌'}</div>
                </div>
                
                <div className="text-yellow-400 font-bold">GAME:</div>
                <div className="grid grid-cols-2 gap-x-2 text-xs">
                  <div>Level: {level}</div>
                  <div>XP: {totalXP}</div>
                  <div className="col-span-2">View: {currentView || 'null'}</div>
                  <div className="col-span-2">Cmd: {commander || 'null'}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Show button when hidden */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 p-2 bg-black/80 text-green-400 rounded-lg border border-green-500/50 hover:bg-black/90 transition-colors"
          title="Show debug overlay"
        >
          <Bug className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}