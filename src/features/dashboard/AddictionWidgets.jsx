// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧠 ADDICTION WIDGETS - PSYCHOLOGICAL DOPAMINE TRIGGERS                       │
// │ These components create compulsive checking behavior                         │
// │ Uses all addiction psychology systems to maximize engagement                 │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, TrendingUp, Users, Zap, Clock, Target, Trophy, AlertTriangle,
  Activity, BarChart3, Eye, Heart, Skull, Crown, Star, Rocket,
  Timer, Gauge, AlertCircle, CheckCircle2, X, Plus
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'

/* 🔥 PART 1: STREAK ANXIETY WIDGET (CREATES FEAR OF LOSS) */
export function StreakAnxietyWidget() {
  const { trackCompulsiveCheck } = useGameStore()
  const [streakStatus, setStreakStatus] = useState(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const status = trackCompulsiveCheck()
    setStreakStatus(status)
    
    // Auto-check every 2 minutes (optimized for performance)
    const interval = setInterval(() => {
      const newStatus = trackCompulsiveCheck()
      setStreakStatus(newStatus)
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [trackCompulsiveCheck])

  if (!streakStatus || !isVisible) return null

  const getUrgencyColor = () => {
    switch (streakStatus.status) {
      case 'DANGER': return 'from-red-600 to-red-800'
      case 'WARNING': return 'from-yellow-500 to-orange-600'
      case 'STRONG': return 'from-green-500 to-emerald-600'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  const getIcon = () => {
    switch (streakStatus.status) {
      case 'DANGER': return <AlertTriangle className="w-6 h-6 text-red-400" />
      case 'WARNING': return <Clock className="w-6 h-6 text-yellow-400" />
      case 'STRONG': return <Flame className="w-6 h-6 text-green-400" />
      default: return <Target className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-2xl mb-4"
    >
      {/* Pulsing background for urgency */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${getUrgencyColor()}`}
        animate={{ 
          opacity: streakStatus.status === 'DANGER' ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: streakStatus.status === 'DANGER' ? 1 : 2, 
          repeat: Infinity 
        }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: streakStatus.status === 'DANGER' ? [1, 1.2, 1] : [1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getIcon()}
            </motion.div>
            <div>
              <p className={`font-bold ${streakStatus.color} text-sm`}>
                {streakStatus.message}
              </p>
              {streakStatus.timeRemaining && (
                <p className="text-xs text-white/60 mt-1">
                  ⏰ {streakStatus.timeRemaining} remaining
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* 📈 PART 2: PROGRESS PRESSURE WIDGET (ALMOST THERE PSYCHOLOGY) */
export function ProgressPressureWidget() {
  const { getProgressPressure, getMotivationalMessage, totalXP, level } = useGameStore()
  const [pressure, setPressure] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const updatePressure = () => {
      const newPressure = getProgressPressure()
      const newMessage = getMotivationalMessage()
      setPressure(newPressure)
      setMessage(newMessage)
    }

    updatePressure()
    // Check every 10 seconds for progress updates
    const interval = setInterval(updatePressure, 10000)
    return () => clearInterval(interval)
  }, [totalXP, level, getProgressPressure, getMotivationalMessage])

  if (!pressure && !message) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl mb-4"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-orange-500/30 rounded-xl" />
      
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: pressure?.level === 'CRITICAL' ? [1, 1.3, 1] : [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </motion.div>
          
          <div className="flex-1">
            <motion.p 
              className="text-orange-300 font-bold text-sm"
              animate={pressure?.level === 'CRITICAL' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {message || pressure?.message}
            </motion.p>
            {pressure && (
              <p className="text-orange-400/60 text-xs mt-1">
                {pressure.level} urgency - {pressure.urgency}/10
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* 👥 PART 3: SOCIAL PROOF WIDGET (CREATES FOMO) */
export function SocialProofWidget() {
  const { getSocialProof } = useGameStore()
  const [socialData, setSocialData] = useState(null)
  const [currentActivity, setCurrentActivity] = useState(0)

  useEffect(() => {
    const updateSocialProof = () => {
      const data = getSocialProof()
      setSocialData(data)
    }

    updateSocialProof()
    // Update every 2 minutes to show "live" activity
    const interval = setInterval(updateSocialProof, 120000)
    return () => clearInterval(interval)
  }, [getSocialProof])

  useEffect(() => {
    if (socialData?.recentActivity?.length > 0) {
      const activityInterval = setInterval(() => {
        setCurrentActivity(prev => (prev + 1) % socialData.recentActivity.length)
      }, 3000)
      return () => clearInterval(activityInterval)
    }
  }, [socialData])

  if (!socialData) return null

  const currentRecentActivity = socialData.recentActivity[currentActivity]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'level_up': return <Crown className="w-4 h-4 text-yellow-400" />
      case 'mission_complete': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'streak_milestone': return <Flame className="w-4 h-4 text-orange-400" />
      case 'achievement': return <Trophy className="w-4 h-4 text-purple-400" />
      case 'xp_milestone': return <Star className="w-4 h-4 text-blue-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'level_up': return `reached Level ${activity.level}!`
      case 'mission_complete': return `completed "${activity.mission}"`
      case 'streak_milestone': return `hit ${activity.days}-day streak!`
      case 'achievement': return `unlocked "${activity.achievement}"`
      case 'xp_milestone': return `earned ${activity.xp.toLocaleString()} XP!`
      default: return 'is being productive'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl mb-4"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-blue-500/20 rounded-xl" />
      
      <div className="relative p-4">
        {/* Live stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-4 h-4 text-green-400" />
            </motion.div>
            <span className="text-green-400 font-bold text-sm">
              {socialData.onlineUsers} commanders online
            </span>
          </div>
          
          <div className="text-blue-400 text-xs">
            {socialData.todayMissions.toLocaleString()} missions today
          </div>
        </div>

        {/* Recent activity */}
        <AnimatePresence mode="wait">
          {currentRecentActivity && (
            <motion.div
              key={currentActivity}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
            >
              {getActivityIcon(currentRecentActivity.type)}
              <span className="text-white/80 text-xs">
                <span className="font-bold text-white">
                  {currentRecentActivity.user}
                </span>{' '}
                {getActivityText(currentRecentActivity)}
              </span>
              <span className="text-white/40 text-xs ml-auto">now</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top performer */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Top streak:</span>
            <span className="text-yellow-400 font-bold">
              {socialData.topCommander} - {socialData.topStreak} days
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ⚡ PART 4: TACTICAL QUICK STRIKE LAUNCHER */
export function QuickWinLauncher({ onXPAnimation }) {
  const { deployQuickWins, addXP } = useGameStore()
  const [quickTasks, setQuickTasks] = useState([])
  const [isDeployed, setIsDeployed] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  const handleDeployQuickWins = () => {
    const tasks = deployQuickWins()
    setQuickTasks(tasks)
    setIsDeployed(true)
    setCompletedCount(0)
    
    // Play Quick Strike deployment sound
    TacticalAudio.quickStrike()
    
    // Auto-hide after 30 seconds or when all completed
    setTimeout(() => {
      if (quickTasks.length > 0) setIsDeployed(false)
    }, 30000)
  }

  const handleInstantComplete = (task) => {
    const result = addXP(task.xp, `Quick Strike: ${task.title}`, { taskType: 'instant' })
    
    if (onXPAnimation && result) {
      onXPAnimation(result.amount, result.bonusType, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }

    // Remove from quick tasks and increment completed
    setQuickTasks(prev => prev.filter(t => t.id !== task.id))
    setCompletedCount(prev => prev + 1)
    
    // Auto-hide when all completed
    if (quickTasks.length === 1) {
      setTimeout(() => setIsDeployed(false), 1500)
    }
  }

  if (!isDeployed && quickTasks.length === 0) {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDeployQuickWins}
        className="relative group overflow-hidden rounded-lg p-3 w-full"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 group-hover:opacity-50 transition-opacity" />
        <div className="absolute inset-0 border border-yellow-500/30 group-hover:border-yellow-400/50 transition-colors rounded-lg" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        
        <div className="relative flex items-center justify-center gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Zap className="w-4 h-4 text-yellow-400" />
          </motion.div>
          <span className="text-white font-bold text-xs uppercase tracking-wider">
            Quick Strike
          </span>
          <div className="text-[10px] text-yellow-400/80 font-mono">
            +{completedCount * 25} XP
          </div>
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 rounded-lg p-3 border border-yellow-500/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-yellow-400" />
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Strike</h4>
          {completedCount > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-500/20 px-1.5 py-0.5 rounded text-[10px] text-green-400 font-mono"
            >
              +{completedCount * 25}
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setIsDeployed(false)}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {quickTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Improved hover glow */}
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-green-400/30 to-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
                whileHover={{ scale: 1.02 }}
              />
              
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInstantComplete(task)}
                className="relative w-full p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/60 border border-white/20 hover:border-green-400/50 transition-all backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center justify-center">
                      <span className="text-sm">{task.icon}</span>
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-white font-semibold text-sm leading-tight truncate">{task.title}</p>
                      <p className="text-green-400 text-xs font-mono">+{task.xp} XP Reward</p>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400/80 group-hover:text-green-400 transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {quickTasks.length === 0 && completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-2 bg-green-900/20 rounded border border-green-500/30 mt-2"
        >
          <p className="text-green-400 text-xs font-bold">MISSION COMPLETE!</p>
          <p className="text-green-300 text-[10px]">+{completedCount * 25} XP Earned</p>
        </motion.div>
      )}
    </motion.div>
  )
}

/* 🎯 PART 5: ADDICTION DASHBOARD STATS */
export function AddictionStats() {
  const { getAddictionScore, trackCompulsiveCheck } = useGameStore()
  const [score, setScore] = useState(0)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    const updateStats = () => {
      const newScore = getAddictionScore()
      setScore(newScore)
      setCheckCount(prev => prev + 1)
      trackCompulsiveCheck()
    }

    updateStats()
    // Track every time this component renders (compulsive checking)
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [getAddictionScore, trackCompulsiveCheck])

  const getScoreColor = () => {
    if (score >= 80) return 'text-red-400'
    if (score >= 60) return 'text-orange-400'
    if (score >= 40) return 'text-yellow-400'
    if (score >= 20) return 'text-green-400'
    return 'text-gray-400'
  }

  const getScoreLabel = () => {
    if (score >= 80) return 'HIGHLY ENGAGED 🔥'
    if (score >= 60) return 'Very Active 💪'
    if (score >= 40) return 'Building Momentum 📈'
    if (score >= 20) return 'Getting Started 🌱'
    return 'Just Beginning 👋'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute inset-0 border border-purple-500/20 rounded-xl" />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-bold text-sm">Engagement Score</h4>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gauge className="w-4 h-4 text-purple-400" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Today's Score:</span>
            <span className={`font-bold text-lg ${getScoreColor()}`}>
              {score}/100
            </span>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                score >= 80 ? 'from-red-500 to-red-600' :
                score >= 60 ? 'from-orange-500 to-orange-600' :
                score >= 40 ? 'from-yellow-500 to-yellow-600' :
                score >= 20 ? 'from-green-500 to-green-600' :
                'from-gray-500 to-gray-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <p className={`text-center text-sm font-medium ${getScoreColor()}`}>
            {getScoreLabel()}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <p className="text-white/40">Checks Today</p>
              <p className="text-white font-bold">{checkCount}</p>
            </div>
            <div className="text-center">
              <p className="text-white/40">Engagement</p>
              <p className="text-purple-400 font-bold">
                {score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧠 END OF ADDICTION WIDGETS - PSYCHOLOGICAL DOPAMINE TRIGGERS                │
// │ These components implement proven addiction psychology:                      │
// │ • Streak Anxiety (fear of loss)                                            │
// │ • Progress Pressure (almost there psychology)                               │
// │ • Social Proof (FOMO through fake activity)                                │
// │ • Quick Wins (instant gratification)                                       │
// │ • Addiction Tracking (compulsive behavior monitoring)                       │
// │ Combined, these create compulsive daily usage patterns.                     │
// │ 📁 SAVE AS: src/components/AddictionWidgets.jsx                             │
// ╰──────────────────────────────────────────────────────────────────────────────╯