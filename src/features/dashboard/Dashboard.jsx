// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/Dashboard.jsx                                        │
// │ 📊 PRODUCTION-READY COMMAND CENTER DASHBOARD - CONTROL STATION OS V1.0      │
// │ Compact, beautiful, military-grade interface without tree system            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Sparkles, Target, Brain, Star, Trophy, Zap, Flame, TrendingUp,
  Calendar, Clock, CheckCircle2, Activity, BarChart3, Award,
  ArrowUp, ArrowDown, Minus, ChevronRight, Rocket, Timer, Plus,
  AlertTriangle, Skull, Shield, Crosshair, AlertOctagon, Radio,
  TrendingDown, Users, Swords, Medal, Eye, AlertCircle, Trash2,
  Command, Gauge, Lock, Unlock, Settings, List, Grid3X3
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
// import { getTheme } from '../config/themes' // Not used currently
import { 
  StreakAnxietyWidget, 
  ProgressPressureWidget, 
  SocialProofWidget, 
  QuickWinLauncher,
  AddictionStats 
} from './AddictionWidgets'
import {
  XPDeficitWarning,
  StreakRiskMonitor,
  ConsequencePreview,
  PerformanceDegradation
} from './FearBasedMotivation'
import SystemMonitor from '../../components/shared/SystemMonitor'

