// 📊 PERFORMANCE MONITOR - Track app performance in development
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cpu, HardDrive, Gauge } from 'lucide-react'

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    renderTime: 0,
    componentCount: 0
  })
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  
  useEffect(() => {
    if (!import.meta.env.DEV) return
    
    let animationId
    const measureFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
        frameCount.current = 0
        lastTime.current = currentTime
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0,
          renderTime: Math.round(currentTime - performance.timing.navigationStart),
          componentCount: document.querySelectorAll('[data-react-component]').length || 
                         document.querySelectorAll('[class*="jsx"]').length
        }))
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }
    
    if (isVisible) {
      measureFPS()
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isVisible])
  
  // Only show in development
  if (!import.meta.env.DEV) return null
  
  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg shadow-lg transition-colors z-50"
        title="Performance Monitor"
      >
        <Activity className="w-4 h-4 text-purple-400" />
      </motion.button>
      
      {/* Monitor Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-16 left-4 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-purple-500/30 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/5">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Performance Monitor
              </h4>
            </div>
            
            <div className="p-3 space-y-2">
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-white/60">FPS</span>
                </div>
                <span className={`text-xs font-mono font-bold ${
                  metrics.fps >= 50 ? 'text-green-400' : 
                  metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {metrics.fps}
                </span>
              </div>
              
              {/* Memory */}
              {performance.memory && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-white/60">Memory</span>
                  </div>
                  <span className="text-xs font-mono text-white/80">
                    {metrics.memory} MB
                  </span>
                </div>
              )}
              
              {/* Render Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-white/60">Render</span>
                </div>
                <span className="text-xs font-mono text-white/80">
                  {(metrics.renderTime / 1000).toFixed(1)}s
                </span>
              </div>
              
              {/* Component Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-white/60">Components</span>
                </div>
                <span className="text-xs font-mono text-white/80">
                  ~{metrics.componentCount}
                </span>
              </div>
            </div>
            
            {/* Warning */}
            {metrics.fps < 30 && (
              <div className="p-2 bg-red-500/10 border-t border-red-500/20">
                <p className="text-xs text-red-400">
                  ⚠️ Low FPS detected
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PerformanceMonitor