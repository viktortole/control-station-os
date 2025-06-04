// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 💀 FEAR-BASED MOTIVATION SYSTEM - REAL CONSEQUENCES                          │
// │ Creates genuine anxiety and urgency through loss aversion psychology        │
// │ This is what makes people actually DO their tasks                           │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Skull, AlertTriangle, TrendingDown, Timer, Clock, Heart,
  AlertCircle, XCircle, Flame, Target, Shield, Crosshair,
  Activity, BarChart3, Eye, EyeOff, X, ChevronDown
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/* 💀 PART 1: XP DEFICIT WARNING (CREATES GENUINE ANXIETY) */
export function XPDeficitWarning() {
  const { totalXP, level } = useGameStore()
  const [isVisible, setIsVisible] = useState(true)

  const isInDeficit = totalXP < 0
  const deficitAmount = Math.abs(totalXP)

  if (!isInDeficit || !isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-6"
    >
      {/* Ominous pulsing background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-800"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 border-2 border-red-500 rounded-2xl animate-pulse" />

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/20 to-transparent h-2"
        animate={{ y: [-10, '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <AlertCircle className="w-8 h-8 text-red-400" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-black text-red-300 uppercase tracking-wider">
                XP DEFICIT ALERT
              </h3>
              <p className="text-red-400 text-sm font-bold">
                IMMEDIATE ACTION REQUIRED
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-400/60 hover:text-red-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-950/50 rounded-lg p-4 border border-red-500/30">
            <div className="text-center">
              <p className="text-red-400 text-sm font-bold mb-2">DEFICIT AMOUNT</p>
              <motion.p 
                className="text-3xl font-black text-red-300 font-mono"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                -{deficitAmount}
              </motion.p>
              <p className="text-red-500 text-xs mt-1">XP BELOW ZERO</p>
            </div>
          </div>

          <div className="bg-red-950/50 rounded-lg p-4 border border-red-500/30">
            <div className="text-center">
              <p className="text-red-400 text-sm font-bold mb-2">CURRENT LEVEL</p>
              <p className="text-3xl font-black text-red-300 font-mono">{level}</p>
              <p className="text-red-500 text-xs mt-1">AT RISK OF DEMOTION</p>
            </div>
          </div>

          <div className="bg-red-950/50 rounded-lg p-4 border border-red-500/30">
            <div className="text-center">
              <p className="text-red-400 text-sm font-bold mb-2">STATUS</p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="flex items-center justify-center gap-2"
              >
                <Skull className="w-6 h-6 text-red-400" />
                <p className="text-red-300 font-black text-sm">CRITICAL</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
          <h4 className="text-red-300 font-bold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            RECOVERY PROTOCOL
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-200">Complete {Math.ceil(deficitAmount / 25)} high-value tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-200">Deploy quick wins for immediate XP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-200">Maintain daily streak to prevent further loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-red-200">Avoid task abandonment at all costs</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-red-400/80 text-xs font-mono uppercase tracking-wider">
            ⚠️ FAILURE TO RECOVER WILL RESULT IN FURTHER DEMOTIONS ⚠️
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* 🔥 PART 2: STREAK RISK MONITOR (LOSS AVERSION) */
export function StreakRiskMonitor() {
  const { streak, lastActiveDate } = useGameStore()
  const [timeUntilRisk, setTimeUntilRisk] = useState(null)
  const [riskLevel, setRiskLevel] = useState('safe')

  useEffect(() => {
    const checkStreakRisk = () => {
      const now = new Date()
      const lastActive = new Date(lastActiveDate)
      const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60)
      
      // Calculate hours until streak is at risk (20 hours = warning, 24 hours = loss)
      if (hoursSinceActive >= 20) {
        setRiskLevel('critical')
        setTimeUntilRisk(Math.max(0, 24 - hoursSinceActive))
      } else if (hoursSinceActive >= 16) {
        setRiskLevel('high')
        setTimeUntilRisk(20 - hoursSinceActive)
      } else if (hoursSinceActive >= 12) {
        setRiskLevel('medium')
        setTimeUntilRisk(16 - hoursSinceActive)
      } else {
        setRiskLevel('safe')
        setTimeUntilRisk(null)
      }
    }

    checkStreakRisk()
    const interval = setInterval(checkStreakRisk, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [lastActiveDate])

  if (streak === 0 || riskLevel === 'safe') return null

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'critical': return 'from-red-600 to-red-800'
      case 'high': return 'from-orange-500 to-red-600'
      case 'medium': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-6 h-6 text-red-400" />
      case 'high': return <Clock className="w-6 h-6 text-orange-400" />
      case 'medium': return <Timer className="w-6 h-6 text-yellow-400" />
      default: return <Activity className="w-6 h-6 text-gray-400" />
    }
  }

  const formatTimeRemaining = (hours) => {
    if (hours <= 0) return 'EXPIRED'
    if (hours < 1) return `${Math.floor(hours * 60)}m`
    return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl mb-4"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${getRiskColor()}`}
        animate={{ opacity: riskLevel === 'critical' ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3] }}
        transition={{ duration: riskLevel === 'critical' ? 1 : 2, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-red-500/40 rounded-xl" />

      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: riskLevel === 'critical' ? [1, 1.2, 1] : [1, 1.1, 1],
                rotate: riskLevel === 'critical' ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {getRiskIcon()}
            </motion.div>
            <div>
              <p className="text-white font-bold text-sm">
                🔥 {streak}-Day Streak at Risk!
              </p>
              <p className="text-white/70 text-xs">
                Complete a task to maintain streak
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/60 text-xs">Time Left:</p>
            <motion.p 
              className={`font-mono font-bold text-lg ${
                riskLevel === 'critical' ? 'text-red-400' :
                riskLevel === 'high' ? 'text-orange-400' :
                'text-yellow-400'
              }`}
              animate={riskLevel === 'critical' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {formatTimeRemaining(timeUntilRisk)}
            </motion.p>
          </div>
        </div>

        {riskLevel === 'critical' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-red-950/50 rounded-lg border border-red-500/30"
          >
            <p className="text-red-300 text-sm font-bold text-center">
              ⚠️ STREAK EXPIRES SOON! ⚠️
            </p>
            <p className="text-red-400/80 text-xs text-center mt-1">
              Losing your {streak}-day streak will cost you -25 XP
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* 💔 PART 3: CONSEQUENCE PREVIEW (SHOWS WHAT WILL BE LOST) */
export function ConsequencePreview() {
  const { totalXP, level, streak, tasks } = useGameStore()
  const [showPreview, setShowPreview] = useState(false)
  const [consequences, setConsequences] = useState(null)

  useEffect(() => {
    // Calculate potential consequences
    const activeTasks = tasks.filter(t => !t.completed && !t.failed)
    const oldTasks = activeTasks.filter(t => {
      const taskAge = (Date.now() - new Date(t.createdAt)) / (1000 * 60 * 60)
      return taskAge > 24 // Tasks older than 24 hours
    })

    if (oldTasks.length > 0 || totalXP < 100 || streak >= 3) {
      setConsequences({
        abandonedTasksPenalty: oldTasks.length * 50,
        streakLossPenalty: streak >= 3 ? 25 : 0,
        levelAtRisk: totalXP < 200,
        tasksAtRisk: oldTasks.length,
        potentialDemotion: level > 1 && totalXP < 150
      })
      setShowPreview(true)
    } else {
      setShowPreview(false)
    }
  }, [tasks, totalXP, level, streak])

  if (!showPreview || !consequences) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="relative overflow-hidden rounded-xl mb-4"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-red-900/30" />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-purple-500/30 rounded-xl" />

      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-purple-300 font-bold text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            POTENTIAL CONSEQUENCES
          </h4>
          <button
            onClick={() => setShowPreview(false)}
            className="text-purple-400/60 hover:text-purple-400 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {consequences.tasksAtRisk > 0 && (
            <div className="flex items-center justify-between p-2 bg-red-950/30 rounded-lg">
              <span className="text-red-300 text-sm">
                {consequences.tasksAtRisk} overdue task{consequences.tasksAtRisk > 1 ? 's' : ''}
              </span>
              <span className="text-red-400 font-bold text-sm">
                -{consequences.abandonedTasksPenalty} XP
              </span>
            </div>
          )}

          {consequences.streakLossPenalty > 0 && (
            <div className="flex items-center justify-between p-2 bg-orange-950/30 rounded-lg">
              <span className="text-orange-300 text-sm">
                Streak loss risk ({streak} days)
              </span>
              <span className="text-orange-400 font-bold text-sm">
                -{consequences.streakLossPenalty} XP
              </span>
            </div>
          )}

          {consequences.potentialDemotion && (
            <div className="flex items-center justify-between p-2 bg-red-950/40 rounded-lg border border-red-500/30">
              <span className="text-red-300 text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Level demotion risk
              </span>
              <span className="text-red-400 font-bold text-sm">
                Level {level - 1}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-bold text-sm">
                Total Potential Loss:
              </span>
              <span className="text-red-400 font-bold text-lg">
                -{consequences.abandonedTasksPenalty + consequences.streakLossPenalty} XP
              </span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-center"
        >
          <p className="text-purple-400/80 text-xs font-mono">
            ⚠️ Complete tasks now to avoid these consequences ⚠️
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* 📊 PART 4: PERFORMANCE DEGRADATION TRACKER */
export function PerformanceDegradation() {
  const { stats, totalDemotions, totalXP } = useGameStore()
  const [degradationScore, setDegradationScore] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    // Calculate degradation based on failures, demotions, and negative XP
    const failureRate = stats.totalTasksFailed / Math.max(1, stats.totalTasksCompleted + stats.totalTasksFailed)
    const abandonmentRate = stats.totalTasksAbandoned / Math.max(1, stats.totalTasksCompleted + stats.totalTasksAbandoned)
    const demotionPenalty = totalDemotions * 10
    const xpDeficitPenalty = totalXP < 0 ? Math.abs(totalXP) / 10 : 0

    const score = Math.min(100, 
      (failureRate * 40) + 
      (abandonmentRate * 30) + 
      demotionPenalty + 
      xpDeficitPenalty
    )

    setDegradationScore(Math.round(score))
  }, [stats, totalDemotions, totalXP])

  if (degradationScore < 20) return null

  const getDegradationColor = () => {
    if (degradationScore >= 80) return 'from-red-600 to-red-800'
    if (degradationScore >= 60) return 'from-orange-500 to-red-600'
    if (degradationScore >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-gray-500 to-gray-700'
  }

  const getDegradationLabel = () => {
    if (degradationScore >= 80) return 'CRITICAL FAILURE'
    if (degradationScore >= 60) return 'High Risk'
    if (degradationScore >= 40) return 'Concerning'
    return 'Minor Issues'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl mb-4"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${getDegradationColor()}`}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-red-500/30 rounded-xl" />

      <div className="relative p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-red-400" />
            <div className="text-left">
              <p className="text-red-300 font-bold text-sm">
                Performance Degradation: {degradationScore}%
              </p>
              <p className="text-red-400/80 text-xs">
                {getDegradationLabel()}
              </p>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-red-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-red-950/30 rounded">
                  <p className="text-red-400/60">Failed Tasks</p>
                  <p className="text-red-300 font-bold">{stats.totalTasksFailed}</p>
                </div>
                <div className="p-2 bg-red-950/30 rounded">
                  <p className="text-red-400/60">Abandoned</p>
                  <p className="text-red-300 font-bold">{stats.totalTasksAbandoned}</p>
                </div>
                <div className="p-2 bg-red-950/30 rounded">
                  <p className="text-red-400/60">Demotions</p>
                  <p className="text-red-300 font-bold">{totalDemotions}</p>
                </div>
                <div className="p-2 bg-red-950/30 rounded">
                  <p className="text-red-400/60">XP Lost</p>
                  <p className="text-red-300 font-bold">{stats.totalXPLost || 0}</p>
                </div>
              </div>

              <div className="mt-3 p-2 bg-red-950/20 rounded border border-red-500/20">
                <p className="text-red-300 text-xs text-center">
                  Improve performance by completing tasks and avoiding abandonment
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 💀 END OF FEAR-BASED MOTIVATION SYSTEM                                       │
// │ These components create real anxiety and urgency through:                    │
// │ • XP Deficit Warnings (immediate threat visualization)                      │
// │ • Streak Risk Monitoring (loss aversion psychology)                         │
// │ • Consequence Previews (shows exactly what will be lost)                    │
// │ • Performance Degradation (shame and improvement pressure)                  │
// │ Combined, these create genuine fear of consequences that motivates action.   │
// │ 📁 SAVE AS: src/components/FearBasedMotivation.jsx                          │
// ╰──────────────────────────────────────────────────────────────────────────────╯