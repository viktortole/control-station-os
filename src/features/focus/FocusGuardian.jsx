// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧠 FOCUS GUARDIAN MODULE - POMODORO TIMER WITH PUNISHMENT                   │
// │ BASIC MVP VERSION | 25MIN SESSIONS | XP REWARDS FOR COMPLETION               │
// │ LOCATION: src/modules/FocusGuardian/FocusGuardian.jsx                       │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, RotateCcw, Clock, Brain, Target, Zap, Trophy,
  AlertTriangle, CheckCircle2, XCircle, Timer, Focus
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import { XP_VALUES, PUNISHMENT_VALUES } from '../../shared/config/xp.config'

const FOCUS_SESSIONS = {
  pomodoro: { duration: 25 * 60, xp: XP_VALUES.POMODORO, name: "Pomodoro", color: "from-red-500 to-orange-500" },
  shortBreak: { duration: 5 * 60, xp: XP_VALUES.SHORT_BREAK, name: "Short Break", color: "from-green-500 to-emerald-500" },
  longBreak: { duration: 15 * 60, xp: XP_VALUES.LONG_BREAK, name: "Long Break", color: "from-blue-500 to-cyan-500" },
  deepWork: { duration: 50 * 60, xp: XP_VALUES.DEEP_WORK, name: "Deep Work", color: "from-purple-500 to-pink-500" }
}

export default function FocusGuardian({ onXPAnimation }) {
  const { addXP, punish, settings } = useGameStore()
  
  // Timer state
  const [currentSession, setCurrentSession] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(FOCUS_SESSIONS.pomodoro.duration)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  
  const intervalRef = useRef(null)
  
  // Session complete handler
  const handleSessionComplete = useCallback(() => {
    const session = FOCUS_SESSIONS[currentSession]
    setIsActive(false)
    setIsPaused(false)
    setCompletedSessions(prev => prev + 1)
    
    // Award XP
    const result = addXP(session.xp, `${session.name} Complete`)
    if (onXPAnimation && result) {
      onXPAnimation(result.amount, result.bonusType, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }
    
    // Play tactical completion sound
    if (settings.soundEnabled) {
      TacticalAudio.focusComplete()
    }
    
    // Focus session complete
  }, [currentSession, addXP, onXPAnimation, settings.soundEnabled])
  
  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSessionComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    
    return () => clearInterval(intervalRef.current)
  }, [isActive, isPaused, timeLeft, handleSessionComplete])
  
  // Session abandon handler (punishment)
  const handleAbandonSession = () => {
    if (isActive && sessionStartTime) {
      const session = FOCUS_SESSIONS[currentSession]
      const timeElapsed = (Date.now() - sessionStartTime) / 1000
      const percentComplete = (session.duration - timeLeft) / session.duration
      
      if (percentComplete < 0.5) {
        // Abandoned early - harsh punishment
        punish(Math.abs(PUNISHMENT_VALUES.TASK_ABANDONED), `Abandoned ${session.name} session`, { type: 'focus_abandon' })
      } else {
        // Abandoned late - lighter punishment
        punish(Math.abs(PUNISHMENT_VALUES.TASK_FAILED), `Failed to complete ${session.name}`, { type: 'focus_failure' })
      }
      
      // Play punishment sound
      if (settings.soundEnabled) {
        TacticalAudio.punishment()
      }
    }
    
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(FOCUS_SESSIONS[currentSession].duration)
    setSessionStartTime(null)
  }
  
  // Start session
  const startSession = () => {
    setIsActive(true)
    setIsPaused(false)
    setSessionStartTime(Date.now())
    
    // Play tactical start sound
    if (settings.soundEnabled) {
      TacticalAudio.focusStart()
    }
  }
  
  // Pause session
  const pauseSession = () => {
    setIsPaused(!isPaused)
  }
  
  // Reset session
  const resetSession = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(FOCUS_SESSIONS[currentSession].duration)
    setSessionStartTime(null)
  }
  
  // Change session type
  const changeSession = (type) => {
    if (isActive) {
      handleAbandonSession()
    }
    setCurrentSession(type)
    setTimeLeft(FOCUS_SESSIONS[type].duration)
    setIsActive(false)
    setIsPaused(false)
  }
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const session = FOCUS_SESSIONS[currentSession]
  const progress = ((session.duration - timeLeft) / session.duration) * 100
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Audio now handled by TacticalAudio system */}
      
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Focus Guardian
          </h1>
          <Focus className="w-8 h-8 text-purple-400" />
        </motion.div>
        <p className="text-white/60 text-lg">
          Pomodoro technique with XP rewards and punishment for abandonment
        </p>
      </div>
      
      {/* Session Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {Object.entries(FOCUS_SESSIONS).map(([key, sessionType]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => changeSession(key)}
            disabled={isActive && !isPaused}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
              currentSession === key
                ? 'border-white/30 bg-white/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            } ${isActive && !isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${sessionType.color} opacity-10`} />
            <div className="relative">
              <p className="font-bold text-white/90 mb-1">{sessionType.name}</p>
              <p className="text-sm text-white/60">{Math.floor(sessionType.duration / 60)}min</p>
              <p className="text-xs text-green-400 font-bold">+{sessionType.xp} XP</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Main Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${session.color} opacity-20`} />
        <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
        
        <div className="relative p-12 text-center">
          {/* Progress Ring */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100)
                }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <motion.div
                  animate={isActive && !isPaused ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl font-black font-mono text-white mb-2"
                >
                  {formatTime(timeLeft)}
                </motion.div>
                <p className="text-xl text-white/60 uppercase tracking-wider font-bold">
                  {session.name}
                </p>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            {!isActive ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSession}
                className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-2xl font-bold text-xl text-white transition-colors"
              >
                <Play className="w-6 h-6" />
                Start Session
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseSession}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-colors ${
                    isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetSession}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-bold text-white transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAbandonSession}
                  className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Abandon (-25 XP)
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Session Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Sessions Today</h3>
          </div>
          <p className="text-3xl font-black text-yellow-400 font-mono">{completedSessions}</p>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-white">XP Available</h3>
          </div>
          <p className="text-3xl font-black text-blue-400 font-mono">+{session.xp}</p>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-bold text-white">Progress</h3>
          </div>
          <p className="text-3xl font-black text-green-400 font-mono">{Math.round(progress)}%</p>
        </div>
      </motion.div>
      
      {/* Warning about abandonment */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/30 border border-red-500/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 font-bold">
              Abandoning this session will result in XP loss. Stay focused!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}