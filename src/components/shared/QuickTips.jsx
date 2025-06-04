// 💡 QUICK TIPS - Helpful tips for users
import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Lightbulb, X, ChevronLeft, ChevronRight } from 'lucide-react'

const tips = [
  {
    title: "Command Palette",
    content: "Press Cmd/Ctrl + K to open the command palette for quick actions",
    category: "keyboard"
  },
  {
    title: "Quick Strike",
    content: "Use Quick Strike missions for instant XP when you complete small tasks",
    category: "xp"
  },
  {
    title: "Daily Routine",
    content: "Deploy your daily routine templates to stay consistent and build streaks",
    category: "productivity"
  },
  {
    title: "Keyboard Shortcuts",
    content: "Press ? at any time to see all available keyboard shortcuts",
    category: "keyboard"
  },
  {
    title: "Focus Guardian",
    content: "Use Focus Guardian for Pomodoro sessions - earn XP for staying focused!",
    category: "productivity"
  },
  {
    title: "Export Your Data",
    content: "Press Cmd/Ctrl + K then type 'export' to backup your progress",
    category: "data"
  },
  {
    title: "Punishment System",
    content: "Failed missions cost XP - stay disciplined to avoid demotions!",
    category: "xp"
  },
  {
    title: "Mission Templates",
    content: "Create reusable mission templates for tasks you do regularly",
    category: "productivity"
  },
  {
    title: "Sound Toggle",
    content: "Click the speaker icon in the header to toggle sound effects",
    category: "ui"
  },
  {
    title: "Tree Health",
    content: "Your tree health reflects your productivity - keep it green!",
    category: "xp"
  }
]

const QuickTips = ({ autoShow = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(autoShow)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  
  useEffect(() => {
    // Check if user has seen tips before
    const seen = localStorage.getItem('hasSeenQuickTips')
    if (!seen && autoShow) {
      setIsOpen(true)
      localStorage.setItem('hasSeenQuickTips', 'true')
    }
  }, [autoShow])
  
  const currentTip = tips[currentTipIndex]
  
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length)
  }
  
  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
  }
  
  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }
  
  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-full shadow-lg transition-colors"
        title="Quick Tips"
      >
        <Lightbulb className="w-5 h-5 text-yellow-400" />
      </motion.button>
    )
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-4 right-4 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-yellow-500/30 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/5">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-white">Quick Tips</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2">
                  <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider">
                    Tip {currentTipIndex + 1} of {tips.length}
                  </span>
                </div>
                <h4 className="text-white font-bold mb-2">{currentTip.title}</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentTip.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-yellow-500/20">
            <button
              onClick={prevTip}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Previous tip"
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentTipIndex 
                      ? 'bg-yellow-400' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTip}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Next tip"
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuickTips