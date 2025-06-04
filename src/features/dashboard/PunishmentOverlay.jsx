// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/PunishmentOverlay.jsx                               │
// │ 💀 PUNISHMENT OVERLAY SYSTEM - CONTROL STATION OS                          │
// │ Military-grade visual punishment and consequence display                     │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Skull, AlertTriangle, TrendingDown, AlertOctagon 
} from 'lucide-react'

/* 💀 PART 1: PUNISHMENT OVERLAY COMPONENT - MILITARY GRADE */
const PunishmentOverlay = ({ punishment }) => {
  const audioRef = useRef(null)
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    // Play punishment sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        console.warn('Punishment audio blocked - user interaction required')
      })
    }
    
    // Trigger screen shake (optimized - avoid document.body animation)
    const shakeElement = document.getElementById('root')
    if (shakeElement) {
      shakeElement.style.transform = 'translateX(0)'
      shakeElement.style.animation = 'tacticalShake 500ms ease-out'
      setTimeout(() => {
        shakeElement.style.animation = ''
        shakeElement.style.transform = ''
      }, 500)
    }
    
    // Show details after initial impact
    setTimeout(() => setShowDetails(true), 300)
  }, [])
  
  const severity = punishment.demoted ? 'CRITICAL' : 
                  punishment.amount >= 50 ? 'SEVERE' :
                  punishment.amount >= 25 ? 'HIGH' : 'STANDARD'
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Audio element */}
      <audio ref={audioRef} src="/sounds/punishment.mp3" />
      
      {/* Red flash overlay with gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.5, 0.3, 0.1, 0],
          backgroundColor: [
            'rgba(239, 68, 68, 0)',
            'rgba(239, 68, 68, 0.5)',
            'rgba(220, 38, 38, 0.3)',
            'rgba(239, 68, 68, 0.1)',
            'rgba(0, 0, 0, 0)'
          ]
        }}
        transition={{ duration: 0.8, times: [0, 0.2, 0.5, 0.8, 1] }}
      />
      
      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 0, 0, 0.03) 2px,
            rgba(255, 0, 0, 0.03) 4px
          )`,
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Central punishment display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="bg-gray-900/95 backdrop-blur-xl border-2 border-red-500 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -5, 5, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 0.6 }}
            className="text-red-500 mb-4 flex justify-center"
          >
            {punishment.demoted ? 
              <TrendingDown className="w-16 h-16" /> : 
              <Skull className="w-16 h-16" />
            }
          </motion.div>
          
          {/* Main message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-red-500 mb-2 uppercase tracking-wider"
          >
            {punishment.demoted ? 'DEMOTION' : 'PUNISHMENT'}
          </motion.h1>
          
          {/* Severity indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 ${
              severity === 'CRITICAL' ? 'bg-red-900 text-red-300 border border-red-500' :
              severity === 'SEVERE' ? 'bg-red-800 text-red-200 border border-red-400' :
              severity === 'HIGH' ? 'bg-orange-800 text-orange-200 border border-orange-400' :
              'bg-yellow-800 text-yellow-200 border border-yellow-400'
            }`}
          >
            {severity} INFRACTION
          </motion.div>
          
          {/* Punishment details */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">XP LOST:</span>
                <span className="text-red-400 font-bold font-mono">-{punishment.amount}</span>
              </div>
              
              {punishment.demoted && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">RANK:</span>
                  <span className="text-red-400 font-bold">DEMOTED</span>
                </div>
              )}
              
              <div className="text-xs text-white/40 bg-black/30 rounded-lg p-3 font-mono">
                REASON: {punishment.reason || 'Disciplinary action'}
              </div>
              
              {/* Warning message */}
              <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 rounded-lg p-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Performance below acceptable standards</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Warning stripes at edges */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(239, 68, 68, 0.1) 0px,
              rgba(239, 68, 68, 0.1) 20px,
              transparent 20px,
              transparent 40px
            )
          `,
        }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.1) 50%, transparent 100%)
          `,
        }}
        animate={{ 
          x: [-100, window.innerWidth + 100],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 0.8, 
          delay: 0.4,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

export default PunishmentOverlay