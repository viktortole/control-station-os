// 🎮 KEYBOARD SHORTCUTS OVERLAY - Show all available shortcuts
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['G', 'D'], action: 'Go to Dashboard' },
      { keys: ['G', 'M'], action: 'Go to Mission Control' },
      { keys: ['G', 'F'], action: 'Go to Focus Guardian' },
      { keys: ['G', 'I'], action: 'Go to Intelligence Hub' },
      { keys: ['G', 'S'], action: 'Go to Settings' },
    ]},
    { category: 'Quick Actions', items: [
      { keys: ['⌘/Ctrl', 'K'], action: 'Open Command Palette' },
      { keys: ['⌘/Ctrl', 'N'], action: 'Create New Mission' },
      { keys: ['Q', 'S'], action: 'Quick Strike (+100 XP)' },
      { keys: ['D', 'R'], action: 'Deploy Daily Routine' },
      { keys: ['?'], action: 'Show Keyboard Shortcuts' },
    ]},
    { category: 'Mission Control', items: [
      { keys: ['1'], action: 'View All Tasks' },
      { keys: ['2'], action: 'View Active Tasks' },
      { keys: ['3'], action: 'View Completed Tasks' },
      { keys: ['Esc'], action: 'Close Modal/Dialog' },
    ]},
    { category: 'Settings', items: [
      { keys: ['S'], action: 'Toggle Sound Effects' },
      { keys: ['T'], action: 'Change Theme' },
      { keys: ['E', 'D'], action: 'Export Data' },
    ]},
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Shortcuts Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] z-50"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5">
                <div className="flex items-center gap-3">
                  <Keyboard className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              {/* Shortcuts Grid */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shortcuts.map((section) => (
                    <div key={section.category}>
                      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
                        {section.category}
                      </h3>
                      <div className="space-y-2">
                        {section.items.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
                          >
                            <span className="text-white/80 text-sm">{shortcut.action}</span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.map((key, keyIndex) => (
                                <React.Fragment key={keyIndex}>
                                  <kbd className="px-2 py-1 text-xs font-mono bg-gray-700 rounded border border-gray-600 text-gray-300">
                                    {key}
                                  </kbd>
                                  {keyIndex < shortcut.keys.length - 1 && (
                                    <span className="text-gray-500 text-xs mx-1">+</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-cyan-500/20 bg-gray-800/30">
                <p className="text-center text-xs text-white/40">
                  Press <kbd className="px-2 py-1 font-mono bg-gray-700 rounded border border-gray-600 text-gray-300">?</kbd> at any time to view shortcuts
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default KeyboardShortcuts