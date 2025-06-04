// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ MILITARY COMMAND CENTER LOGO - CONTROL STATION OS                        │
// │ Epic animated military logo with radar, crosshairs, and tactical elements   │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { motion } from 'framer-motion'

export default function MilitaryLogo({ size = 120, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Base Container */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-red-500/30 shadow-2xl overflow-hidden">
        
        {/* Background Tactical Grid */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0',
          }}
        />
        
        {/* Rotating Radar Sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 340deg,
              rgba(34, 197, 94, 0.3) 350deg,
              rgba(34, 197, 94, 0.6) 360deg,
              transparent 360deg
            )`
          }}
        />
        
        {/* Secondary Radar Sweep (Slower) */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 350deg,
              rgba(59, 130, 246, 0.2) 355deg,
              rgba(59, 130, 246, 0.4) 360deg,
              transparent 360deg
            )`
          }}
        />
        
        {/* Concentric Circles (Range Rings) */}
        {[0.3, 0.5, 0.7, 0.9].map((scale, index) => (
          <motion.div
            key={index}
            className="absolute border border-green-500/20 rounded-full"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
            }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              scale: [scale, scale * 1.02, scale]
            }}
            transition={{ 
              duration: 3 + index * 0.5, 
              repeat: Infinity, 
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Central Command Hub */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Main Central Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-2 border-white/50 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L19 7.27L14.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L9.82 12L5 7.27L10.91 8.26L12 2Z" />
              </svg>
            </div>
            
            {/* Crosshair Overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {/* Horizontal Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-400 to-transparent" />
              
              {/* Corner Brackets */}
              <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-red-400" />
              <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-red-400" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-red-400" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-red-400" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scanning Lines */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{ 
            y: [0, size, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Data Points (Blips) */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index * 60) * (Math.PI / 180)
          const radius = 30 + (index % 3) * 10
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          
          return (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-green-400 rounded-full"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3,
                ease: "easeInOut"
              }}
            />
          )
        })}
        
        {/* Satellite Communication Indicators */}
        {[45, 135, 225, 315].map((rotation, index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3"
            style={{
              top: '20%',
              left: '50%',
              transformOrigin: `0 ${size * 0.3}px`,
            }}
            animate={{ 
              rotate: rotation,
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              rotate: { duration: 0, ease: "linear" },
              opacity: { duration: 1.5, repeat: Infinity, delay: index * 0.4 }
            }}
          >
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
            <motion.div
              className="absolute top-0 left-0 w-1 h-3 bg-gradient-to-t from-blue-400/50 to-transparent"
              animate={{ scaleY: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            />
          </motion.div>
        ))}
        
        {/* Outer Ring Glow */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-500/50"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Status Indicators */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <motion.div
            className="w-1 h-1 bg-green-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-1 h-1 bg-yellow-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-1 h-1 bg-red-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </div>
      
      {/* Outer Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(239, 68, 68, 0.3)',
            '0 0 40px rgba(239, 68, 68, 0.5)',
            '0 0 20px rgba(239, 68, 68, 0.3)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// Smaller variant for headers/navigation
export function CompactMilitaryLogo({ size = 40, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black border border-red-500/50 overflow-hidden">
        {/* Simple radar sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 340deg,
              rgba(34, 197, 94, 0.4) 350deg,
              rgba(34, 197, 94, 0.6) 360deg
            )`
          }}
        />
        
        {/* Central crosshair */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border border-red-400 rounded-full bg-red-500/20">
            <svg className="w-full h-full text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L19 7.27L14.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L9.82 12L5 7.27L10.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
        
        {/* Status dot */}
        <motion.div
          className="absolute top-1 right-1 w-1 h-1 bg-green-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  )
}