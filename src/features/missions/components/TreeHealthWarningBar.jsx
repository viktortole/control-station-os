// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🚨 TREE HEALTH WARNING BAR COMPONENT                                       │
// │ Critical warning system for productivity tree health                        │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { motion } from 'framer-motion'
import { Skull } from 'lucide-react'
import useGameStore from '../../../shared/stores/useGameStore'

const TreeHealthWarningBar = () => {
  const { treeHealth } = useGameStore()
  
  if (treeHealth !== 'dying') return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Skull className="w-6 h-6 text-red-400" />
        </motion.div>
        <div className="flex-1">
          <p className="font-black text-red-400 uppercase tracking-wider">
            PRODUCTIVITY TREE DYING - CRITICAL STATE
          </p>
          <p className="text-sm text-red-300/80 mt-1">
            Complete missions immediately or face -100 XP tree death penalty
          </p>
        </div>
        <div className="text-2xl animate-pulse">🥀</div>
      </div>
    </motion.div>
  )
}

export default TreeHealthWarningBar