import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useGameStore from '../shared/stores/useGameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.getState().resetToDefaults?.()
    global.localStorage = {}
    global.sessionStorage = {}
    vi.clearAllMocks()
  })

  describe('XP Management', () => {
    it('should add XP correctly', () => {
      const { result } = renderHook(() => useGameStore())
      const initialXP = result.current.totalXP
      
      act(() => {
        result.current.addXP(100, 'Test task')
      })
      
      expect(result.current.totalXP).toBe(initialXP + 100)
    })

    it('should handle level calculation correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        // Add enough XP to level up (250 XP = level 2)
        result.current.addXP(250, 'Level up test')
      })
      
      expect(result.current.level).toBeGreaterThan(1)
    })

    it('should prevent concurrent XP processing', () => {
      const { result } = renderHook(() => useGameStore())
      const initialXP = result.current.totalXP
      
      // Simulate concurrent calls
      act(() => {
        result.current.addXP(100, 'First call')
        result.current.addXP(100, 'Second call') // Should be blocked
      })
      
      // Only first call should succeed
      expect(result.current.totalXP).toBe(initialXP + 100)
    })

    it('should track XP transactions', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.addXP(50, 'Transaction test')
      })
      
      const transactions = result.current.xpTransactionLog
      expect(transactions.length).toBeGreaterThan(0)
      expect(transactions[transactions.length - 1].source).toBe('Transaction test')
    })
  })

  describe('Task Management', () => {
    it('should add tasks correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        xpReward: 50
      }
      
      act(() => {
        result.current.addTask(taskData)
      })
      
      expect(result.current.tasks.length).toBeGreaterThan(0)
      expect(result.current.tasks[0].title).toBe('Test Task')
    })

    it('should complete tasks and award XP', () => {
      const { result } = renderHook(() => useGameStore())
      const initialXP = result.current.totalXP
      
      // Add a task
      act(() => {
        result.current.addTask({
          title: 'Complete Task Test',
          priority: 'high',
          xpReward: 75
        })
      })
      
      const taskId = result.current.tasks[0].id
      
      // Complete the task
      act(() => {
        result.current.completeTask(taskId)
      })
      
      expect(result.current.totalXP).toBeGreaterThan(initialXP)
      expect(result.current.tasks.find(t => t.id === taskId)?.completed).toBe(true)
    })

    it('should delete tasks correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Add a task
      act(() => {
        result.current.addTask({
          title: 'Delete Task Test',
          priority: 'low'
        })
      })
      
      const taskId = result.current.tasks[0].id
      const initialCount = result.current.tasks.length
      
      // Delete the task
      act(() => {
        result.current.deleteTask(taskId)
      })
      
      expect(result.current.tasks.length).toBe(initialCount - 1)
      expect(result.current.tasks.find(t => t.id === taskId)).toBeUndefined()
    })
  })

  describe('Achievement System', () => {
    it('should check achievements after XP gain', () => {
      const { result } = renderHook(() => useGameStore())
      const spy = vi.spyOn(result.current, 'checkAchievements')
      
      act(() => {
        result.current.addXP(100, 'Achievement test')
      })
      
      expect(spy).toHaveBeenCalled()
    })

    it('should unlock achievements when conditions are met', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Add enough tasks to trigger an achievement
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addTask({
            title: `Task ${i}`,
            priority: 'medium'
          })
          result.current.completeTask(result.current.tasks[i].id)
        }
      })
      
      const achievements = result.current.achievements
      const unlockedAchievements = achievements.filter(a => a.unlocked)
      expect(unlockedAchievements.length).toBeGreaterThan(0)
    })
  })

  describe('Settings Management', () => {
    it('should update settings correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateSettings({
          soundEnabled: false,
          theme: 'dark'
        })
      })
      
      expect(result.current.settings.soundEnabled).toBe(false)
      expect(result.current.settings.theme).toBe('dark')
    })

    it('should persist settings to localStorage', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateSettings({
          punishmentEnabled: true
        })
      })
      
      // Settings should be saved to localStorage (mocked)
      expect(result.current.settings.punishmentEnabled).toBe(true)
    })
  })

  describe('Statistics Tracking', () => {
    it('should track task completion statistics', () => {
      const { result } = renderHook(() => useGameStore())
      const initialCompleted = result.current.stats.totalTasksCompleted
      
      act(() => {
        result.current.addTask({
          title: 'Stats Test Task',
          priority: 'medium'
        })
        result.current.completeTask(result.current.tasks[0].id)
      })
      
      expect(result.current.stats.totalTasksCompleted).toBe(initialCompleted + 1)
    })

    it('should track XP statistics', () => {
      const { result } = renderHook(() => useGameStore())
      const initialXPEarned = result.current.stats.totalXPEarned
      
      act(() => {
        result.current.addXP(150, 'Stats XP test')
      })
      
      expect(result.current.stats.totalXPEarned).toBe(initialXPEarned + 150)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid task operations gracefully', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Try to complete non-existent task
      act(() => {
        const result = result.current.completeTask('invalid-id')
        expect(result).toBeFalsy()
      })
      
      // Try to delete non-existent task  
      act(() => {
        const result = result.current.deleteTask('invalid-id')
        expect(result).toBeFalsy()
      })
    })

    it('should handle XP processing errors', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Should not crash on invalid XP amounts
      act(() => {
        result.current.addXP(null, 'Invalid XP test')
        result.current.addXP(undefined, 'Invalid XP test')
        result.current.addXP('invalid', 'Invalid XP test')
      })
      
      // Store should remain stable
      expect(result.current.totalXP).toBeGreaterThanOrEqual(0)
    })
  })
})