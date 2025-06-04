// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ TACTICAL COMMAND CENTER LOGO - CONTROL STATION OS V3.0                  │
// │ Epic animated military command logo with advanced tactical elements         │
// │ Superior to previous version with 3D effects and dynamic animations         │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { motion } from 'framer-motion'

export default function TacticalCommandLogo({ size = 120, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer Tactical Ring */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Base Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-500/40"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)',
              '0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 40px rgba(239, 68, 68, 0.2)',
              '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rotating Tactical Grid */}
        <motion.div
          className="absolute inset-2 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
          }}
        />
        
        {/* Primary Radar Sweep */}
        <motion.div
          className="absolute inset-1 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 330deg,
              rgba(34, 197, 94, 0.4) 340deg,
              rgba(34, 197, 94, 0.8) 350deg,
              rgba(34, 197, 94, 1) 360deg,
              transparent 360deg
            )`
          }}
        />
        
        {/* Secondary Sweep */}
        <motion.div
          className="absolute inset-3 rounded-full overflow-hidden"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 340deg,
              rgba(59, 130, 246, 0.3) 350deg,
              rgba(59, 130, 246, 0.6) 360deg,
              transparent 360deg
            )`
          }}
        />
        
        {/* Range Rings */}
        {[0.25, 0.45, 0.65, 0.85].map((scale, index) => (
          <motion.div
            key={index}
            className="absolute border border-green-400/30 rounded-full"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
            }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              borderColor: [
                'rgba(34, 197, 94, 0.3)',
                'rgba(34, 197, 94, 0.8)', 
                'rgba(34, 197, 94, 0.3)'
              ]
            }}
            transition={{ 
              duration: 2 + index * 0.5, 
              repeat: Infinity, 
              delay: index * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Central Command Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.05, 1],
            rotateZ: [0, 2, 0, -2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Core Command Center */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-orange-500/60 shadow-2xl">
            {/* Inner Glow */}
            <motion.div
              className="absolute inset-1 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/40"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Central Star */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.svg 
                className="w-8 h-8 text-red-400" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M12 2L13.09 8.26L19 7.27L14.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L9.82 12L5 7.27L10.91 8.26L12 2Z" />
              </motion.svg>
            </div>
            
            {/* Tactical Crosshairs */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              {/* Horizontal */}
              <div className="absolute top-1/2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
              {/* Vertical */}
              <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-red-400 to-transparent" />
              
              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-red-400/80" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-red-400/80" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-red-400/80" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-red-400/80" />
            </motion.div>
          </div>
          
          {/* Orbital Elements */}
          {[0, 60, 120, 180, 240, 300].map((rotation, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2"
              style={{
                top: '10%',
                left: '50%',
                transformOrigin: `0 ${size * 0.35}px`,
              }}
              animate={{ 
                rotate: rotation,
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                rotate: { duration: 0, ease: "linear" },
                opacity: { duration: 1 + index * 0.2, repeat: Infinity, delay: index * 0.3 }
              }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg">
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Tactical Scanning Lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{ 
          y: [0, size, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        animate={{ 
          x: [0, size, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Data Blips */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index * 45) * (Math.PI / 180)
        const radius = 25 + (index % 4) * 8
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={index}
            className="absolute w-1.5 h-1.5 bg-green-400 rounded-full"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              backgroundColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(34, 197, 94, 0.5)',
                'rgba(34, 197, 94, 1)'
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        )
      })}
      
      {/* Communication Signals */}
      {[30, 90, 150, 210, 270, 330].map((rotation, index) => (
        <motion.div
          key={index}
          className="absolute w-4 h-4"
          style={{
            top: '15%',
            left: '50%',
            transformOrigin: `0 ${size * 0.35}px`,
          }}
          animate={{ 
            rotate: rotation,
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            rotate: { duration: 0, ease: "linear" },
            opacity: { duration: 1.5, repeat: Infinity, delay: index * 0.25 }
          }}
        >
          <div className="w-1 h-1 bg-yellow-400 rounded-full">
            <motion.div
              className="absolute top-0 left-0 w-1 h-4 bg-gradient-to-t from-yellow-400/60 to-transparent"
              animate={{ scaleY: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
      
      {/* Status Indicators */}
      <div className="absolute top-1 right-1 flex flex-col gap-1">
        <motion.div
          className="w-1.5 h-1.5 bg-green-400 rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-red-400 rounded-full"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      </div>
      
      {/* Outer Defensive Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-red-500/30"
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

// Compact version for headers/navigation
export function CompactTacticalLogo({ size = 40, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/60 overflow-hidden shadow-lg">
        {/* Quick radar sweep */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(
              from 0deg, 
              transparent 0deg,
              transparent 330deg,
              rgba(34, 197, 94, 0.6) 350deg,
              rgba(34, 197, 94, 1) 360deg
            )`
          }}
        />
        
        {/* Central command icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-red-400 rounded-full bg-red-500/20 flex items-center justify-center">
            <motion.svg 
              className="w-3 h-3 text-red-400" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <path d="M12 2L13.09 8.26L19 7.27L14.18 12L19 16.73L13.09 15.74L12 22L10.91 15.74L5 16.73L9.82 12L5 7.27L10.91 8.26L12 2Z" />
            </motion.svg>
          </div>
        </div>
        
        {/* Status indicator */}
        <motion.div
          className="absolute top-1 right-1 w-1 h-1 bg-green-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  )
}