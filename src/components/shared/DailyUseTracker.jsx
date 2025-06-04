// 📊 DAILY USE TRACKER - Track actual daily usage for Mission 001
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

const DailyUseTracker = () => {
  const [usage, setUsage] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const { tasks } = useGameStore()
  
  // Load usage data from localStorage
  useEffect(() => {
    const savedUsage = localStorage.getItem('daily-usage-tracker')
    if (savedUsage) {
      setUsage(JSON.parse(savedUsage))
    }
  }, [])
  
  // Save usage data when it changes
  useEffect(() => {
    localStorage.setItem('daily-usage-tracker', JSON.stringify(usage))
  }, [usage])
  
  // Initialize today's usage if not exists
  useEffect(() => {
    const today = new Date().toDateString()
    
    setUsage(prev => {
      // Only update if today doesn't exist
      if (!prev[today]) {
        return {
          ...prev,
          [today]: {
            date: today,
            sessionStart: Date.now(),
            tasksCompleted: 0,
            timeSpent: 0,
            notes: '',
            bugs: [],
            improvements: []
          }
        }
      }
      return prev
    })
  }, []) // Run once on mount
  
  // Update session time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString()
      setUsage(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          timeSpent: (prev[today]?.timeSpent || 0) + 1 // minutes
        }
      }))
    }, 60000)
    
    return () => clearInterval(interval)
  }, []) // Run once on mount
  
  // Track completed tasks - only update when count changes
  useEffect(() => {
    const today = new Date().toDateString()
    const todayTasks = tasks.filter(t => 
      t.completed && new Date(t.completedAt).toDateString() === today
    ).length
    
    setUsage(prev => {
      // Only update if the count actually changed
      if (prev[today] && prev[today].tasksCompleted !== todayTasks) {
        return {
          ...prev,
          [today]: {
            ...prev[today],
            tasksCompleted: todayTasks
          }
        }
      } else if (!prev[today] && todayTasks > 0) {
        // Initialize if today doesn't exist and we have tasks
        return {
          ...prev,
          [today]: {
            ...prev[today],
            tasksCompleted: todayTasks
          }
        }
      }
      return prev
    })
  }, [tasks])
  
  const todayUsage = usage[new Date().toDateString()] || {}
  const last7Days = Object.keys(usage)
    .sort()
    .slice(-7)
    .map(date => usage[date])
  
  const addNote = (type, text) => {
    const today = new Date().toDateString()
    setUsage(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        [type]: [...(prev[today]?.[type] || []), {
          text,
          timestamp: Date.now()
        }]
      }
    }))
  }
  
  const totalDaysUsed = Object.keys(usage).length
  const avgTimePerDay = last7Days.reduce((acc, day) => acc + (day?.timeSpent || 0), 0) / last7Days.length
  const totalTasksCompleted = last7Days.reduce((acc, day) => acc + (day?.tasksCompleted || 0), 0)
  
  if (!isVisible) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-32 left-4 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg shadow-lg transition-colors z-50"
        title="Daily Usage Tracker"
      >
        <Calendar className="w-4 h-4 text-green-400" />
      </motion.button>
    )
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed bottom-44 left-4 w-72 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-green-500/30 shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-bold text-white">Daily Usage</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white/80 transition-colors text-lg"
            >
              ×
            </button>
          </div>
          
          {/* Today's Stats */}
          <div className="p-2 border-b border-green-500/20">
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
              Today's Progress
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/30 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-white/60">Time</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {Math.round(todayUsage.timeSpent || 0)}m
                </div>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-white/60">Tasks</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {todayUsage.tasksCompleted || 0}
                </div>
              </div>
            </div>
          </div>
          
          {/* 7-Day Overview */}
          <div className="p-2 border-b border-green-500/20">
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
              Weekly Overview
            </h4>
            <div className="space-y-1">
              {last7Days.map((day, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-white/60">
                    {day ? new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'No data'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">{day?.timeSpent || 0}m</span>
                    <span className="text-green-400">{day?.tasksCompleted || 0} tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="p-2 border-b border-green-500/20">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-green-400">{totalDaysUsed}</div>
                <div className="text-xs text-white/60">Days Used</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{Math.round(avgTimePerDay)}</div>
                <div className="text-xs text-white/60">Avg Min/Day</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{totalTasksCompleted}</div>
                <div className="text-xs text-white/60">Tasks/Week</div>
              </div>
            </div>
          </div>
          
          {/* Quick Notes */}
          <div className="p-3">
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
              Quick Notes
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const note = prompt('What worked well today?')
                  if (note) addNote('improvements', note)
                }}
                className="w-full p-2 text-xs bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 transition-colors"
              >
                + What worked well?
              </button>
              <button
                onClick={() => {
                  const note = prompt('What was annoying or confusing?')
                  if (note) addNote('bugs', note)
                }}
                className="w-full p-2 text-xs bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
              >
                + What was annoying?
              </button>
            </div>
            
            {/* Show recent notes */}
            {(todayUsage.bugs?.length > 0 || todayUsage.improvements?.length > 0) && (
              <div className="mt-2 text-xs space-y-1">
                {todayUsage.improvements?.slice(-2).map((note, i) => (
                  <div key={i} className="text-green-400 bg-green-500/10 p-1 rounded">
                    ✓ {note.text}
                  </div>
                ))}
                {todayUsage.bugs?.slice(-2).map((note, i) => (
                  <div key={i} className="text-red-400 bg-red-500/10 p-1 rounded">
                    ⚠ {note.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Mission 001 Progress */}
          {totalDaysUsed >= 3 && (
            <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/5 border-t border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-400">Mission 001 Progress</span>
              </div>
              <p className="text-xs text-white/80">
                Great! You've used the app for {totalDaysUsed} days. Ready to fix that annoying bug and add your morning routine?
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DailyUseTracker