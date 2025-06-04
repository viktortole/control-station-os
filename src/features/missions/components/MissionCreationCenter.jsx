// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 MISSION CREATION CENTER - TACTICAL MISSION DEPLOYMENT                   │
// │ Advanced mission creation interface with military-grade UI                  │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Command, Crosshair, AlertTriangle, Layers, Database, Clock, 
  Cpu, ChevronDown, Activity, Rocket, Navigation, Target, Star
} from 'lucide-react'
import useGameStore from '../../../shared/stores/useGameStore'
import TacticalRadar from './TacticalRadar'

const MissionCreationCenter = ({ isOpen, onClose }) => {
  const { addTask, projects, selectedProject } = useGameStore()
  
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [project, setProject] = useState(selectedProject || 'inbox')
  const [xpOverride, setXpOverride] = useState('')
  const [missionType, setMissionType] = useState('standard')
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [isDeploying, setIsDeploying] = useState(false)
  
  const titleInputRef = useRef(null)
  const formRef = useRef(null)
  
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isOpen])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || isDeploying) return
    
    setIsDeploying(true)
    
    const customXP = xpOverride ? parseInt(xpOverride) : null
    
    const taskData = {
      title: title.trim(),  
      priority,
      projectId: project,
      missionType,
      estimatedTime,
      deployedAt: new Date().toISOString(),
    }
    
    if (customXP) {
      taskData.xp = customXP
    }
    
    addTask(taskData)
    
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none'
    notification.innerHTML = `
      <div class="bg-green-500/20 backdrop-blur-xl border-2 border-green-500/50 rounded-2xl p-6 shadow-2xl">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-black text-green-400 uppercase tracking-wider">Mission Deployed</p>
            <p class="text-green-300/80 font-mono">Tactical objective registered</p>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(notification)
    
    setTimeout(() => {
      setTitle('')
      setPriority('medium')
      setXpOverride('')
      setMissionType('standard')
      setEstimatedTime(30)
      setIsDeploying(false)
      onClose()
      if (document.body.contains(notification)) {
        notification.classList.add('fade-out')
        setTimeout(() => document.body.removeChild(notification), 300)
      }
    }, 1500)
  }
  
  if (!isOpen) return null
  
  const priorityOptions = [
    { value: 'high', label: 'CRITICAL', xp: 100, color: 'from-red-500 to-red-600', border: 'border-red-500/50', icon: '🔴' },
    { value: 'medium', label: 'STANDARD', xp: 50, color: 'from-yellow-500 to-yellow-600', border: 'border-yellow-500/50', icon: '🟡' },
    { value: 'low', label: 'ROUTINE', xp: 25, color: 'from-green-500 to-green-600', border: 'border-green-500/50', icon: '🟢' }
  ]
  
  const typeOptions = [
    { value: 'standard', label: 'STANDARD', icon: Target },
    { value: 'critical', label: 'CRITICAL', icon: Crosshair },
    { value: 'special', label: 'SPECIAL', icon: Star }
  ]
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-8 pointer-events-none"
      >
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div ref={formRef} className="bg-gray-900/98 backdrop-blur-2xl rounded-3xl border border-red-500/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-950/40 to-orange-950/40 border-b border-red-500/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div className="w-3 h-3 bg-green-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.div className="w-3 h-3 bg-yellow-500 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.div className="w-3 h-3 bg-red-500 rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">MISSION DEPLOYMENT</h2>
                    <p className="text-xs text-red-300/60 font-mono">SYSTEM READY • NO MERCY MODE</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isDeploying}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-black text-red-400/80 uppercase tracking-wider">
                      <Command className="w-4 h-4" />
                      MISSION DESIGNATION
                    </label>
                    <div className="relative">
                      <input
                        ref={titleInputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter tactical objective..."
                        className="w-full px-4 py-4 bg-gray-800/50 border-2 border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-red-400/50 focus:bg-gray-800/70 transition-all font-mono text-lg"
                        required
                        disabled={isDeploying}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                        <Crosshair className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority & Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-black text-red-400/80 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        THREAT LEVEL
                      </label>
                      <div className="space-y-2">
                        {priorityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setPriority(option.value)}
                            disabled={isDeploying}
                            className={`w-full relative p-3 rounded-xl border-2 transition-all ${
                              priority === option.value
                                ? `${option.border} bg-white/10`
                                : 'border-white/10 hover:border-white/20 bg-gray-800/30'
                            } ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {priority === option.value && (
                              <motion.div
                                layoutId="prioritySelector"
                                className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-20 rounded-xl`}
                              />
                            )}
                            <div className="relative flex items-center gap-3">
                              <span className="text-xl">{option.icon}</span>
                              <div className="text-left">
                                <p className="font-black text-white/90 text-sm">{option.label}</p>
                                <p className="text-xs text-white/50">+{option.xp} XP</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-black text-red-400/80 uppercase tracking-wider">
                        <Layers className="w-4 h-4" />
                        OPERATION TYPE
                      </label>
                      <div className="space-y-2">
                        {typeOptions.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setMissionType(type.value)}
                            disabled={isDeploying}
                            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                              missionType === type.value
                                ? 'border-blue-500/50 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 bg-gray-800/30'
                            } ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <type.icon className="w-4 h-4 text-white/60" />
                            <span className="font-bold text-sm text-white/80">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Project & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-black text-red-400/80 uppercase tracking-wider">
                        <Database className="w-4 h-4" />
                        TARGET SECTOR
                      </label>
                      <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        disabled={isDeploying}
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-colors font-mono disabled:opacity-50"
                      >
                        {projects.map((proj) => (
                          <option key={proj.id} value={proj.id} className="bg-gray-800">
                            {proj.emoji} {proj.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-black text-red-400/80 uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        ETA (MIN)
                      </label>
                      <input
                        type="number"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
                        min="5"
                        max="480"
                        step="5"
                        disabled={isDeploying}
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400/50 transition-colors font-mono disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Radar */}
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-center mb-4">
                      <TacticalRadar active={!isDeploying} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xs text-white/40 font-mono uppercase">System Status</p>
                      <p className="text-sm font-bold text-green-400">
                        {isDeploying ? 'DEPLOYING...' : 'DEPLOYMENT READY'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Intel */}
                  <div className="bg-gray-800/30 rounded-2xl p-6 border border-white/10 space-y-4">
                    <h4 className="text-sm font-black text-white/60 uppercase tracking-wider">Mission Intel</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/40">XP Reward</span>
                        <span className="font-mono font-bold text-yellow-400">
                          {xpOverride || (priority === 'high' ? 100 : priority === 'medium' ? 50 : 25)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40">Duration</span>
                        <span className="font-mono text-white/70">{estimatedTime}m</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40">Deploy Time</span>
                        <span className="font-mono text-white/70">{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced */}
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-white/60 hover:text-white/80 transition-colors flex items-center gap-2 font-bold uppercase tracking-wider">
                      <Cpu className="w-4 h-4" />
                      <span>Advanced</span>
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform ml-auto" />
                    </summary>
                    <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-white/10">
                      <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">
                        XP Override
                      </label>
                      <input
                        type="number"
                        value={xpOverride}
                        onChange={(e) => setXpOverride(e.target.value)}
                        placeholder="Auto"
                        disabled={isDeploying}
                        className="w-full px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition-colors font-mono text-sm disabled:opacity-50"
                      />
                    </div>
                  </details>
                </div>
              </div>
              
              {/* Deploy Button */}
              <motion.button
                type="submit"
                whileHover={isDeploying ? {} : { scale: 1.02 }}
                whileTap={isDeploying ? {} : { scale: 0.98 }}
                disabled={!title.trim() || isDeploying}
                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white font-black shadow-lg hover:shadow-xl transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-lg"
              >
                <div className="relative flex items-center justify-center gap-3">
                  {isDeploying ? (
                    <>
                      <Activity className="w-6 h-6 animate-spin" />
                      <span>DEPLOYING MISSION...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6" />
                      <span>DEPLOY MISSION</span>
                      <Navigation className="w-6 h-6" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default MissionCreationCenter