// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 MISSION STATUS INDICATOR COMPONENT                                        │
// │ Individual task display with completion, deletion, and status management     │
// │ EXTRACTED FROM: MissionControl.jsx for performance optimization             │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  CheckCircle2, Activity, XCircle, Coins, Calendar, Radio, Eye, EyeOff,
  Skull, AlertTriangle
} from 'lucide-react'
import useGameStore from '../../../shared/stores/useGameStore'
import { TacticalAudio } from '../../../shared/utils/AdvancedMilitarySoundEngine'
import MissionTypeIcon from './MissionTypeIcon'

const MissionStatusIndicator = React.forwardRef(({ task, onComplete, onFailure, onAbandon, onXPAnimation }, ref) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false) // FIXED: Prevent double-click
  const [isDeleting, setIsDeleting] = useState(false) // FIXED: Prevent double-delete
  
  const { projects } = useGameStore()
  const project = projects.find(p => p.id === task.projectId) || projects[0]
  const controls = useAnimation()
  const cardRef = useRef(null)
  
  const priorityConfig = {
    high: { 
      gradient: 'from-red-500/30 to-red-600/30', 
      color: 'text-red-400',
      icon: 'from-red-500 to-red-600',
      status: 'CRITICAL',
      pulse: 'animate-pulse',
      badge: '🔴'
    },
    medium: { 
      gradient: 'from-yellow-500/30 to-yellow-600/30', 
      color: 'text-yellow-400',
      icon: 'from-yellow-500 to-yellow-600',
      status: 'STANDARD',
      pulse: '',
      badge: '🟡'
    },
    low: { 
      gradient: 'from-green-500/30 to-green-600/30', 
      color: 'text-green-400',
      icon: 'from-green-500 to-green-600',
      status: 'ROUTINE',
      pulse: '',
      badge: '🟢'
    },
  }
  
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  
  const handleComplete = async (e) => {
    // FIXED: Prevent double-click
    if (isCompleting || task.completed) return
    
    setIsCompleting(true)
    
    // FIXED: Get click position from currentTarget
    const rect = e.currentTarget.getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    
    // FIXED: Add bounds checking
    position.x = Math.max(100, Math.min(window.innerWidth - 100, position.x))
    position.y = Math.max(100, Math.min(window.innerHeight - 100, position.y))
    
    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]) // Tactical pattern
    }
    
    await controls.start({ scale: [1, 1.05, 0.95, 1], rotate: [0, 5, -5, 0] })
    
    // Trigger completion with XP animation
    const result = onComplete(task.id)
    
    // Play mission completion sound
    TacticalAudio.missionComplete()
    if (result && onXPAnimation) {
      // Small delay for visual feedback
      setTimeout(() => {
        onXPAnimation(result.amount, result.bonusType, position)
      }, 100)
    }
    
    // Keep button disabled
    setIsCompleting(false)
  }
  
  const handleDelete = () => {
    if (isDeleting) return
    setShowDeleteConfirm(true)
  }
  
  const confirmDelete = async (action) => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    if (action === 'fail') {
      onFailure(task.id)
    } else if (action === 'abandon') {
      onAbandon(task.id)
    }
    
    // Wait for animation
    setTimeout(() => {
      setShowDeleteConfirm(false)
      setIsDeleting(false)
    }, 300)
  }
  
  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.8 }}
      whileHover={{ x: 8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Mission Panel */}
      <motion.div 
        className={`absolute inset-0 rounded-xl border-2 transition-all ${
          task.completed 
            ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm border-green-500/20' 
            : `bg-gray-900/40 backdrop-blur-sm border-white/10 hover:border-white/20 ${priority.gradient}`
        }`}
        animate={isHovered && !task.completed ? {
          borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Priority Glow */}
      {!task.completed && priority.pulse && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${priority.icon} opacity-20 ${priority.pulse}`} />
      )}
      
      {/* Content */}
      <div className="relative flex items-center gap-4 p-4">
        {/* Left - Status */}
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <motion.button
            whileHover={isCompleting ? {} : { scale: 1.1, rotate: 180 }}
            whileTap={isCompleting ? {} : { scale: 0.9 }}
            onClick={handleComplete}
            disabled={isCompleting || task.completed}
            className={`flex-shrink-0 w-10 h-10 rounded-lg border-2 relative ${
              task.completed 
                ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/30' 
                : `border-white/60 hover:border-white/80 bg-gray-900/50 ${priority.color.replace('text-', 'hover:border-')}`
            } transition-all flex items-center justify-center backdrop-blur-sm ${
              isCompleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {task.completed ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>
            ) : isCompleting ? (
              <Activity className="w-5 h-5 text-white/60 animate-spin" />
            ) : (
              <div className={`w-4 h-4 rounded-sm bg-gradient-to-br ${priority.icon} ${priority.pulse}`} />
            )}
          </motion.button>
          
          {/* Priority Badge */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">{priority.badge}</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">
              {priority.status}
            </span>
          </div>
        </div>
        
        {/* Middle - Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
            <h4 className={`font-bold text-base md:text-lg ${
              task.completed ? 'line-through text-white/50' : 'text-white/90'
            }`}>
              {task.title}
            </h4>
            {task.missionType && task.missionType !== 'standard' && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 rounded-full border border-blue-500/30">
                <MissionTypeIcon type={task.missionType} />
                <span className="text-[10px] font-bold text-blue-300 uppercase hidden sm:inline">
                  {task.missionType}
                </span>
              </div>
            )}
            {task.completed && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 text-[10px] font-black rounded-full bg-green-900/30 border border-green-500/30 text-green-300 uppercase tracking-wider whitespace-nowrap"
              >
                COMPLETE
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono flex-wrap">
            <span className={`flex items-center gap-1.5 ${priority.color} font-bold`}>
              <Radio className="w-3 h-3" />
              <span className="hidden sm:inline">{priority.status}</span>
              <span className="sm:hidden">{priority.badge}</span>
            </span>
            
            <span className={`font-bold flex items-center gap-1.5 ${
              task.completed ? 'text-green-400' : 'text-blue-400'
            }`}>
              <Coins className="w-3.5 h-3.5" />
              <span>+{task.xp || 50} XP</span>
            </span>
            
            {project && (
              <span className="text-white/50 flex items-center gap-1.5 hidden md:flex">
                <span>{project.emoji}</span>
                <span>{project.name.toUpperCase()}</span>
              </span>
            )}
            
            <span className="text-white/30 flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{new Date(task.createdAt).toLocaleDateString()}</span>
              <span className="sm:hidden">{new Date(task.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
            </span>
          </div>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {!task.completed && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-white/10">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">ACTIVE</span>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 border border-white/10 transition-all"
          >
            {showDetails ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
          </motion.button>
          
          {/* Delete Button - Only show on hover for active tasks */}
          <AnimatePresence>
            {isHovered && !task.completed && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all backdrop-blur-sm disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-red-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Delete Confirmation Modal - FIXED! */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-red-500/50 shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skull className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">
                    Mission Termination
                  </h3>
                </div>
                
                <p className="text-white/80 mb-6">
                  How are you terminating this mission?
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => confirmDelete('fail')}
                    disabled={isDeleting}
                    className="w-full p-4 bg-orange-950/50 hover:bg-orange-950/70 border border-orange-500/50 rounded-xl transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-orange-400 uppercase tracking-wider">Report Failure</p>
                        <p className="text-xs text-orange-300/60">Mission attempted but failed (-25 XP)</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => confirmDelete('abandon')}
                    disabled={isDeleting}
                    className="w-full p-4 bg-red-950/50 hover:bg-red-950/70 border border-red-500/50 rounded-xl transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-red-400 uppercase tracking-wider">Abandon Mission</p>
                        <p className="text-xs text-red-300/60">Give up without trying (-50 XP)</p>
                      </div>
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 border border-white/20 rounded-xl transition-all text-white/60 font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
                
                {isDeleting && (
                  <div className="mt-4 text-center">
                    <Activity className="w-6 h-6 text-white/40 animate-spin mx-auto" />
                    <p className="text-xs text-white/40 mt-2">Processing termination...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              <div className="bg-gray-800/30 rounded-lg p-3 border border-white/10">
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-white/40 font-bold uppercase">Deployed</p>
                    <p className="text-white/70 font-mono">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/40 font-bold uppercase">Type</p>
                    <p className="text-white/70 font-mono">{task.missionType || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 font-bold uppercase">Progress</p>
                    <p className="text-white/70 font-mono">{task.completed ? '100%' : '0%'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 font-bold uppercase">ID</p>
                    <p className="text-white/70 font-mono">#{task.id.slice(-6)}</p>
                  </div>
                </div>
                {task.completed && task.actualXPAwarded && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 font-bold uppercase">XP Awarded</p>
                    <p className="text-sm text-green-400 font-mono font-bold">
                      {task.actualXPAwarded} XP {task.actualXPAwarded > task.xp && '(BONUS!)'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

MissionStatusIndicator.displayName = 'MissionStatusIndicator'

export default MissionStatusIndicator