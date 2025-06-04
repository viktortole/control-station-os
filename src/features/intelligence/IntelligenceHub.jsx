// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📊 INTELLIGENCE HUB - CONTROL STATION OS                                     │
// │ Comprehensive analytics and performance tracking for tactical commanders     │
// │ Real-time metrics, failure analysis, and productivity insights              │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  Target, Crosshair, Clock, Zap, Skull, Trophy, Calendar,
  Activity, Eye, Shield, Gauge, Timer, CheckCircle2, XCircle,
  ArrowUp, ArrowDown, Minus, ChevronDown, ChevronUp, Filter,
  Download, RefreshCw, Settings, AlertCircle, Star, Flame
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/**
 * Intelligence Hub - Military-Grade Analytics Dashboard
 * Provides comprehensive performance tracking and failure analysis
 * for tactical productivity optimization
 */
export default function IntelligenceHub() {
  const {
    stats,
    totalXP,
    level,
    streak,
    tasks,
    achievements,
    treeHealth,
    settings,
    transactionLog,
    addictionMetrics
  } = useGameStore()

  const [selectedPeriod, setSelectedPeriod] = useState('all') // today, week, month, all
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Filter tasks based on selected period
  const filteredTasks = useMemo(() => {
    if (selectedPeriod === 'all') return tasks
    
    const now = new Date()
    let startDate
    
    switch (selectedPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        startDate = weekStart
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        return tasks
    }
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.completedAt || task.failedAt)
      return taskDate >= startDate
    })
  }, [tasks, selectedPeriod])

  // Calculate comprehensive metrics with error protection
  const metrics = useMemo(() => {
    try {
      // Calculate stats from filtered tasks for the selected period
      const periodStats = {
        totalTasksCompleted: filteredTasks.filter(t => t.completed).length,
        totalTasksFailed: filteredTasks.filter(t => t.failed).length,
        totalTasksAbandoned: filteredTasks.filter(t => t.status === 'abandoned').length,
        totalXPEarned: filteredTasks.filter(t => t.completed).reduce((sum, t) => sum + (t.actualXPAwarded || t.xp || 0), 0),
        totalXPLost: filteredTasks.filter(t => t.failed).reduce((sum, t) => sum + 25, 0) // Standard XP loss for failed tasks
      }
      
      // Fallback to global stats if no period data
      const safeStats = selectedPeriod === 'all' ? {
        totalTasksCompleted: stats?.totalTasksCompleted || 0,
        totalTasksFailed: stats?.totalTasksFailed || 0,
        totalTasksAbandoned: stats?.totalTasksAbandoned || 0,
        totalXPEarned: stats?.totalXPEarned || 0,
        totalXPLost: stats?.totalXPLost || 0
      } : periodStats
      
      const totalTasks = safeStats.totalTasksCompleted + safeStats.totalTasksFailed + safeStats.totalTasksAbandoned
      const completionRate = totalTasks > 0 ? Math.round((safeStats.totalTasksCompleted / totalTasks) * 100) : 0
      const failureRate = totalTasks > 0 ? Math.round((safeStats.totalTasksFailed / totalTasks) * 100) : 0
      const abandonmentRate = totalTasks > 0 ? Math.round((safeStats.totalTasksAbandoned / totalTasks) * 100) : 0
      
      const avgXPPerTask = safeStats.totalTasksCompleted > 0 ? Math.round(safeStats.totalXPEarned / safeStats.totalTasksCompleted) : 0
      const netXP = safeStats.totalXPEarned - safeStats.totalXPLost
      const efficiency = safeStats.totalXPEarned > 0 ? Math.round((netXP / safeStats.totalXPEarned) * 100) : 100

    // Get recent performance trend from filtered tasks
    const recentTasks = filteredTasks.slice(-10)
    const recentSuccess = recentTasks.filter(t => t.completed).length
    const trendDirection = recentSuccess >= 7 ? 'up' : recentSuccess >= 4 ? 'stable' : 'down'

    // Calculate threat level based on multiple factors
    const threatFactors = [
      { name: 'Low Completion Rate', value: completionRate < 70, weight: 3 },
      { name: 'High Abandonment', value: abandonmentRate > 20, weight: 2 },
      { name: 'Negative XP Trend', value: efficiency < 80, weight: 2 },
      { name: 'Low Streak', value: streak < 3, weight: 1 },
      { name: 'Tree Health Critical', value: treeHealth === 'dying', weight: 3 }
    ]
    
    const threatScore = threatFactors.reduce((acc, factor) => {
      return acc + (factor.value ? factor.weight : 0)
    }, 0)

    const threatLevel = threatScore >= 8 ? 'CRITICAL' : 
                      threatScore >= 5 ? 'HIGH' : 
                      threatScore >= 3 ? 'MODERATE' : 'LOW'

    return {
      totalTasks,
      completionRate,
      failureRate,
      abandonmentRate,
      avgXPPerTask,
      netXP,
      efficiency,
      trendDirection,
      threatLevel,
      threatScore,
      threatFactors: threatFactors.filter(f => f.value),
      periodStats: safeStats
    }
    } catch (error) {
      console.warn('IntelligenceHub: Error calculating metrics, using defaults', error)
      return {
        totalTasks: 0, completionRate: 0, failureRate: 0, abandonmentRate: 0,
        avgXPPerTask: 0, netXP: 0, efficiency: 100, trendDirection: 'stable',
        threatLevel: 'LOW', threatScore: 0, threatFactors: [], periodStats: {}
      }
    }
  }, [filteredTasks, stats, streak, treeHealth, selectedPeriod])

  // Get performance grade
  const getPerformanceGrade = () => {
    const score = metrics.completionRate
    if (score >= 90) return { grade: 'A+', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (score >= 80) return { grade: 'A', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    if (score >= 70) return { grade: 'B', color: 'text-blue-400', bgColor: 'bg-blue-500/20' }
    if (score >= 60) return { grade: 'C', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' }
    if (score >= 50) return { grade: 'D', color: 'text-orange-400', bgColor: 'bg-orange-500/20' }
    return { grade: 'F', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  }

  const performanceGrade = getPerformanceGrade()

  // Tactical metric cards
  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900/50 rounded-xl p-6 border border-white/10 relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-6 h-6 text-${color}-400`} />
          {trend && (
            <div className="flex items-center gap-1">
              {trend === 'up' && <ArrowUp className="w-4 h-4 text-green-400" />}
              {trend === 'down' && <ArrowDown className="w-4 h-4 text-red-400" />}
              {trend === 'stable' && <Minus className="w-4 h-4 text-yellow-400" />}
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-3xl font-black font-mono text-white mb-1">{value}</p>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </motion.div>
  )

  // Threat Assessment Panel
  const ThreatAssessment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">THREAT ASSESSMENT</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            metrics.threatLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
            metrics.threatLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
            metrics.threatLevel === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {metrics.threatLevel}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80">Threat Score</span>
            <span className="font-mono font-bold text-white">{metrics.threatScore}/11</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                metrics.threatLevel === 'CRITICAL' ? 'bg-red-500' :
                metrics.threatLevel === 'HIGH' ? 'bg-orange-500' :
                metrics.threatLevel === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.threatScore / 11) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        
        {metrics.threatFactors.length > 0 && (
          <div>
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Active Threats
            </h4>
            <div className="space-y-2">
              {metrics.threatFactors.map((factor, index) => (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-500/20"
                >
                  <span className="text-red-300 text-sm">{factor.name}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(factor.weight)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-red-400 rounded-full" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {metrics.threatFactors.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-bold">ALL SYSTEMS OPERATIONAL</p>
            <p className="text-white/60 text-sm">No active threats detected</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Database className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Intelligence Hub
          </h1>
          <BarChart3 className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-white/60 text-lg">
          Tactical analytics and performance optimization for maximum productivity
        </p>
      </motion.div>

      {/* Period Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex justify-center"
      >
        <div className="flex bg-gray-900/50 rounded-lg p-1 border border-white/10">
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'all', label: 'All Time' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                selectedPeriod === period.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Mission Success"
          value={`${metrics.completionRate.toFixed(1)}%`}
          subtitle={`${metrics.periodStats.totalTasksCompleted || 0}/${metrics.totalTasks} missions`}
          icon={Target}
          trend={metrics.trendDirection}
          color="green"
        />
        
        <MetricCard
          title="Combat Efficiency"
          value={`${metrics.efficiency.toFixed(1)}%`}
          subtitle={`${metrics.netXP} net XP gained`}
          icon={Zap}
          trend={metrics.netXP > 0 ? 'up' : 'down'}
          color="blue"
        />
        
        <MetricCard
          title="Current Level"
          value={level}
          subtitle={`${totalXP} total experience`}
          icon={Star}
          color="purple"
        />
        
        <MetricCard
          title="Streak Status"
          value={`${streak} days`}
          subtitle="Daily commitment"
          icon={Flame}
          trend={streak >= 7 ? 'up' : streak >= 3 ? 'stable' : 'down'}
          color="orange"
        />
      </motion.div>

      {/* Performance Grade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-xl ${performanceGrade.bgColor} flex items-center justify-center`}>
              <span className={`text-4xl font-black ${performanceGrade.color}`}>
                {performanceGrade.grade}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Performance Grade</h3>
              <p className="text-white/60">Based on mission completion rate</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black font-mono text-white mb-1">
              {metrics.completionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-white/60">
              {metrics.totalTasks} total missions
            </div>
          </div>
        </div>
      </motion.div>

      {/* Threat Assessment and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThreatAssessment />
        
        {/* Detailed Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Gauge className="w-6 h-6 text-blue-400" />
              Detailed Metrics
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{metrics.periodStats.totalTasksCompleted || 0}</div>
                <div className="text-xs text-white/60">Completed</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{metrics.periodStats.totalTasksFailed || 0}</div>
                <div className="text-xs text-white/60">Failed</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Skull className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{metrics.periodStats.totalTasksAbandoned || 0}</div>
                <div className="text-xs text-white/60">Abandoned</div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{achievements.length}</div>
                <div className="text-xs text-white/60">Achievements</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Average XP per Task</span>
                <span className="font-mono text-white">{metrics.avgXPPerTask.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white/60">Failure Rate</span>
                <span className="font-mono text-red-400">{metrics.failureRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white/60">Abandonment Rate</span>
                <span className="font-mono text-orange-400">{metrics.abandonmentRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-green-400" />
            Recent Mission Activity
          </h2>
        </div>
        
        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No mission data for {
                selectedPeriod === 'today' ? 'today' :
                selectedPeriod === 'week' ? 'this week' :
                selectedPeriod === 'month' ? 'this month' :
                'selected period'
              }</p>
              <p className="text-white/40 text-sm">Deploy some missions to see analytics</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.slice(-5).reverse().map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : task.failed ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-white font-medium">{task.title}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white/80">
                      {task.completed ? `+${task.actualXPAwarded || task.xp}` : task.failed ? '-25' : 'Pending'} XP
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}