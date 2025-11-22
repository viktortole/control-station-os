import React from 'react'
import { motion } from 'framer-motion'

/**
 * CommandEmblem - simplified geometric emblem for Control Station.
 * Lower visual noise, keeps a focused center mark.
 */
export default function CommandEmblem({ size = 120, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer subtle ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}
      />

      {/* Inner shield */}
      <div className="absolute inset-[14%] rounded-2xl bg-gradient-to-br from-[#0f1118] via-[#0b0d14] to-[#111622] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.45)]" />

      {/* Minimal grid */}
      <motion.div
        className="absolute inset-[20%] rounded-xl overflow-hidden"
        animate={{ backgroundPosition: ['0px 0px', '10px 10px'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
          backgroundSize: '10px 10px',
          opacity: 0.45
        }}
      />

      {/* Central insignia */}
      <div className="absolute inset-[34%] rounded-full bg-black/65 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-emerald-400 flex items-center justify-center">
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <span className="rounded-full bg-amber-200" />
            <span className="rounded-full bg-emerald-200" />
            <span className="rounded-full bg-sky-300" />
            <span className="rounded-full bg-red-300" />
          </div>
        </div>
      </div>

      {/* Pulse rings */}
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-[8%] rounded-full border border-white/8"
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
