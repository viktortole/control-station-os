import React from 'react'
import { motion } from 'framer-motion'

/**
 * CommandEmblem - geometric animated emblem for Control Station.
 * Keeps file size small while delivering a more intentional look.
 */
export default function CommandEmblem({ size = 120, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'conic-gradient(from 90deg, rgba(255,72,88,0.35), rgba(62,201,255,0.25), rgba(255,214,94,0.35), rgba(255,72,88,0.35))',
          filter: 'drop-shadow(0 8px 20px rgba(255,72,88,0.25))'
        }}
      />

      {/* Inner shield */}
      <div className="absolute inset-[14%] rounded-[30%] bg-gradient-to-br from-[#10131f] via-[#0b0d15] to-[#141926] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.35)]" />

      {/* Hex grid overlay */}
      <motion.div
        className="absolute inset-[18%] rounded-[28%] overflow-hidden mix-blend-screen"
        animate={{ backgroundPosition: ['0px 0px', '12px 12px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0)',
          backgroundSize: '12px 12px'
        }}
      />

      {/* Central insignia */}
      <div className="absolute inset-[32%] rounded-full bg-gradient-to-br from-amber-400/80 via-red-500/80 to-emerald-400/80 flex items-center justify-center shadow-[0_8px_20px_rgba(255,82,82,0.45)]">
        <div className="w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm grid grid-cols-2 gap-1 p-1">
          <span className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-orange-400" />
          <span className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
          <span className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-yellow-500" />
          <span className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-lime-400" />
        </div>
      </div>

      {/* Pulsing dots */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-[8%] rounded-full border border-white/10"
          animate={{ scale: [1, 1.05, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
