// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🏆 ACHIEVEMENTS VIEW - CONTROL STATION OS                                    │
// │ Military commendations and achievement tracking system                      │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Star, Medal, Crown, Shield, Target, Brain, Flame,
  Activity, Zap, Clock, Calendar, TrendingUp, Award,
  CheckCircle2, Lock, Sparkles, Gem, Skull, Heart
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

// Achievement definitions with military theming
const ACHIEVEMENT_DEFINITIONS = {
  'first_task': {
    id: 'first_task',
    name: 'First Mission',
    description: 'Complete your first tactical operation',
    icon: Target,
    rarity: 'common',
    color: 'from-green-500 to-emerald-500',
    points: 50
  },
  'task_streak_3': {
    id: 'task_streak_3',
    name: 'Triple Threat',
    description: 'Complete 3 missions in a row without failure',
    icon: Flame,
    rarity: 'uncommon',
    color: 'from-orange-500 to-red-500',
    points: 100
  },
  'task_streak_7': {
    id: 'task_streak_7',
    name: 'Week Warrior',
    description: 'Maintain 7-day mission streak',
    icon: Calendar,
    rarity: 'rare',
    color: 'from-blue-500 to-cyan-500',
    points: 200
  },
  'level_5': {
    id: 'level_5',
    name: 'Sergeant',
    description: 'Reach Level 5 through disciplined execution',
    icon: Shield,
    rarity: 'common',
    color: 'from-gray-500 to-gray-600',
    points: 75
  },
  'level_10': {
    id: 'level_10',
    name: 'Lieutenant',
    description: 'Achieve Level 10 command status',
    icon: Star,
    rarity: 'uncommon',
    color: 'from-yellow-500 to-orange-500',
    points: 150
  },
  'level_25': {
    id: 'level_25',
    name: 'Captain',
    description: 'Reach Level 25 through superior tactics',
    icon: Medal,
    rarity: 'rare',
    color: 'from-purple-500 to-pink-500',
    points: 300
  },
  'perfectionist': {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 missions with 100% success rate',
    icon: Crown,
    rarity: 'epic',
    color: 'from-yellow-400 to-yellow-600',
    points: 500
  },
  'speed_demon': {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 missions in under 10 minutes each',
    icon: Zap,
    rarity: 'rare',
    color: 'from-cyan-500 to-blue-500',
    points: 250
  },
  'focus_master': {
    id: 'focus_master',
    name: 'Focus Master',
    description: 'Complete 10 focus sessions without abandoning',
    icon: Brain,
    rarity: 'uncommon',
    color: 'from-indigo-500 to-purple-500',
    points: 200
  },
  'survivor': {
    id: 'survivor',
    name: 'Survivor',
    description: 'Recover from negative XP to positive',
    icon: Heart,
    rarity: 'rare',
    color: 'from-pink-500 to-rose-500',
    points: 300
  },
  'elite_commander': {
    id: 'elite_commander',
    name: 'Elite Commander',
    description: 'Reach Level 50 with less than 3 demotions',
    icon: Gem,
    rarity: 'legendary',
    color: 'from-purple-400 to-purple-600',
    points: 1000
  }
}

