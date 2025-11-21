import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserManager } from '../features/auth/UserManager'

describe('UserManager', () => {
  beforeEach(() => {
    // Clear storage before each test
    window.localStorage.clear()
    window.sessionStorage.clear()
    global.localStorage = window.localStorage
    global.sessionStorage = window.sessionStorage
    vi.clearAllMocks()
  })

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      const result = UserManager.register('testuser', {
        password: 'testpass123',
        avatar: 'tactical-1'
      })
      
      expect(result.success).toBe(true)
      expect(result.data.username).toBe('testuser')
      expect(result.data.profile.avatar).toBe('tactical-1')
    })

    it('should validate username requirements', () => {
      // Test invalid usernames
      expect(UserManager.register('a').success).toBe(false) // Too short
      expect(UserManager.register('').success).toBe(false) // Empty
      expect(UserManager.register('admin').success).toBe(false) // Blocked
      expect(UserManager.register('<script>').success).toBe(false) // XSS attempt
    })

    it('should prevent duplicate user registration', () => {
      UserManager.register('testuser')
      const result = UserManager.register('testuser')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('already exists')
    })

    it('should create user data with correct structure', () => {
      const result = UserManager.register('structuretest', {
        avatar: 'command-2',
        specialization: 'cyber'
      })
      
      expect(result.data).toMatchObject({
        username: 'structuretest',
        profile: {
          avatar: 'command-2',
          specialization: 'cyber'
        },
        preferences: {
          theme: 'military',
          soundEnabled: true
        },
        security: {
          securityLevel: 'open'
        }
      })
    })
  })

  describe('User Authentication', () => {
    beforeEach(() => {
      // Create a test user
      UserManager.register('authtest', { password: 'password123' })
      UserManager.logout() // Start logged out
    })

    it('should login with correct credentials', () => {
      const result = UserManager.login('authtest', 'password123')
      
      expect(result.success).toBe(true)
      expect(UserManager.getCurrentUser()).toBe('authtest')
      expect(UserManager.isLoggedIn()).toBe(true)
    })

    it('should reject invalid credentials', () => {
      const result = UserManager.login('authtest', 'wrongpassword')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid password')
    })

    it('should auto-create user for passwordless login', () => {
      const result = UserManager.login('newuser')
      
      expect(result.success).toBe(true)
      expect(UserManager.userExists('newuser')).toBe(true)
    })

    it('should logout correctly', () => {
      UserManager.login('authtest', 'password123')
      expect(UserManager.isLoggedIn()).toBe(true)
      
      UserManager.logout()
      expect(UserManager.isLoggedIn()).toBe(false)
      expect(UserManager.getCurrentUser()).toBeNull()
    })
  })

  describe('Rate Limiting', () => {
    it('should allow login within rate limits', () => {
      // First few attempts should work
      for (let i = 0; i < 3; i++) {
        const result = UserManager.login('ratetest', 'wrongpass')
        expect(result.success).toBe(false)
      }
    })

    it('should block login after max attempts', () => {
      // Exceed rate limit
      for (let i = 0; i < UserManager.MAX_ATTEMPTS + 1; i++) {
        UserManager.login('blockeduser', 'wrongpass')
      }
      
      const result = UserManager.login('blockeduser', 'wrongpass')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Too many attempts')
    })

    it('should reset rate limit on successful login', () => {
      UserManager.register('resettest', { password: 'correct' })
      
      // Make some failed attempts
      UserManager.login('resettest', 'wrong1')
      UserManager.login('resettest', 'wrong2')
      
      // Successful login should reset
      const result = UserManager.login('resettest', 'correct')
      expect(result.success).toBe(true)
    })
  })

  describe('Data Management', () => {
    beforeEach(() => {
      UserManager.register('datatest')
      UserManager.login('datatest')
    })

    it('should store and retrieve user data', () => {
      const testData = { level: 5, xp: 1000 }
      UserManager.setUserData(testData)
      
      const retrieved = UserManager.getUserData()
      expect(retrieved.level).toBe(5)
      expect(retrieved.xp).toBe(1000)
    })

    it('should update user data correctly', () => {
      UserManager.setUserData({ level: 1, xp: 0 })
      UserManager.updateUserData({ level: 2 })
      
      const data = UserManager.getUserData()
      expect(data.level).toBe(2)
      expect(data.xp).toBe(0) // Should preserve existing data
    })

    it('should prevent cross-user data access', () => {
      UserManager.register('user1')
      UserManager.register('user2')
      
      UserManager.login('user1')
      UserManager.setUserData({ secret: 'user1data' })
      
      UserManager.login('user2')
      const user2Data = UserManager.getUserData('user1') // Try to access user1's data
      
      expect(user2Data).toBeNull() // Should be blocked
    })

    it('should sanitize dangerous data', () => {
      const dangerousData = {
        __proto__: { malicious: true },
        normal: 'safe'
      }
      
      UserManager.setUserData(dangerousData)
      const retrieved = UserManager.getUserData()
      
      expect(retrieved.__proto__).toBeUndefined()
      expect(retrieved.normal).toBe('safe')
    })
  })

  describe('User Discovery', () => {
    beforeEach(() => {
      UserManager.register('user1')
      UserManager.register('user2')
      UserManager.register('user3')
    })

    it('should list all users', () => {
      const users = UserManager.listAllUsers()
      
      expect(users.length).toBe(3)
      expect(users.map(u => u.username)).toContain('user1')
      expect(users.map(u => u.username)).toContain('user2')
      expect(users.map(u => u.username)).toContain('user3')
    })

    it('should check user existence', () => {
      expect(UserManager.userExists('user1')).toBe(true)
      expect(UserManager.userExists('nonexistent')).toBe(false)
    })

    it('should track last user', () => {
      UserManager.login('user2')
      expect(UserManager.getLastUser()).toBe('user2')
      
      UserManager.login('user3')
      expect(UserManager.getLastUser()).toBe('user3')
    })
  })

  describe('Security Features', () => {
    it('should validate usernames against XSS', () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        'javascript:alert(1)',
        'onload="alert(1)"',
        '__proto__'
      ]
      
      xssAttempts.forEach(attempt => {
        const result = UserManager.register(attempt)
        expect(result.success).toBe(false)
      })
    })

    it('should enforce data size limits', () => {
      UserManager.register('sizetest')
      UserManager.login('sizetest')
      
      // Create oversized data
      const largeData = { content: 'x'.repeat(2 * 1024 * 1024) } // 2MB
      const result = UserManager.setUserData(largeData)
      
      expect(result).toBe(false)
    })

    it('should handle storage quota exceeded', () => {
      UserManager.register('quotatest')
      UserManager.login('quotatest')
      
      // Mock localStorage quota exceeded
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })
      
      const result = UserManager.setUserData({ test: 'data' })
      expect(result).toBe(false)
      
      // Restore original method
      Storage.prototype.setItem = originalSetItem
    })
  })

  describe('Data Cleanup', () => {
    beforeEach(() => {
      UserManager.register('cleanuptest')
    })

    it('should delete user data completely', () => {
      expect(UserManager.userExists('cleanuptest')).toBe(true)
      
      const result = UserManager.deleteUser('cleanuptest')
      expect(result).toBe(true)
      expect(UserManager.userExists('cleanuptest')).toBe(false)
    })

    it('should prevent deleting current user', () => {
      UserManager.login('cleanuptest')
      const result = UserManager.deleteUser('cleanuptest')
      expect(result).toBe(false)
    })

    it('should clear all data when confirmed', () => {
      UserManager.register('cleartest1')
      UserManager.register('cleartest2')
      
      const result = UserManager.clearAllData(true)
      expect(result).toBe(true)
      expect(UserManager.userExists('cleartest1')).toBe(false)
      expect(UserManager.userExists('cleartest2')).toBe(false)
    })

    it('should require confirmation for clearing all data', () => {
      const result = UserManager.clearAllData() // No confirmation
      expect(result).toBe(false)
    })
  })
})