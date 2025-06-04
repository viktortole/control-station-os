// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/SettingsView.jsx                                    │
// │ ⚙️ SYSTEM CONFIGURATION - CONTROL STATION OS                               │
// │ Military-grade settings management with danger zone controls               │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Skull, Radio, Zap, AlertOctagon, Lock, Unlock 
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'

/* ⚙️ ENHANCED SETTINGS VIEW */
const SettingsView = () => {
  const { settings, updateSettings } = useGameStore()
  const [showDangerZone, setShowDangerZone] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wider">
          System Configuration
        </h2>
        <p className="text-white/60">Adjust tactical parameters. Handle with care.</p>
      </div>
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Punishment System Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skull className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Punishment System</h3>
                <p className="text-xs text-white/60 mt-1">
                  Enable XP loss and level demotion mechanics
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateSettings({ punishmentEnabled: !settings.punishmentEnabled })}
            className={`
              relative w-full h-12 rounded-full transition-all flex items-center
              ${settings.punishmentEnabled 
                ? 'bg-red-600 justify-end' 
                : 'bg-gray-600 justify-start'
              }
              p-1
            `}
          >
            <motion.div
              layout
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              {settings.punishmentEnabled ? (
                <Unlock className="w-5 h-5 text-red-600" />
              ) : (
                <Lock className="w-5 h-5 text-gray-600" />
              )}
            </motion.div>
            <span className={`absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-wider ${
              settings.punishmentEnabled ? 'text-white' : 'text-white/60'
            }`}>
              {settings.punishmentEnabled ? 'ARMED' : 'SAFE'}
            </span>
          </motion.button>
        </motion.div>
        
        {/* Sound Effects Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Sound Effects</h3>
                <p className="text-xs text-white/60 mt-1">
                  Audio feedback for punishments and achievements
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const newSoundState = !settings.soundEnabled
              updateSettings({ soundEnabled: newSoundState })
              TacticalAudio.setEnabled(newSoundState)
              // Play test sound when enabled
              if (newSoundState) {
                setTimeout(() => TacticalAudio.confirmation(), 200)
              }
            }}
            className={`
              relative w-full h-12 rounded-full transition-all
              ${settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'}
            `}
          >
            <motion.div
              className="absolute top-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{ left: settings.soundEnabled ? 'calc(100% - 44px)' : '4px' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {settings.soundEnabled ? '🔊' : '🔇'}
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* Daily XP Goal */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-900/50 rounded-xl p-6 border border-white/10 md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Daily XP Goal</h3>
              <p className="text-xs text-white/60 mt-1">
                Target XP to earn each day. Miss it and face -30 XP punishment.
              </p>
            </div>
            <div className="text-3xl font-black text-yellow-400 font-mono">
              {settings.dailyXPGoal}
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={settings.dailyXPGoal}
              onChange={(e) => updateSettings({ dailyXPGoal: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            <div className="flex justify-between text-xs text-white/40 font-mono">
              <span>50 XP (EASY)</span>
              <span>250 XP (STANDARD)</span>
              <span>500 XP (HARDCORE)</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <button
          onClick={() => setShowDangerZone(!showDangerZone)}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold uppercase tracking-wider"
        >
          <AlertOctagon className="w-5 h-5" />
          <span>Danger Zone</span>
          <motion.div
            animate={{ rotate: showDangerZone ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.div>
        </button>
        
        <AnimatePresence>
          {showDangerZone && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-6 bg-red-950/20 rounded-xl border-2 border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-4 uppercase tracking-wider">
                  ⚠️ Destructive Actions
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (confirm('This will reset ALL progress. Are you absolutely sure?')) {
                        localStorage.clear()
                        window.location.reload()
                      }
                    }}
                    className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 font-bold uppercase tracking-wider transition-all"
                  >
                    Reset All Progress
                  </button>
                  <p className="text-xs text-red-400/60 text-center">
                    This action cannot be undone. All XP, levels, and tasks will be lost.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default SettingsView