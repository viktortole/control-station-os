// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ TACTICAL HEADER - CONTROL STATION OS                                      │
// │ Military-grade header with proper auth integration and beautiful UI          │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crosshair, Clock, Activity, Zap, Flame, Shield, Crown, Star,
  Skull, ChevronDown, LogOut, User, Settings, TrendingUp,
  AlertTriangle, Medal, BarChart3, Target, Trophy, Volume2, VolumeX
} from 'lucide-react'
import useAuthStore from '../../shared/stores/useAuthStore'
import useGameStore from '../../shared/stores/useGameStore'
import { APP_CONFIG } from '../../shared/config/app.config'
import { getRankDisplay } from '../../shared/config/militaryRanks'

export default function TacticalHeader({ onOpenProfile, onLogout }) {
  const { currentUser } = useAuthStore()
  const { 
    level, 
    totalXP, 
    todayXP, 
    streak, 
    stats,
    setView,
    settings,
    updateSettings
  } = useGameStore()
  
  const [systemTime, setSystemTime] = useState(new Date())
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Update system clock (optimized for performance)
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 60000) // 1 minute
    return () => clearInterval(timer)
  }, [])
  
  // Get professional military rank
  const rank = getRankDisplay(level, stats)
  const RankIcon = rank.icon
  
  // Generate user initials and color
  const getUserInitials = () => {
    const name = currentUser || 'GUEST'
    return name.slice(0, 2).toUpperCase()
  }
  
  const getUserColor = () => {
    const name = currentUser || 'GUEST'
    const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 50%)`
  }
  
  const isInDanger = totalXP < 0 || streak === 0
  
  return (
    <header className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      {/* Danger indicator */}
      {isInDanger && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-500/10 to-red-500/5 animate-pulse" />
      )}
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-2 border border-red-500/30 backdrop-blur-sm">
                  <Crosshair className="w-full h-full text-red-400" />
                </div>
                {isInDanger && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.div>
              
              {/* Brand Name */}
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-white uppercase tracking-wider">
                  Control Station
                </h1>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  Tactical Command v{APP_CONFIG.version}
                </p>
              </div>
            </div>
          </div>
          
          {/* Center: Live Stats (Desktop only) */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Today's XP */}
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <div className="text-sm">
                <span className="font-mono font-bold text-yellow-400">{todayXP}</span>
                <span className="text-white/40 ml-1">XP Today</span>
              </div>
            </motion.div>
            
            {/* Streak */}
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <div className="text-sm">
                <span className="font-mono font-bold text-orange-400">{streak}</span>
                <span className="text-white/40 ml-1">Day Streak</span>
              </div>
            </motion.div>
            
            {/* System Status */}
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-400 uppercase tracking-wider">
                System Active
              </span>
            </motion.div>
          </div>
          
          {/* Right: User Profile and Actions */}
          <div className="flex items-center gap-3">
            {/* System Clock */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-mono text-white/60">
                {systemTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            
            {/* Sound Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-lg border transition-all ${
                settings.soundEnabled 
                  ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                  : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
              }`}
              title={settings.soundEnabled ? 'Sound ON' : 'Sound OFF'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-red-400" />
              )}
            </motion.button>
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-white/20 hover:border-white/30 transition-all"
              >
                {/* User Avatar */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${rank.bgColor} ${rank.borderColor} border-2`}
                    style={{ color: getUserColor() }}
                  >
                    {getUserInitials()}
                  </div>
                  {/* Rank Badge */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${rank.bgColor} ${rank.borderColor} border flex items-center justify-center`}>
                    <RankIcon className={`w-3 h-3 ${rank.color}`} />
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-left">
                  <p className="text-sm font-bold text-white flex items-center gap-1">
                    {currentUser ? currentUser.toUpperCase() : 'GUEST'}
                    <span className="text-xs font-mono text-white/40">L{level}</span>
                  </p>
                  <p className={`text-xs font-medium ${rank.color} uppercase tracking-wide`}>
                    {rank.shortName}
                  </p>
                </div>
                
                {/* Dropdown Arrow */}
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
                  >
                    {/* User Stats */}
                    <div className="p-4 border-b border-white/10">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-white/40 uppercase">Level</p>
                          <p className="text-lg font-bold text-white">{level}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-white/40 uppercase">Points</p>
                          <p className="text-lg font-bold text-blue-400">{(totalXP || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          onOpenProfile()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <User className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/80">Profile Settings</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          setView('stats')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/80">Performance Stats</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          setView('achievements')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-white/60" />
                        <span className="text-sm text-white/80">Achievements</span>
                      </button>
                      
                      <div className="my-2 border-t border-white/10" />
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          onLogout()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}