/* 🎯 PART 1: PRODUCTION-READY NEW USER ONBOARDING */
function NewUserOnboarding({ onQuickStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-6"
    >
      {/* Military gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-orange-900/20 to-red-900/30" />
      <div className="absolute inset-0 border border-red-500/30 rounded-2xl" />
      
      <div className="relative p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crosshair className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Control Station Active
          </h2>
          <Crosshair className="w-6 h-6 text-red-400" />
        </div>
        
        <p className="text-white/70 mb-6 max-w-lg mx-auto text-sm">
          Military-grade productivity system. Deploy daily missions and earn XP through disciplined execution.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onQuickStart}
          className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold text-white shadow-lg min-h-[44px] min-w-[44px]"
          aria-label="Deploy daily missions to start your productivity workflow"
        >
          <Rocket className="w-5 h-5" />
          Deploy Daily Missions
          <Zap className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

/* 📊 PART 2: COMPACT LEVEL PROGRESS CARD */
function LevelProgressCard({ level, totalXP }) {
  const currentLevelXP = Math.pow(level - 1, 2) * 100
  const nextLevelXP = Math.pow(level, 2) * 100
  const levelProgress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  const xpToNext = nextLevelXP - totalXP
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/60" />
      <div className="absolute inset-0 border border-white/10 rounded-lg" />
      
      <div className="relative p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Level</span>
          </div>
          <span className="text-xl font-black text-white">{level}</span>
        </div>
        
        {/* XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/50">Progress</span>
            <span className="text-white/70 font-mono">{Math.round(levelProgress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, levelProgress))}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/50">
            <span>{totalXP.toLocaleString()}</span>
            <span>{xpToNext} to next</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* 📈 PART 3: DAILY GOAL PROGRESS */
function DailyGoalCard({ todayXP, settings }) {
  const progress = Math.min((todayXP / settings.dailyXPGoal) * 100, 100)
  const isComplete = progress >= 100
  const remaining = Math.max(0, settings.dailyXPGoal - todayXP)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-cyan-900/20" />
      <div className="absolute inset-0 border border-blue-500/20 rounded-lg" />
      
      <div className="relative p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Daily</span>
          </div>
          <span className={`text-xl font-black ${isComplete ? 'text-green-400' : 'text-white'}`}>
            {todayXP}
          </span>
        </div>
        
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/50">Goal: {settings.dailyXPGoal}</span>
            <span className={`font-mono ${isComplete ? 'text-green-400' : 'text-white/70'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-white/50">
            {isComplete ? '✅ Complete!' : `${remaining} left`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* 📊 PART 4: COMPACT STATISTICS GRID */
function StatsGrid({ tasks, stats, totalDemotions }) {
  // Memoize expensive calculations
  const { activeTasks, completedToday } = useMemo(() => {
    const today = new Date().toDateString()
    return {
      activeTasks: tasks.filter(t => !t.completed && !t.failed).length,
      completedToday: tasks.filter(t => 
        t.completed && new Date(t.completedAt).toDateString() === today
      ).length
    }
  }, [tasks])
  
  const statCards = [
    {
      label: 'Active',
      value: activeTasks,
      icon: Activity,
      color: activeTasks > 10 ? 'text-red-400' : 'text-blue-400',
      bg: activeTasks > 10 ? 'bg-red-900/20' : 'bg-blue-900/20'
    },
    {
      label: 'Done',
      value: stats.totalTasksCompleted || 0,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-900/20'
    },
    {
      label: 'Today',
      value: completedToday,
      icon: Calendar,
      color: 'text-orange-400',
      bg: 'bg-orange-900/20'
    },
    {
      label: 'Drops',
      value: totalDemotions || 0,
      icon: TrendingDown,
      color: totalDemotions > 0 ? 'text-red-400' : 'text-gray-400',
      bg: totalDemotions > 0 ? 'bg-red-900/20' : 'bg-gray-900/20'
    }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`relative rounded-lg p-2.5 border border-white/10 ${stat.bg}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ⚡ PART 5: COMPACT QUICK ACTIONS */
function QuickActionsPanel({ onAction }) {
  const actions = [
    { 
      id: 'deploy-templates', 
      label: 'Quick Start', 
      icon: Rocket, 
      color: 'from-red-500 to-orange-500',
      description: 'Deploy missions'
    },
    { 
      id: 'add-task', 
      label: 'New Mission', 
      icon: Plus, 
      color: 'from-purple-500 to-pink-500',
      description: 'Create task'
    },
    { 
      id: 'quick-win', 
      label: 'Quick Strike', 
      icon: Zap, 
      color: 'from-yellow-500 to-orange-500',
      description: '+100 XP'
    },
    { 
      id: 'tasks', 
      label: 'Mission Control', 
      icon: Target, 
      color: 'from-green-500 to-emerald-500',
      description: 'View all'
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Command className="w-4 h-4 text-white/60" />
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
          Quick Actions
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction && onAction(action.id)}
            className="relative group overflow-hidden rounded-lg p-3 bg-gray-900/50 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative flex items-center gap-2">
              <action.icon className="w-4 h-4 text-white/70" />
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white/90 truncate">{action.label}</p>
                <p className="text-xs text-white/50 truncate">{action.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* 📋 PART 6: RECENT ACTIVITY FEED */
function RecentActivity({ tasks, achievements }) {
  const recentActivities = []
  
  // Add recent completions
  tasks
    .filter(t => t.completed)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3)
    .forEach(task => {
      recentActivities.push({
        type: 'completion',
        text: `Completed: ${task.title}`,
        time: task.completedAt,
        icon: CheckCircle2,
        color: 'text-green-400'
      })
    })
  
  // Add recent achievements
  achievements.slice(-2).forEach(() => {
    recentActivities.push({
      type: 'achievement',
      text: `Achievement unlocked`,
      time: new Date().toISOString(),
      icon: Trophy,
      color: 'text-yellow-400'
    })
  })
  
  recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time))
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-white/60" />
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
          Recent Activity
        </h3>
      </div>
      
      <div className="space-y-2">
        {recentActivities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-white/40">No recent activity</p>
            <p className="text-xs text-white/30 mt-1">Complete missions to populate feed</p>
          </div>
        ) : (
          recentActivities.slice(0, 4).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/30 border border-white/5"
            >
              <activity.icon className={`w-3 h-3 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 truncate">{activity.text}</p>
                <p className="text-xs text-white/40">
                  {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

/* 🎯 PART 7: MAIN DASHBOARD COMPONENT */
export default function Dashboard({ onXPAnimation }) {
  const { 
    todayXP, totalXP, level, streak, tasks, achievements, settings, 
    addXP, setView, totalDemotions, stats, deployTemplateSet, deployMission001
  } = useGameStore()
  
  // Calculate metrics
  const todayCompletedTasks = tasks.filter(t => 
    t.completed && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length
  
  // Check if user needs onboarding
  const activeTasksList = tasks.filter(t => !t.completed && !t.failed)
  const isNewUser = activeTasksList.length === 0 && todayCompletedTasks === 0 && totalXP < 100
  const hasCriticalAlerts = totalXP < 0 || totalDemotions > 0
  const needsAttention = streak < 3 || todayXP < settings.dailyXPGoal

  // Handle quick actions
  const handleQuickAction = (action) => {
    if (action === 'quick-win') {
      const result = addXP(100, 'Quick Strike Bonus')
      if (onXPAnimation && result) {
        onXPAnimation(result.amount, result.bonusType)
      }
    } else if (action === 'deploy-templates') {
      const deployedTasks = deployTemplateSet('daily-routine')
      // Quick start: Deployed daily missions
      setView('tasks')
    } else if (action === 'add-task') {
      setView('tasks')
    } else if (action === 'tasks') {
      setView('tasks')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Critical Alerts Section - Compact */}
      {hasCriticalAlerts && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-950/50 to-red-900/30 border border-red-500/50 rounded-lg p-3"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <div className="flex-1">
              <p className="text-red-300 font-bold text-xs uppercase tracking-wide">Critical Alert</p>
              <div className="text-[10px] text-red-400/80 space-x-3">
                {totalXP < 0 && <span>XP Deficit: {Math.abs(totalXP)}</span>}
                {totalDemotions > 0 && <span>{totalDemotions} demotion{totalDemotions > 1 ? 's' : ''}</span>}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🚀 MISSION 001: LOCAL PERFECTION BRIEFING */}
      {!tasks.some(t => t.title.includes('🧪 Test App Daily Usage') || t.projectId === 'development') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-cyan-900/30" />
          <div className="absolute inset-0 border border-cyan-500/30 rounded-xl" />
          
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                    🎖️ Mission 001: Make It Actually Useful
                  </h3>
                  <p className="text-cyan-300 text-sm font-mono">BUILD SOMETHING YOU'LL USE DAILY</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-cyan-400 font-bold">+500 XP</div>
                <div className="text-xs text-white/60">Total Reward</div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-white/80 text-sm mb-2">
                <strong>Goal:</strong> Make this app so useful that you actually use it every day
              </p>
              <p className="text-white/60 text-xs">
                Test it with your real work, fix the most annoying bug, add YOUR actual morning routine, build a Windows installer, and get feedback from one friend.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const deployed = deployMission001()
                  // Mission 001 deployed
                  setView('tasks')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white text-sm shadow-lg"
              >
                <Target className="w-4 h-4" />
                Deploy Mission 001
              </motion.button>
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Clock className="w-3 h-3" />
                1 week • 6 realistic tasks
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* New User Onboarding */}
      {isNewUser && (
        <NewUserOnboarding onQuickStart={() => handleQuickAction('deploy-templates')} />
      )}
      
      {/* Main Dashboard Grid - Tighter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Primary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LevelProgressCard 
              level={level}
              totalXP={totalXP}
            />
            <DailyGoalCard 
              todayXP={todayXP}
              settings={settings}
            />
          </div>
          
          {/* Statistics Overview */}
          <StatsGrid 
            tasks={tasks}
            stats={stats}
            totalDemotions={totalDemotions}
          />

          {/* Fear/Addiction Widgets - Condensed */}
          {needsAttention && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConsequencePreview />
              <StreakRiskMonitor />
            </div>
          )}

          {/* Tactical Performance Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-xl"
          >
            {/* Dynamic gradient background based on performance */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-gray-900/80 to-slate-800/70" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-green-500/10" />
            
            {/* Animated grid overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
            
            <div className="absolute inset-0 border border-slate-500/30 rounded-xl" />
            
            <div className="relative p-6">
              {/* Header with status indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      Tactical Performance Matrix
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">REAL-TIME COMBAT ANALYTICS</p>
                  </div>
                </div>
                
                {/* Performance grade */}
                <div className="text-right">
                  <div className="text-2xl font-black text-yellow-400">
                    {stats.totalTasksCompleted > 0 ? Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))) * 100) >= 90 ? 'A' : 
                     Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))) * 100) >= 80 ? 'B' :
                     Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))) * 100) >= 70 ? 'C' : 'D' : 'F'}
                  </div>
                  <div className="text-xs text-slate-400">GRADE</div>
                </div>
              </div>
              
              {/* Enhanced metrics grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Mission Frequency */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-4 rounded-lg border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">Mission Rate</span>
                    </div>
                    <div className="text-2xl font-black text-blue-400 mb-1">
                      {Math.round(stats.totalTasksCompleted / Math.max(1, (stats.totalDaysActive || 1)))}
                    </div>
                    <div className="text-xs text-slate-400">per day</div>
                    
                    {/* Mini progress bar */}
                    <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stats.totalTasksCompleted / Math.max(1, (stats.totalDaysActive || 1))) * 10)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* XP Efficiency */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-4 rounded-lg border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">XP Output</span>
                    </div>
                    <div className="text-2xl font-black text-purple-400 mb-1">
                      {Math.round(totalXP / Math.max(1, (stats.totalDaysActive || 1)))}
                    </div>
                    <div className="text-xs text-slate-400">per day</div>
                    
                    {/* Mini progress bar */}
                    <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (totalXP / Math.max(1, (stats.totalDaysActive || 1))) / 5)}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Combat Effectiveness */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-4 rounded-lg border border-green-500/20 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-300 font-bold uppercase tracking-wider">Efficiency</span>
                    </div>
                    <div className="text-2xl font-black text-green-400 mb-1">
                      {stats.totalTasksCompleted > 0 ? Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))) * 100) : 0}%
                    </div>
                    <div className="text-xs text-slate-400">success rate</div>
                    
                    {/* Mini progress bar */}
                    <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.totalTasksCompleted > 0 ? Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))) * 100) : 0}%` }}
                        transition={{ duration: 1, delay: 0.9 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Status readout */}
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">SYSTEM STATUS:</span>
                  <span className="text-green-400 font-bold tracking-wider">
                    {totalXP >= 0 ? 'OPERATIONAL' : 'CRITICAL'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right Column - Actions & Activity */}
        <div className="space-y-4">
          <QuickActionsPanel onAction={handleQuickAction} />
          <SystemMonitor compact={true} />
          <RecentActivity tasks={tasks} achievements={achievements} />
          
          {/* Enhanced Engagement Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-lg border border-purple-500/20 overflow-hidden"
          >
            {/* Header section */}
            <div className="p-3 border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">
                  Engagement Zone
                </h3>
              </div>
            </div>
            
            {/* Stats section */}
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/30 rounded-lg p-2.5">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Streak</p>
                  <p className="text-lg font-black text-purple-400">{streak}d</p>
                </div>
                <div className="bg-black/30 rounded-lg p-2.5">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider">Today</p>
                  <p className="text-lg font-black text-pink-400">{todayXP}</p>
                </div>
              </div>
              
              {/* Quick Strike button with proper spacing */}
              <div className="pt-2">
                <QuickWinLauncher onXPAnimation={onXPAnimation} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}