const RARITY_CONFIG = {
  common: { color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' },
  uncommon: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  rare: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  epic: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  legendary: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' }
}

const AchievementCard = ({ achievement, isUnlocked, progress = 0 }) => {
  const definition = ACHIEVEMENT_DEFINITIONS[achievement] || {}
  const Icon = definition.icon || Trophy
  const rarity = RARITY_CONFIG[definition.rarity] || RARITY_CONFIG.common
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden rounded-xl p-4 border transition-all ${
        isUnlocked 
          ? `${rarity.bg} ${rarity.border} shadow-lg` 
          : 'bg-gray-900/30 border-gray-700/50 opacity-60'
      }`}
    >
      {/* Gradient background */}
      {isUnlocked && (
        <div className={`absolute inset-0 bg-gradient-to-br ${definition.color} opacity-10`} />
      )}
      
      {/* Lock overlay for locked achievements */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-500" />
        </div>
      )}
      
      <div className="relative">
        {/* Icon and title */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${definition.color} p-2.5 ${
            isUnlocked ? 'shadow-lg' : 'grayscale'
          }`}>
            <Icon className="w-full h-full text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold uppercase tracking-wider ${
              isUnlocked ? 'text-white' : 'text-gray-500'
            }`}>
              {definition.name}
            </h3>
            <p className={`text-xs uppercase tracking-wider font-bold ${rarity.color}`}>
              {definition.rarity}
            </p>
          </div>
          {isUnlocked && (
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          )}
        </div>
        
        {/* Description */}
        <p className={`text-sm mb-3 ${
          isUnlocked ? 'text-white/70' : 'text-gray-500'
        }`}>
          {definition.description}
        </p>
        
        {/* Progress bar for partially completed achievements */}
        {!isUnlocked && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}
        
        {/* Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">
              {definition.points} pts
            </span>
          </div>
          {isUnlocked && (
            <span className="text-xs text-green-400 font-mono">
              UNLOCKED
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function AchievementsView() {
  const { achievements, level, totalXP, stats } = useGameStore()
  const [filter, setFilter] = useState('all') // 'all', 'unlocked', 'locked'
  
  // Calculate achievement progress and status
  const achievementStatus = Object.keys(ACHIEVEMENT_DEFINITIONS).map(achievementId => {
    const isUnlocked = achievements.includes(achievementId)
    let progress = 0
    
    // Calculate progress for locked achievements
    if (!isUnlocked) {
      switch (achievementId) {
        case 'task_streak_3':
          progress = Math.min(stats.longestStreak / 3, 1)
          break
        case 'task_streak_7':
          progress = Math.min(stats.longestStreak / 7, 1)
          break
        case 'level_5':
          progress = Math.min(level / 5, 1)
          break
        case 'level_10':
          progress = Math.min(level / 10, 1)
          break
        case 'level_25':
          progress = Math.min(level / 25, 1)
          break
        case 'perfectionist':
          if (stats.totalTasksCompleted >= 10) {
            const successRate = stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))
            progress = successRate >= 1 ? 1 : successRate
          }
          break
        default:
          progress = 0
      }
    }
    
    return {
      id: achievementId,
      isUnlocked,
      progress
    }
  })
  
  // Filter achievements
  const filteredAchievements = achievementStatus.filter(achievement => {
    if (filter === 'unlocked') return achievement.isUnlocked
    if (filter === 'locked') return !achievement.isUnlocked
    return true
  })
  
  const unlockedCount = achievementStatus.filter(a => a.isUnlocked).length
  const totalPoints = achievementStatus
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + (ACHIEVEMENT_DEFINITIONS[a.id]?.points || 0), 0)
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Commendations
          </h1>
          <Award className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-white/60 text-lg mb-6">
          Military honors earned through disciplined execution
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-2xl font-black text-yellow-400">{unlockedCount}</div>
            <div className="text-sm text-yellow-400/70">Achievements</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="text-2xl font-black text-blue-400">{totalPoints}</div>
            <div className="text-sm text-blue-400/70">Total Points</div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="text-2xl font-black text-purple-400">
              {Math.round((unlockedCount / Object.keys(ACHIEVEMENT_DEFINITIONS).length) * 100)}%
            </div>
            <div className="text-sm text-purple-400/70">Completion</div>
          </div>
        </div>
      </motion.div>
      
      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex bg-gray-900/50 rounded-lg p-1 border border-white/10">
          {['all', 'unlocked', 'locked'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                filter === filterType
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {filterType === 'all' ? 'All' : filterType === 'unlocked' ? 'Earned' : 'Locked'}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementCard
                achievement={achievement.id}
                isUnlocked={achievement.isUnlocked}
                progress={achievement.progress}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Skull className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No {filter === 'unlocked' ? 'Earned' : 'Available'} Achievements
          </h3>
          <p className="text-gray-500">
            {filter === 'unlocked' 
              ? 'Complete missions to earn your first commendation'
              : 'All achievements have been earned. Outstanding work, Commander!'
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}