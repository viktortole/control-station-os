// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/Layout.jsx                                           │
// │ 🏢 CONTROL STATION OS - PROFESSIONAL PRODUCTIVITY PLATFORM                  │
// │ Multi-module app shell with clean, professional interface                   │
// │ Clean UI focused on productivity and task management                         │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🏁 PART 1: IMPORTS & DEPENDENCIES */
import React, { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Activity, BarChart3, Target, Brain, Trophy, TrendingUp, Settings,
  Menu, X, Zap, Flame, Star, ChevronRight, Layers, Bell,
  Moon, Sun, Volume2, VolumeX, Shield, Crown, Gem, Skull,
  AlertTriangle, Crosshair, Radio, AlertOctagon, Clock,
  TrendingDown, Heart, ChevronDown, Terminal, Lock
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import useAuthStore from '../../shared/stores/useAuthStore'
import { getTheme } from '../../shared/config/themes'
import TacticalHeader from './TacticalHeader'
import UserProfile from '../../features/settings/UserProfile'

/* 🌌 PART 2: TACTICAL BACKGROUND */
export function TacticalBackground() {
  const { settings } = useGameStore()
  const isDanger = false
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - darker and more military */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Alert overlay for dying tree */}
      {isDanger && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
          }}
        />
      )}
      
      {/* Tactical grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }}
      />
      
      {/* Scan lines */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
        />
      </div>
      
      {/* Warning stripes for critical state */}
      {isDanger && (
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(239, 68, 68, 0.1) 100px, rgba(239, 68, 68, 0.1) 200px)'
          }}
        />
      )}
      
      {/* Heavy vignette */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>
    </div>
  )
}

