// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 TACTICAL RADAR COMPONENT - MISSION CONTROL UI ELEMENT                    │
// │ Animated radar display for mission tracking and system status               │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { motion } from 'framer-motion'

const TacticalRadar = ({ active = false, size = 120 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <svg className="w-full h-full" viewBox="0 0 120 120">
      {/* Radar circles */}
      {[20, 35, 50, 65].map((r) => (
        <circle
          key={r}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={active ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth="1"
        />
      ))}
      
      {/* Crosshairs */}
      <line x1="60" y1="10" x2="60" y2="110" stroke={active ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)"} strokeWidth="1" />
      <line x1="10" y1="60" x2="110" y2="60" stroke={active ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)"} strokeWidth="1" />
      
      {/* Radar sweep */}
      {active && (
        <>
          <defs>
            <linearGradient id="radarSweep" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
              <stop offset="50%" stopColor="rgba(239, 68, 68, 0.6)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.8)" />
            </linearGradient>
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '60px 60px' }}
          >
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="10"
              stroke="url(#radarSweep)"
              strokeWidth="3"
            />
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="10"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth="6"
              opacity="0.3"
              style={{ filter: 'blur(4px)' }}
            />
          </motion.g>
        </>
      )}
      
      {/* Random blips */}
      {active && [1, 2, 3].map((i) => (
        <motion.circle
          key={`blip-${i}`}
          cx={30 + Math.random() * 60}
          cy={30 + Math.random() * 60}
          r="2"
          fill="#EF4444"
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7,
            times: [0, 0.2, 0.8, 1],
          }}
        />
      ))}
      
      <circle cx="60" cy="60" r="3" fill={active ? "#EF4444" : "#666"} />
      <circle cx="60" cy="60" r="5" fill="none" stroke={active ? "#EF4444" : "#666"} strokeWidth="1" opacity="0.5" />
    </svg>
  </div>
)

export default TacticalRadar