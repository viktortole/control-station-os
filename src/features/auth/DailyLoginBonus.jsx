// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🌅 DAILY LOGIN BONUS - POSITIVE REINFORCEMENT SYSTEM                        │
// │ Creates daily habit formation through reward psychology                      │
// │ Shows immediate gratification upon app opening                               │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sun, Star, Flame, Crown, Gift, Sparkles, Calendar,
  TrendingUp, Award, CheckCircle2, X, Coins
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/* 🌅 DAILY LOGIN BONUS POPUP */
export function DailyLoginBonusPopup() {
  const { dailyLoginBonus, streak } = useGameStore()
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Show bonus popup if we have a daily login bonus for today
    if (dailyLoginBonus) {
      const today = new Date().toDateString()
      if (dailyLoginBonus.date === today && dailyLoginBonus.xp > 0) {
        setIsVisible(true)
        // Auto-show details after 1 second
        setTimeout(() => setShowDetails(true), 1000)
        // Auto-hide after 8 seconds
        setTimeout(() => setIsVisible(false), 8000)
      }
    }
  }, [dailyLoginBonus])

  if (!isVisible || !dailyLoginBonus) return null

  const getBonusIcon = () => {
    if (streak >= 30) return <Crown className="w-12 h-12 text-yellow-400" />
    if (streak >= 14) return <Award className="w-12 h-12 text-purple-400" />
    if (streak >= 7) return <Star className="w-12 h-12 text-blue-400" />
    if (streak >= 3) return <Flame className="w-12 h-12 text-orange-400" />
    return <Sun className="w-12 h-12 text-green-400" />
  }

  const getBonusGradient = () => {
    if (streak >= 30) return 'from-yellow-500 to-orange-500'
    if (streak >= 14) return 'from-purple-500 to-pink-500'
    if (streak >= 7) return 'from-blue-500 to-cyan-500'
    if (streak >= 3) return 'from-orange-500 to-red-500'
    return 'from-green-500 to-emerald-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="relative max-w-lg w-full mx-4"
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-4 bg-gradient-to-r ${getBonusGradient()} rounded-3xl blur-2xl opacity-50`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Main card */}
        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="relative p-8 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
            </div>

            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="inline-block mb-4"
            >
              {getBonusIcon()}
            </motion.div>

            <h2 className={`text-3xl font-black bg-gradient-to-r ${getBonusGradient()} bg-clip-text text-transparent mb-2`}>
              DAILY LOGIN BONUS
            </h2>
            
            <p className="text-white/70 text-lg mb-6">
              Welcome back, Commander!
            </p>

            {/* XP Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 10 }}
              className="relative inline-block"
            >
              <div className={`bg-gradient-to-r ${getBonusGradient()} p-1 rounded-2xl`}>
                <div className="bg-gray-900 rounded-xl px-8 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-4xl font-black text-white font-mono">
                        +{dailyLoginBonus.xp}
                      </p>
                      <p className="text-yellow-400 text-sm font-bold">XP EARNED</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Details section */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10"
              >
                <div className="p-6 space-y-4">
                  {/* Streak info */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-bold">Current Streak</p>
                        <p className="text-white/60 text-sm">{dailyLoginBonus.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-400">{streak}</p>
                      <p className="text-blue-300 text-sm">days</p>
                    </div>
                  </div>

                  {/* Multiplier info */}
                  {dailyLoginBonus.multiplier > 1 && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-bold">Streak Multiplier</p>
                          <p className="text-purple-300 text-sm">Long-term dedication bonus</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-purple-400">
                          {dailyLoginBonus.multiplier}x
                        </p>
                        <p className="text-purple-300 text-sm">bonus</p>
                      </div>
                    </div>
                  )}

                  {/* Next milestone */}
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-white/60 text-sm mb-2">Next milestone:</p>
                    <p className="text-white font-bold">
                      {streak < 3 ? `${3 - streak} days to Streak Building Bonus` :
                       streak < 7 ? `${7 - streak} days to Weekly Champion Bonus` :
                       streak < 14 ? `${14 - streak} days to Two-Week Warrior Bonus` :
                       streak < 30 ? `${30 - streak} days to 30-Day Legend Bonus` :
                       'Maximum streak bonus achieved! 🏆'}
                    </p>
                  </div>

                  {/* Action button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsVisible(false)}
                    className={`w-full py-4 bg-gradient-to-r ${getBonusGradient()} rounded-xl font-bold text-white text-lg shadow-lg`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Continue Mission
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particle effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* 🎁 DAILY LOGIN REMINDER (FOR TOMORROW) */
export function DailyLoginReminder() {
  const { streak } = useGameStore()
  const [nextBonusPreview, setNextBonusPreview] = useState(null)

  useEffect(() => {
    // Calculate what tomorrow's bonus would be
    const baseBonusXP = 50
    let multiplier = 1
    let bonusMessage = "Daily Login Bonus!"
    
    const tomorrowStreak = streak + 1
    
    if (tomorrowStreak >= 30) {
      multiplier = 3.0
      bonusMessage = "🏆 30-Day Legend Bonus!"
    } else if (tomorrowStreak >= 14) {
      multiplier = 2.5
      bonusMessage = "💎 Two-Week Warrior Bonus!"
    } else if (tomorrowStreak >= 7) {
      multiplier = 2.0
      bonusMessage = "⭐ Weekly Champion Bonus!"
    } else if (tomorrowStreak >= 3) {
      multiplier = 1.5
      bonusMessage = "🔥 Streak Building Bonus!"
    }
    
    setNextBonusPreview({
      xp: Math.floor(baseBonusXP * multiplier),
      message: bonusMessage,
      multiplier,
      streak: tomorrowStreak
    })
  }, [streak])

  if (!nextBonusPreview) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-blue-500/30 rounded-xl" />

      <div className="relative p-4">
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-5 h-5 text-blue-400" />
          <h4 className="text-blue-300 font-bold text-sm">Tomorrow's Login Bonus</h4>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold">{nextBonusPreview.message}</p>
            <p className="text-blue-300 text-sm">
              Day {nextBonusPreview.streak} • {nextBonusPreview.multiplier}x multiplier
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-black text-blue-400 font-mono">
              +{nextBonusPreview.xp}
            </p>
            <p className="text-blue-300 text-sm">XP</p>
          </div>
        </div>

        <div className="mt-3 p-2 bg-blue-950/30 rounded-lg border border-blue-500/20">
          <p className="text-blue-300 text-xs text-center">
            💡 Come back tomorrow to claim your bonus and extend your streak!
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🌅 END OF DAILY LOGIN BONUS SYSTEM                                           │
// │ This system creates daily habit formation through:                          │
// │ • Immediate positive reinforcement upon app opening                         │
// │ • Streak multipliers that increase over time                                │
// │ • Preview of tomorrow's bonus (creates anticipation)                       │
// │ • Visual celebration with animations and effects                            │
// │ Combined with other addiction mechanics, this creates daily usage habits.   │
// │ 📁 SAVE AS: src/components/DailyLoginBonus.jsx                              │
// ╰──────────────────────────────────────────────────────────────────────────────╯