/* 🎯 PART 3: LEGACY TACTICAL HEADER - NOW REPLACED */
function LegacyTacticalHeader() {
  const { 
    level, 
    totalXP, 
    streak, 
    settings, 
    totalDemotions,
    commander,
    stats,
    todayXP
  } = useGameStore()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [systemTime, setSystemTime] = useState(new Date())
  const [showUserProfile, setShowUserProfile] = useState(false)
  
  // Update time every minute (optimized for performance)
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 60000) // 1 minute
    return () => clearInterval(timer)
  }, [])
  
  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to close profile dropdown
      if (e.key === 'Escape' && showUserProfile) {
        setShowUserProfile(false)
        e.preventDefault()
      }
      // Enter/Space to open profile when focused
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.getAttribute('aria-haspopup') === 'menu') {
        setShowUserProfile(!showUserProfile)
        e.preventDefault()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showUserProfile])
  
  // Enhanced rank system based on achievements and level (memoized)
  const userRank = useMemo(() => {
    const completionRate = stats.totalTasksCompleted > 0 
      ? Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + stats.totalTasksFailed + stats.totalTasksAbandoned)) * 100)
      : 0
    
    if (level >= 100 && completionRate >= 90) return {
      title: 'Executive',
      icon: Crown,
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-400/50',
      description: 'Peak productivity achieved'
    }
    if (level >= 75 && completionRate >= 85) return {
      title: 'Senior Manager',
      icon: Gem,
      color: 'text-purple-400', 
      gradient: 'from-purple-400 to-pink-500',
      glow: 'shadow-purple-400/50',
      description: 'Excellent performance record'
    }
    if (level >= 50 && completionRate >= 80) return {
      title: 'Team Lead',
      icon: Shield,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500',
      glow: 'shadow-blue-400/50',
      description: 'Proven leadership skills'
    }
    if (level >= 25 && completionRate >= 70) return {
      title: 'Coordinator',
      icon: Star,
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-500',
      glow: 'shadow-green-400/50',
      description: 'Strong organizational skills'
    }
    if (totalDemotions > 3 || completionRate < 50) return {
      title: 'Trainee',
      icon: Skull,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-orange-600',
      glow: 'shadow-orange-400/50',
      description: 'Building foundation skills'
    }
    return {
      title: 'Operator',
      icon: Star,
      color: 'text-gray-400',
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-gray-400/50',
      description: 'Building foundation'
    }
  }, [level, stats, totalDemotions])
  
  // Generate user avatar based on username and level (memoized)
  const avatar = useMemo(() => {
    const name = commander || 'UNKNOWN'
    const initials = name.substring(0, 2).toUpperCase()
    const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    
    return {
      initials,
      background: `hsl(${hue}, 70%, 50%)`,
      border: userRank.color
    }
  }, [commander, userRank])
  
  const rank = userRank
  const isDanger = totalXP < 0
  
  return (
    <header className="relative z-40 border-b border-white/10">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-black/98 to-gray-900/95 backdrop-blur-2xl" />
      
      {/* Alert indicator for critical states */}
      {isDanger && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
      )}
      
      <div className="relative px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left section - Simplified Brand */}
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white/60" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-white/60" aria-hidden="true" />
              )}
            </button>
            
            {/* Compact Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/10 p-2 border border-red-500/30">
                  <Crosshair className="w-full h-full text-red-400" />
                </div>
                {isDanger && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black text-white/90 uppercase tracking-wide leading-none">
                  Control Station
                </h1>
                <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest mt-0.5">
                  Productivity Platform
                </p>
              </div>
            </div>
          </div>
          
          {/* Center - Quick Stats (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-mono text-white/60">{todayXP} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-mono text-white/60">{streak}d</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-mono text-green-400/80">ACTIVE</span>
            </div>
          </div>
          
          {/* Right section - Streamlined User Profile */}
          <div className="flex items-center gap-3">
            {/* Clock - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-mono text-white/50">
                {systemTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            
            {/* Compact User Profile */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserProfile(!showUserProfile)}
              className="relative group"
              aria-label={`User profile for ${commander || 'Unknown'} - Level ${level} ${rank.title}`}
              aria-expanded={showUserProfile}
              aria-haspopup="menu"
            >
              <div className="relative flex items-center gap-2.5 bg-white/5 hover:bg-white/10 px-3 py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all min-h-[44px]">
                {/* User Avatar */}
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border"
                    style={{ 
                      backgroundColor: avatar.background + '20',
                      borderColor: avatar.border.replace('text-', '').replace('400', '500'),
                      color: avatar.background
                    }}
                  >
                    {avatar.initials}
                  </div>
                  {rank.title !== 'Operator' && (
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded ${rank.color} bg-current/20 flex items-center justify-center`}>
                      <rank.icon className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                
                {/* User Info - Hidden on mobile */}
                <div className="hidden sm:block min-w-0">
                  <p className="text-xs font-semibold text-white/90 truncate">
                    {commander || 'UNKNOWN'}
                  </p>
                  <p className={`text-[10px] font-medium ${rank.color} uppercase tracking-wide`}>
                    {rank.title}
                  </p>
                </div>
                
                {/* Level Badge */}
                <div className="flex items-center gap-1">
                  <div className={`text-lg font-black ${
                    isDanger ? 'text-red-400' : 'text-white/90'
                  }`}>
                    {level}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                </div>
                
                {/* Critical Warning */}
                {(totalDemotions > 0 || isDanger) && (
                  <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              
              {/* Streamlined Profile Dropdown */}
              <AnimatePresence>
                {showUserProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className={`p-4 bg-gradient-to-r ${rank.gradient}/10 border-b border-white/10`}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border"
                          style={{ 
                            backgroundColor: avatar.background + '20',
                            borderColor: avatar.border.replace('text-', '').replace('400', '500'),
                            color: avatar.background
                          }}
                        >
                          {avatar.initials}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-white">
                            {commander || 'UNKNOWN'}
                          </h3>
                          <p className={`text-xs font-medium ${rank.color} uppercase tracking-wide`}>
                            {rank.title}
                          </p>
                          <p className="text-xs text-white/60">
                            {rank.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                          <div className="text-2xl font-black text-blue-400">{totalXP}</div>
                          <div className="text-xs text-white/50">Total XP</div>
                        </div>
                        <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                          <div className="text-2xl font-black text-orange-400">{streak}</div>
                          <div className="text-xs text-white/50">Day Streak</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-green-500/10 rounded-lg">
                          <div className="text-2xl font-black text-green-400">{stats.totalTasksCompleted}</div>
                          <div className="text-xs text-white/50">Completed</div>
                        </div>
                        <div className="text-center p-2 bg-red-500/10 rounded-lg">
                          <div className="text-2xl font-black text-red-400">{totalDemotions}</div>
                          <div className="text-xs text-white/50">Demotions</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* XP Counter */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className={`absolute inset-0 ${
                totalXP < 0 ? 'bg-red-500/20' : 'bg-blue-500/20'
              } rounded-2xl blur-xl`} />
              <div className={`relative flex items-center gap-2 bg-gray-900/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border ${
                totalXP < 0 ? 'border-red-500/50' : 'border-blue-500/20'
              }`}>
                {totalXP < 0 ? (
                  <Skull className="w-5 h-5 text-red-400" />
                ) : (
                  <Zap className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                    {totalXP < 0 ? 'XP DEBT' : 'TOTAL XP'}
                  </p>
                  <p className={`text-xl font-black font-mono -mt-1 ${
                    totalXP < 0 ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {totalXP < 0 ? Math.abs(totalXP) : totalXP.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Alert Status */}
            {isDanger && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/50"
              >
                <AlertOctagon className="w-5 h-5 text-red-400" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-red-500/20"
          >
            <MobileNav onClose={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* 🧭 PART 4: TACTICAL NAVIGATION */
export function TacticalNavigation() {
  const { currentView, setView, tasks, settings, totalDemotions, stats } = useGameStore()
  const activeTasks = tasks.filter(t => !t.completed).length
  
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Command Center', 
      icon: BarChart3, 
      badge: null,
      description: 'Tactical Overview'
    },
    { 
      id: 'tasks', 
      label: 'Mission Control', 
      icon: Target, 
      badge: activeTasks || null,
      description: 'Active Operations',
      alert: activeTasks > 10
    },
    { 
      id: 'focus', 
      label: 'Focus Guardian', 
      icon: Brain, 
      badge: null,
      description: 'Deep Work Mode'
    },
    { 
      id: 'achievements', 
      label: 'Commendations', 
      icon: Trophy, 
      badge: null,
      description: 'Earned Honors'
    },
    { 
      id: 'stats', 
      label: 'Intelligence', 
      icon: TrendingUp, 
      badge: null,
      description: 'Performance Data'
    },
    { 
      id: 'settings', 
      label: 'System Config', 
      icon: Settings, 
      badge: null,
      description: 'Operational Settings'
    },
  ]
  
  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className="hidden lg:flex w-64 bg-black/50 backdrop-blur-xl border-r border-red-500/20 flex-col"
    >
      {/* System Status */}
      <div className="p-4 border-b border-red-500/20">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40 font-mono uppercase">System Status</span>
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          {totalDemotions > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-orange-400 font-bold">
                {totalDemotions} SETBACK{totalDemotions > 1 ? 'S' : ''} RECORDED
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(item.id)}
              className={`w-full relative overflow-hidden rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-red-950/30 border border-red-500/30' 
                  : 'hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {/* Active indicator */}
              {currentView === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                />
              )}
              
              <div className="relative flex items-center gap-3 px-4 py-3">
                <item.icon className={`w-5 h-5 ${
                  currentView === item.id 
                    ? 'text-red-400' 
                    : 'text-white/50'
                }`} />
                <div className="flex-1 text-left">
                  <p className={`font-bold text-sm uppercase tracking-wider ${
                    currentView === item.id 
                      ? 'text-white' 
                      : 'text-white/60'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/30 font-mono">
                    {item.description}
                  </p>
                </div>
                {item.badge && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-2 py-1 text-xs rounded-lg font-bold font-mono ${
                      item.alert
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : currentView === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    {item.badge}
                  </motion.span>
                )}
                {currentView === item.id && (
                  <ChevronRight className="w-4 h-4 text-red-400/40" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Bottom Status */}
      <div className="p-4 border-t border-red-500/20">
        <div className="p-4 bg-gray-900/50 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-4 h-4 text-red-400/60" />
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold">
              Platform Version
            </p>
          </div>
          <p className="font-black text-blue-400 uppercase">
            CONTROL STATION OS
          </p>
          <p className="text-[10px] text-white/30 font-mono mt-1">
            V2.0 • Professional Edition
          </p>
        </div>
      </div>
    </nav>
  )
}

/* 📱 PART 5: MOBILE NAVIGATION */
function MobileNav({ onClose }) {
  const { currentView, setView, tasks, totalDemotions } = useGameStore()
  const activeTasks = tasks.filter(t => !t.completed).length
  
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: BarChart3, badge: null },
    { id: 'tasks', label: 'Missions', icon: Target, badge: activeTasks || null },
    { id: 'focus', label: 'Focus', icon: Brain, badge: null },
    { id: 'achievements', label: 'Honors', icon: Trophy, badge: null },
    { id: 'stats', label: 'Intel', icon: TrendingUp, badge: null },
    { id: 'settings', label: 'Config', icon: Settings, badge: null },
  ]
  
  const handleNavClick = (viewId) => {
    setView(viewId)
    onClose()
  }
  
  return (
    <div id="mobile-navigation" className="bg-black/95 backdrop-blur-xl border-b border-red-500/20">
      <div className="p-4 space-y-2">
        {navItems.map(item => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick(item.id)}
            className={`w-full relative overflow-hidden rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-red-950/30 border border-red-500/30' 
                : 'bg-white/[0.02] border border-transparent'
            }`}
          >
            <div className="relative flex items-center gap-3 px-4 py-3">
              <item.icon className={`w-5 h-5 ${
                currentView === item.id 
                  ? 'text-red-400' 
                  : 'text-white/50'
              }`} />
              <span className={`flex-1 text-left font-bold uppercase tracking-wider text-sm ${
                currentView === item.id 
                  ? 'text-white' 
                  : 'text-white/60'
              }`}>
                {item.label}
              </span>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-lg font-bold font-mono ${
                  currentView === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-800/50 text-gray-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Alert Section */}
      {totalDemotions > 0 && (
        <div className="p-4 border-t border-red-500/20">
          <div className="p-3 bg-red-950/30 rounded-lg border border-red-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-400 font-bold uppercase">
                {totalDemotions} Setback{totalDemotions > 1 ? 's' : ''} on Record
              </span>
              <Skull className="w-4 h-4 text-red-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* 🚀 PART 6: TACTICAL APP SHELL */
export function TacticalAppShell({ children }) {
  const { checkStreak } = useGameStore()
  const { logout } = useAuthStore()
  const [showUserProfile, setShowUserProfile] = useState(false)
  
  // Check streak on mount
  useEffect(() => {
    checkStreak()
  }, [checkStreak])
  
  // Set up dynamic viewport height handling
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)
    
    return () => {
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])
  
  return (
    <div className="relative flex text-white" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Tactical background */}
      <TacticalBackground />
      
      {/* Main layout structure */}
      <div className="relative flex flex-1">
        {/* Desktop sidebar */}
        <TacticalNavigation />
        
        {/* Main content area */}
        <main className="flex-1 flex flex-col min-h-0">
          <TacticalHeader 
            onOpenProfile={() => setShowUserProfile(true)}
            onLogout={logout}
          />
          <div className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 lg:px-6 lg:py-6">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </div>
  )
}

/* 🎯 PART 7: LAYOUT PROVIDER (Default Export) */
export default function Layout({ children }) {
  return (
    <TacticalAppShell>
      {children}
    </TacticalAppShell>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🏢 END OF Layout.jsx                                                         │
// │ 📁 SAVE THIS FILE AS: src/components/Layout.jsx (REPLACE EXISTING)           │
// │ This creates the military-grade tactical command frame                       │
// │ Complete with punishment indicators and fear-driven UI                      │
// ╰──────────────────────────────────────────────────────────────────────────────╯