// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/DeveloperTools.jsx                                  │
// │ 🛠️ DEVELOPER COMMAND CENTER - CONTROL STATION OS                           │
// │ Debug console with tactical commands for testing and development            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/* 🛠️ DEVELOPER COMMAND CENTER */
const DeveloperTools = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [commandHistory, setCommandHistory] = useState([])
  const [currentCommand, setCurrentCommand] = useState('')
  
  const executeCommand = (cmd) => {
    const store = useGameStore.getState()
    const parts = cmd.split(' ')
    const command = parts[0]
    const args = parts.slice(1)
    
    let result = ''
    
    switch(command) {
      case 'xp': {
        const amount = parseInt(args[0]) || 100
        store.addXP(amount, 'Debug Command')
        result = `Added ${amount} XP`
        break
      }
        
      case 'punish': {
        const punishAmount = parseInt(args[0]) || 50
        const reason = args.slice(1).join(' ') || 'Debug Punishment'
        store.punish(punishAmount, reason)
        result = `Punished ${punishAmount} XP: ${reason}`
        break
      }
        
      case 'level': {
        const newLevel = parseInt(args[0]) || 1
        store.setState({ level: newLevel })
        result = `Set level to ${newLevel}`
        break
      }
        
      case 'demote': {
        const currentLevel = store.level
        if (currentLevel > 1) {
          store.setState({ level: currentLevel - 1 })
          store.punish(50, 'Debug Demotion', { silent: false })
          result = `Demoted to level ${currentLevel - 1}`
        } else {
          result = 'Already at level 1'
        }
        break
      }
        
      case 'tree': {
        const health = args[0] || 'dying'
        store.setState({ treeHealth: health })
        result = `Set tree health to ${health}`
        break
      }
        
      case 'view': {
        const newView = args[0]
        if (newView && ['dashboard', 'tasks', 'focus', 'focustest', 'stats', 'achievements', 'settings'].includes(newView)) {
          store.setView(newView)
          result = `Switched to ${newView} view`
        } else {
          result = `Invalid view. Options: dashboard, tasks, focus, focustest, stats, achievements, settings`
        }
        break
      }
        
      case 'reset': {
        if (confirm('Reset all data?')) {
          localStorage.clear()
          window.location.reload()
        }
        result = 'Resetting...'
        break
      }
        
      case 'help': {
        result = `Commands:
• xp [amount] - Add XP
• punish [amount] [reason] - Trigger punishment
• level [number] - Set level
• demote - Force demotion
• tree [healthy|warning|dying] - Set tree health
• view [name] - Switch view (focustest for backend test)
• reset - Clear all data`
        break
      }
        
      default: {
        result = `Unknown command: ${command}`
      }
    }
    
    setCommandHistory(prev => [...prev, { cmd, result }])
    setCurrentCommand('')
  }
  
  if (!import.meta.env.DEV) return null
  
  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
      >
        <Terminal className="w-5 h-5 text-green-400" />
      </motion.button>
      
      {/* Command Center */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 z-50 w-96 bg-black/95 border border-green-400/50 rounded-lg shadow-2xl font-mono text-sm"
          >
            <div className="p-3 border-b border-green-400/30 flex items-center justify-between">
              <span className="text-green-400 font-bold">DEVELOPER CONSOLE</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-green-400 hover:text-green-300"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 max-h-64 overflow-y-auto">
              {commandHistory.map((item, i) => (
                <div key={i} className="mb-2">
                  <p className="text-green-400">&gt; {item.cmd}</p>
                  <p className="text-gray-400 text-xs whitespace-pre-wrap">{item.result}</p>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-green-400/30">
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentCommand.trim()) {
                    executeCommand(currentCommand.trim())
                  }
                }}
                placeholder="Enter command..."
                className="w-full bg-transparent text-green-400 outline-none placeholder-green-400/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DeveloperTools