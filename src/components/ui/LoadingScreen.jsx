// 🎬 LOADING SCREEN - Tactical loading experience
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crosshair, Shield, Cpu, Database, Wifi, 
  Lock, Activity, Terminal, Zap 
} from 'lucide-react'

const LoadingScreen = ({ message = "Initializing Control Station OS..." }) => {
  const [loadingStage, setLoadingStage] = useState(0)
  const [loadingText, setLoadingText] = useState('')
  
  const stages = [
    { text: 'Booting tactical systems...', icon: Cpu, duration: 800 },
    { text: 'Establishing secure connection...', icon: Lock, duration: 600 },
    { text: 'Loading mission data...', icon: Database, duration: 1000 },
    { text: 'Calibrating XP engine...', icon: Zap, duration: 700 },
    { text: 'Activating command interface...', icon: Terminal, duration: 500 },
    { text: 'System ready.', icon: Shield, duration: 300 },
  ]
  
  useEffect(() => {
    // Animate through loading stages
    let currentStage = 0
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setLoadingStage(currentStage)
        setLoadingText(stages[currentStage].text)
        currentStage++
      }
    }, 400)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'slide 20s linear infinite'
          }}
        />
      </div>
      
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent"
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ height: '20%' }}
      />
      
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="mb-8 relative"
        >
          <Crosshair className="w-24 h-24 text-red-400 mx-auto" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-32 h-32 border-2 border-red-500/30 rounded-full" />
          </motion.div>
        </motion.div>
        
        {/* App Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-black text-white uppercase tracking-wider mb-2"
        >
          Control Station OS
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/60 text-sm uppercase tracking-widest mb-12"
        >
          Military-Grade Productivity System
        </motion.p>
        
        {/* Loading stages */}
        <div className="mb-8 h-16">
          <AnimatePresence mode="wait">
            {stages.map((stage, index) => {
              if (index !== loadingStage) return null
              const Icon = stage.icon
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3"
                >
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-mono text-sm">
                    {loadingText}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-green-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((loadingStage + 1) / stages.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-xs text-white/40 font-mono">
            {Math.round(((loadingStage + 1) / stages.length) * 100)}%
          </div>
        </div>
        
        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-xs text-white/30 font-mono"
        >
          {message}
        </motion.p>
      </div>
      
      {/* Corner indicators */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <motion.div
          key={corner}
          className={`absolute w-8 h-8 border-2 border-red-500/50 ${
            corner === 'top-left' ? 'top-4 left-4 border-r-0 border-b-0' :
            corner === 'top-right' ? 'top-4 right-4 border-l-0 border-b-0' :
            corner === 'bottom-left' ? 'bottom-4 left-4 border-r-0 border-t-0' :
            'bottom-4 right-4 border-l-0 border-t-0'
          }`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: corner.includes('right') ? 0.5 : 0 }}
        />
      ))}
    </div>
  )
}

export default LoadingScreen