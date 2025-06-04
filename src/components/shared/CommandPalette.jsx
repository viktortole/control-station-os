// 🎮 COMMAND PALETTE - Quick actions for power users
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Command, Search, Zap, Plus, Target, Brain, Settings, 
  Download, Upload, Moon, Sun, Volume2, VolumeX, RefreshCw,
  Trophy, BarChart3, User, LogOut, Trash2, Check, X,
  Rocket, Timer, Calendar, AlertCircle, Star, ArrowRight
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'
import DataManager from '../../shared/utils/DataManager'

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  
  const {
    setView, addXP, deployTemplateSet, deployMission001,
    settings, updateSettings, resetProgress,
    tasks, completeTask
  } = useGameStore()

  // Command definitions
  const commands = useMemo(() => {
    const baseCommands = [
      // Navigation
      { 
        id: 'nav-dashboard', 
        label: 'Go to Dashboard', 
        icon: BarChart3, 
        shortcut: 'G D',
        action: () => { setView('dashboard'); onClose() },
        category: 'Navigation'
      },
      { 
        id: 'nav-missions', 
        label: 'Go to Mission Control', 
        icon: Target, 
        shortcut: 'G M',
        action: () => { setView('tasks'); onClose() },
        category: 'Navigation'
      },
      { 
        id: 'nav-focus', 
        label: 'Go to Focus Guardian', 
        icon: Brain, 
        shortcut: 'G F',
        action: () => { setView('focus'); onClose() },
        category: 'Navigation'
      },
      { 
        id: 'nav-intel', 
        label: 'Go to Intelligence Hub', 
        icon: BarChart3, 
        shortcut: 'G I',
        action: () => { setView('intelligence'); onClose() },
        category: 'Navigation'
      },
      
      // Quick Actions
      { 
        id: 'quick-add-task', 
        label: 'Create New Mission', 
        icon: Plus, 
        shortcut: 'C',
        action: () => { setView('tasks'); onClose(); setTimeout(() => document.querySelector('[data-create-task]')?.click(), 100) },
        category: 'Quick Actions'
      },
      { 
        id: 'quick-strike', 
        label: 'Quick Strike (+100 XP)', 
        icon: Zap, 
        shortcut: 'Q S',
        action: () => { addXP(100, 'Quick Strike via Command Palette'); onClose() },
        category: 'Quick Actions'
      },
      { 
        id: 'deploy-daily', 
        label: 'Deploy Daily Routine', 
        icon: Calendar, 
        shortcut: 'D R',
        action: () => { deployTemplateSet('daily-routine'); setView('tasks'); onClose() },
        category: 'Quick Actions'
      },
      { 
        id: 'deploy-mission-001', 
        label: 'Deploy Mission 001: Make It Useful', 
        icon: Rocket, 
        shortcut: 'M 1',
        action: () => { deployMission001(); setView('tasks'); onClose() },
        category: 'Quick Actions'
      },
      
      // Settings
      { 
        id: 'toggle-sound', 
        label: settings.soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects', 
        icon: settings.soundEnabled ? VolumeX : Volume2, 
        shortcut: 'S',
        action: () => { updateSettings({ soundEnabled: !settings.soundEnabled }); onClose() },
        category: 'Settings'
      },
      { 
        id: 'toggle-theme', 
        label: 'Change Theme', 
        icon: settings.theme === 'military' ? Moon : Sun, 
        shortcut: 'T',
        action: () => { /* Theme toggle logic */ onClose() },
        category: 'Settings'
      },
      
      // Data Management
      { 
        id: 'export-data', 
        label: 'Export All Data', 
        icon: Download, 
        shortcut: 'E D',
        action: () => { DataManager.exportData(); onClose() },
        category: 'Data'
      },
      { 
        id: 'import-data', 
        label: 'Import Data', 
        icon: Upload, 
        shortcut: 'I D',
        action: () => { importData(); onClose() },
        category: 'Data'
      },
      { 
        id: 'export-feedback', 
        label: 'Export Feedback Data', 
        icon: Download, 
        shortcut: 'E F',
        action: () => { exportFeedback(); onClose() },
        category: 'Data'
      },
      
      // Danger Zone
      { 
        id: 'reset-progress', 
        label: 'Reset All Progress', 
        icon: Trash2, 
        shortcut: null,
        action: () => { if(confirm('Delete all progress?')) { resetProgress(); onClose() } },
        category: 'Danger',
        danger: true
      }
    ]

    // Add task-specific commands
    const activeTasks = tasks.filter(t => !t.completed && !t.failed)
    const taskCommands = activeTasks.slice(0, 5).map(task => ({
      id: `task-${task.id}`,
      label: `Complete: ${task.title}`,
      icon: Check,
      shortcut: null,
      action: () => { completeTask(task.id); onClose() },
      category: 'Active Missions',
      meta: `+${task.xp} XP`
    }))

    return [...baseCommands, ...taskCommands]
  }, [tasks, settings, setView, addXP, deployTemplateSet, deployMission001, updateSettings, completeTask, resetProgress, onClose])

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return commands
    
    const searchLower = search.toLowerCase()
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower) ||
      (cmd.shortcut && cmd.shortcut.toLowerCase().includes(searchLower))
    )
  }, [commands, search])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups = {}
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      const flatCommands = filteredCommands
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => (i + 1) % flatCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => (i - 1 + flatCommands.length) % flatCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Import data function
  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        const result = await DataManager.importData(file)
        if (result.success) {
          alert(result.message)
          // Reload the page to apply imported data
          setTimeout(() => window.location.reload(), 1000)
        } else {
          alert(`Import failed: ${result.message}`)
        }
      }
    }
    
    input.click()
  }

  // Export feedback data function
  const exportFeedback = () => {
    const feedbackData = JSON.parse(localStorage.getItem('user-feedback') || '[]')
    
    if (feedbackData.length === 0) {
      alert('No feedback data to export')
      return
    }
    
    const exportData = {
      exported: new Date().toISOString(),
      version: '1.0.0',
      feedbackCount: feedbackData.length,
      feedback: feedbackData
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `control-station-feedback-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    // Exported feedback entries
  }

  if (!isOpen) return null

  let commandIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-cyan-500/20">
                <Command className="w-5 h-5 text-cyan-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                />
                <kbd className="px-2 py-1 text-xs font-mono bg-gray-800 rounded border border-gray-700 text-gray-400">
                  ESC
                </kbd>
              </div>
              
              {/* Commands List */}
              <div ref={listRef} className="max-h-[400px] overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-bold text-cyan-400/60 uppercase tracking-wider">
                      {category}
                    </div>
                    {categoryCommands.map((cmd) => {
                      const isSelected = commandIndex === selectedIndex
                      commandIndex++
                      
                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(commandIndex - 1)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                            isSelected ? 'bg-cyan-500/20 border-l-2 border-cyan-400' : 'hover:bg-white/5'
                          } ${cmd.danger ? 'text-red-400' : 'text-white'}`}
                        >
                          <cmd.icon className={`w-4 h-4 ${cmd.danger ? 'text-red-400' : 'text-cyan-400'}`} />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {cmd.meta && (
                            <span className="text-xs text-green-400 font-mono">{cmd.meta}</span>
                          )}
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-800 rounded border border-gray-700 text-gray-400">
                              {cmd.shortcut}
                            </kbd>
                          )}
                          {isSelected && <ArrowRight className="w-4 h-4 text-cyan-400" />}
                        </motion.button>
                      )
                    })}
                  </div>
                ))}
                
                {filteredCommands.length === 0 && (
                  <div className="p-8 text-center text-white/40">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No commands found</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-4">
                  <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
                  <span><kbd className="font-mono">Enter</kbd> Select</span>
                  <span><kbd className="font-mono">Esc</kbd> Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <Command className="w-3 h-3" />
                  <span>Command Palette</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette