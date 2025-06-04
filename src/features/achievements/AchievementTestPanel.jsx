// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🏆 ACHIEVEMENT TEST PANEL - CONTROL STATION OS                               │
// │ Developer tool for testing achievement unlocking and notifications          │
// │ Only visible in development mode                                            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, Shield, Flame, TestTube } from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/**
 * Achievement Test Panel
 * Provides manual achievement testing for development
 */
export default function AchievementTestPanel() {
  const { achievements, stats, level, streak, totalDemotions, checkAchievements, addXP } = useGameStore()

  // Only show in development
  if (!import.meta.env.DEV) return null

  const manuallyTriggerAchievement = (achievementId) => {
    // Force trigger achievement by temporarily modifying state
    switch (achievementId) {
      case 'first-blood':
        if (stats.totalTasksCompleted === 0) {
          // Complete a task to trigger first blood
          const store = useGameStore.getState()
          store.setState(state => ({
            stats: {
              ...state.stats,
              totalTasksCompleted: 1
            }
          }))
          checkAchievements()
        }
        break
      
      case 'survivor':
        // Set conditions for survivor achievement
        const store = useGameStore.getState()
        store.setState(state => ({
          streak: 3,
          totalDemotions: 0
        }))
        checkAchievements()
        break
      
      case 'phoenix':
        // Set conditions for phoenix achievement
        const storePhoenix = useGameStore.getState()
        storePhoenix.setState(state => ({
          totalDemotions: 1,
          level: 2
        }))
        checkAchievements()
        break
    }
  }

  const achievementData = [
    {
      id: 'first-blood',
      name: 'First Blood',
      icon: '🎯',
      condition: `Complete 1 task (current: ${stats.totalTasksCompleted})`,
      unlocked: achievements.includes('first-blood')
    },
    {
      id: 'survivor',
      name: 'Survivor',
      icon: '💪',
      condition: `3+ day streak with no demotions (streak: ${streak}, demotions: ${totalDemotions})`,
      unlocked: achievements.includes('survivor')
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      icon: '🔥',
      condition: `Recover from demotion (level: ${level}, demotions: ${totalDemotions})`,
      unlocked: achievements.includes('phoenix')
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40 bg-gray-900/95 backdrop-blur-sm border border-yellow-500/50 rounded-xl p-4 max-w-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <TestTube className="w-5 h-5 text-yellow-400" />
        <h3 className="text-yellow-400 font-bold text-sm uppercase">Achievement Testing</h3>
      </div>
      
      <div className="space-y-2">
        {achievementData.map(achievement => (
          <div key={achievement.id} className="p-2 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <span className="text-white text-sm font-medium">{achievement.name}</span>
                {achievement.unlocked && (
                  <span className="text-green-400 text-xs">✓ UNLOCKED</span>
                )}
              </div>
              <button
                onClick={() => manuallyTriggerAchievement(achievement.id)}
                disabled={achievement.unlocked}
                className={`px-2 py-1 text-xs rounded ${
                  achievement.unlocked 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                Test
              </button>
            </div>
            <p className="text-gray-400 text-xs">{achievement.condition}</p>
          </div>
        ))}
      </div>
      
      <button
        onClick={checkAchievements}
        className="w-full mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
      >
        Check All Achievements
      </button>
      
      <div className="mt-2 text-center">
        <span className="text-gray-400 text-xs">
          {achievements.length}/3 achievements unlocked
        </span>
      </div>
    </motion.div>
  )
}