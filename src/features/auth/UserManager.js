// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/core/auth/UserManager.js                                        │
// │ 🎯 PURPOSE: Multi-user session management and data isolation                │
// │ 📦 DEPENDENCIES: None - pure utility class                                  │
// │ 🔗 CONNECTIONS:                                                              │
// │   - Used by: useAuthStore.js, useGameStore.js, AuthScreen.jsx              │
// │   - Uses: Browser localStorage and sessionStorage APIs                      │
// │ 💾 STATE/PROPS: Static utility class - no state                            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🏁 PART 1: USER MANAGEMENT CLASS */
export class UserManager {
  // Rate limiting storage
  static #rateLimitStore = new Map()
  static MAX_ATTEMPTS = 5
  static LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes
  // Storage key prefixes
  static USER_DATA_PREFIX = 'control_station_user_'
  static SETTINGS_PREFIX = 'control_station_settings_'
  static SESSION_KEY = 'control_station_current_user'
  static LAST_USER_KEY = 'control_station_last_user'

  /* 🎯 PART 2: SESSION MANAGEMENT */
  
  /**
   * Get the currently logged in commander
   * @returns {string|null} Username or null if not logged in
   */
  static getCurrentUser() {
    return sessionStorage.getItem(this.SESSION_KEY)
  }

  /**
   * Check if a user is currently logged in
   * @returns {boolean}
   */
  static isLoggedIn() {
    return !!this.getCurrentUser()
  }

  /**
   * Login a commander (sets session)
   * @param {string} username - Commander's username
   * @param {string} password - Commander's password (optional)
   * @returns {object} Login result with success status
   */
  static login(username, password = null) {
    // Rate limiting check
    const identifier = username?.toLowerCase() || 'unknown'
    const rateLimitCheck = this.checkRateLimit(identifier)
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.error }
    }
    
    if (!username || typeof username !== 'string') {
      this.recordFailedAttempt(identifier)
      throw new Error('Invalid username provided')
    }
    
    // Normalize username (trim, lowercase for storage key)
    const normalizedUsername = username.trim().toLowerCase()
    
    // Check if user exists
    if (!this.userExists(normalizedUsername)) {
      // Auto-create user if no password required
      if (!password) {
        this.initializeUserData(normalizedUsername)
      } else {
        return { success: false, error: 'User not found' }
      }
    }
    
    // If password provided, validate it
    if (password) {
      const userData = this._getInternalUserData(normalizedUsername)
      if (userData?.security?.passwordHash) {
        // Simple password validation (in production, use proper hashing)
        const providedHash = btoa(password)
        if (providedHash !== userData.security.passwordHash) {
          this.recordFailedAttempt(identifier)
          return { success: false, error: 'Invalid password' }
        }
      }
    }
    
    // Set current session
    sessionStorage.setItem(this.SESSION_KEY, normalizedUsername)
    
    // Remember last user for quick login
    localStorage.setItem(this.LAST_USER_KEY, normalizedUsername)
    
    // Reset rate limit on successful login
    this.resetRateLimit(identifier)
    
    // Update last login time
    const userData = this._getInternalUserData(normalizedUsername) || {}
    userData.lastLogin = new Date().toISOString()
    this.setUserData(userData, normalizedUsername)
    
    return { success: true, username: normalizedUsername }
  }

  /**
   * Logout current commander
   */
  static logout() {
    sessionStorage.removeItem(this.SESSION_KEY)
    // Don't clear localStorage - keep user data for next login
  }

  /**
   * Switch to a different commander
   * @param {string} username - New commander's username
   */
  static switchUser(username) {
    this.logout()
    this.login(username)
    // Reload to ensure clean state
    window.location.reload()
  }

  /**
   * Register a new commander (alias for registerUser for compatibility)
   * @param {string} username - Commander's username
   * @param {object} profileData - Additional profile data (avatar, password, etc.)
   * @returns {object} { success: boolean, error?: string, data?: object }
   */
  static register(username, profileData = {}) {
    return this.registerUser(username, profileData)
  }

  /**
   * Register a new commander with profile data
   * @param {string} username - Commander's username
   * @param {object} profileData - Additional profile data (avatar, password, etc.)
   * @returns {object} { success: boolean, error?: string, data?: object }
   */
  static registerUser(username, profileData = {}) {
    // Validate username
    const validation = this.validateUsername(username)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const normalizedUsername = username.trim().toLowerCase()

    // Check if user already exists
    if (this.userExists(normalizedUsername)) {
      return { success: false, error: 'Commander already exists in the system' }
    }

    // Create user data with profile
    const userData = {
      username: normalizedUsername,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isFirstTime: true,
      profile: {
        displayName: username.trim(),
        nickname: username.trim(),
        avatar: profileData.avatar || 'tactical-1',
        rank: profileData.rank || 'RECRUIT',
        clearanceLevel: profileData.clearanceLevel || 'PUBLIC',
        specialization: profileData.specialization || 'infantry',
        createdAt: new Date().toISOString(),
        ...profileData
      },
      preferences: {
        theme: 'military',
        soundEnabled: true,
        punishmentEnabled: false,
        idleTrackingEnabled: false,
        dailyXPGoal: 250, // Default daily goal
        ...profileData.preferences
      },
      security: {
        passwordHash: profileData.password ? btoa(profileData.password) : null,
        securityLevel: profileData.password ? 'protected' : 'open',
        passwordUpdated: profileData.password ? new Date().toISOString() : null,
        registrationMethod: 'compact_auth_screen',
        mfaEnabled: false,
        securityQuestions: null
      },
      gameData: {
        // Initialize basic game data structure
        level: 1,
        totalXP: 0,
        streak: 0,
        tasks: [],
        achievements: [],
        stats: {
          totalTasksCompleted: 0,
          totalTasksFailed: 0,
          totalTasksAbandoned: 0,
          totalDaysActive: 0,
          totalXPLost: 0
        }
      }
    }

    // Save user data
    const success = this.setUserData(userData, normalizedUsername)
    
    if (success) {
      // Auto-login the new user (no password check needed for new registration)
      const loginResult = this.login(normalizedUsername)
      if (!loginResult.success) {
        return { success: false, error: 'Failed to auto-login after registration' }
      }
      return { 
        success: true, 
        data: userData,
        message: 'Commander profile created successfully'
      }
    } else {
      return { 
        success: false, 
        error: 'Failed to save commander profile data'
      }
    }
  }

  /* 📊 PART 3: DATA MANAGEMENT */

  /**
   * Get user-specific data with security validation
   * @param {string} username - Commander's username (optional, uses current if not provided)
   * @returns {object|null} User data or null if not found
   */
  static getUserData(username = null) {
    const user = username || this.getCurrentUser()
    if (!user) return null
    
    // SECURITY: Prevent cross-user data access
    const currentUser = this.getCurrentUser()
    if (username && username !== currentUser) {
      console.warn('🚨 Security: Attempt to access other user data blocked')
      return null
    }
    
    const key = this.USER_DATA_PREFIX + user.toLowerCase()
    const data = localStorage.getItem(key)
    
    try {
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  }

  /**
   * INTERNAL: Get user data without security checks (for administrative functions)
   * @param {string} username - Commander's username
   * @returns {object|null} User data or null if not found
   */
  static _getInternalUserData(username) {
    if (!username) return null
    
    const key = this.USER_DATA_PREFIX + username.toLowerCase()
    const data = localStorage.getItem(key)
    
    try {
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  }

  /**
   * Save user-specific data with security validation
   * @param {object} data - Data to save (will be sanitized)
   * @param {string} username - Commander's username (optional, uses current if not provided)
   */
  static setUserData(data, username = null) {
    const user = username || this.getCurrentUser()
    if (!user) {
      console.warn('No user specified and no user logged in, cannot save data')
      return false
    }
    
    // SECURITY: Prevent cross-user data access (except during registration)
    const currentUser = this.getCurrentUser()
    if (username && currentUser && username !== currentUser) {
      console.warn('🚨 Security: Attempt to access other user data blocked')
      return false
    }
    
    // SECURITY: Sanitize data before storage
    const sanitizedData = this.sanitizeData(data)
    
    // SECURITY: Validate data size to prevent storage abuse
    const dataString = JSON.stringify(sanitizedData)
    if (dataString.length > 1024 * 1024) { // 1MB limit
      console.error('User data too large (>1MB)')
      return false
    }
    
    const key = this.USER_DATA_PREFIX + user.toLowerCase()
    
    try {
      localStorage.setItem(key, dataString)
      return true
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded')
      }
      console.error('Failed to save user data:', error)
      return false
    }
  }

  /**
   * Update specific fields in user data
   * @param {object} updates - Fields to update
   * @param {string} username - Commander's username (optional)
   */
  static updateUserData(updates, username = null) {
    const currentData = this.getUserData(username) || {}
    const newData = { ...currentData, ...updates }
    return this.setUserData(newData, username)
  }

  /**
   * Initialize new user with default data
   * @param {string} username - Commander's username
   */
  static initializeUserData(username) {
    const defaultData = {
      username: username,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isFirstTime: true,
      preferences: {
        theme: 'military',
        soundEnabled: true,
        punishmentEnabled: false,
        idleTrackingEnabled: false
      }
    }
    
    this.setUserData(defaultData, username)
    return defaultData
  }

  /* 👥 PART 4: USER DISCOVERY */

  /**
   * Get list of all commanders on this device
   * @returns {Array<object>} Array of user info objects
   */
  static listAllUsers() {
    const users = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.USER_DATA_PREFIX)) {
        const username = key.replace(this.USER_DATA_PREFIX, '')
        // Use internal method to bypass security for administrative listing
        const userData = this._getInternalUserData(username)
        
        if (userData) {
          users.push({
            username: userData.username || username,
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin,
            isActive: username === this.getCurrentUser()
          })
        }
      }
    }
    
    // Sort by last login, most recent first
    return users.sort((a, b) => {
      const dateA = new Date(a.lastLogin || 0)
      const dateB = new Date(b.lastLogin || 0)
      return dateB - dateA
    })
  }

  /**
   * Check if a user exists
   * @param {string} username - Commander's username
   * @returns {boolean}
   */
  static userExists(username) {
    if (!username) return false
    const key = this.USER_DATA_PREFIX + username.toLowerCase()
    return localStorage.getItem(key) !== null
  }

  /**
   * Get the last logged in user
   * @returns {string|null}
   */
  static getLastUser() {
    return localStorage.getItem(this.LAST_USER_KEY)
  }

  /* 🗑️ PART 5: DATA CLEANUP */

  /**
   * Delete a commander's data (use with caution!)
   * @param {string} username - Commander's username
   * @returns {boolean} Success status
   */
  static deleteUser(username) {
    if (!username) return false
    
    const normalizedUsername = username.toLowerCase()
    
    // Don't delete current user while logged in
    if (normalizedUsername === this.getCurrentUser()) {
      console.warn('Cannot delete currently logged in user')
      return false
    }
    
    // Remove user data
    const userKey = this.USER_DATA_PREFIX + normalizedUsername
    localStorage.removeItem(userKey)
    
    // Remove user settings
    const settingsKey = this.SETTINGS_PREFIX + normalizedUsername
    localStorage.removeItem(settingsKey)
    
    // If this was the last user, clear that too
    if (this.getLastUser() === normalizedUsername) {
      localStorage.removeItem(this.LAST_USER_KEY)
    }
    
    return true
  }

  /**
   * Clear ALL Control Station data (nuclear option!)
   * @param {boolean} confirm - Must be true to execute
   */
  static clearAllData(confirm = false) {
    if (!confirm) {
      console.warn('clearAllData requires confirm=true parameter')
      return false
    }
    
    // Find and remove all Control Station keys
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith(this.USER_DATA_PREFIX) ||
        key.startsWith(this.SETTINGS_PREFIX) ||
        key === this.LAST_USER_KEY ||
        key.startsWith('control-station-') || // Old format
        key.startsWith('cs_') || // Possible game data
        key.startsWith('control_station_') // Any other format
      )) {
        keysToRemove.push(key)
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Clear session
    sessionStorage.clear()
    
    // Cleared Control Station data keys
    return true
  }

  /* 🔄 PART 6: MIGRATION HELPERS */

  /**
   * Migrate old data format to new user-specific format
   * @param {string} username - Commander to migrate data to
   */
  static migrateOldData(username) {
    // Check for old format data
    const oldKey = 'control-station-storage'
    const oldData = localStorage.getItem(oldKey)
    
    if (!oldData) return false
    
    try {
      const parsed = JSON.parse(oldData)
      
      // Create new user with old data
      const migratedData = {
        username: username,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isFirstTime: false,
        gameData: parsed, // Store old data under gameData
        preferences: {
          theme: parsed.settings?.theme || 'military',
          soundEnabled: parsed.settings?.soundEnabled ?? true,
          punishmentEnabled: false, // Default to OFF
          idleTrackingEnabled: false // Default to OFF
        }
      }
      
      // Save migrated data
      this.setUserData(migratedData, username)
      
      // Remove old data
      localStorage.removeItem(oldKey)
      
      // Successfully migrated old data to new format
      return true
    } catch (error) {
      // Failed to migrate old data
      return false
    }
  }

  /* 🛡️ PART 7: SECURITY & VALIDATION */
  
  /**
   * Sanitize user data to prevent prototype pollution
   * @param {object} data - Raw user data
   * @returns {object} - Sanitized data
   */
  static sanitizeData(data) {
    if (!data || typeof data !== 'object') return data
    
    const sanitized = {}
    const dangerousKeys = [
      '__proto__', 
      'constructor', 
      'prototype',
      '__defineGetter__',
      '__defineSetter__',
      '__lookupGetter__',
      '__lookupSetter__'
    ]
    
    for (const [key, value] of Object.entries(data)) {
      // Skip dangerous keys
      if (dangerousKeys.includes(key)) {
        console.warn(`Blocked dangerous property: ${key}`)
        continue
      }
      
      // Recursively sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeData(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }
  
  /**
   * Rate limiting for login attempts
   */
  static checkRateLimit(identifier) {
    const now = Date.now()
    const storageKey = `rate_limit_${identifier}`    
    // Get attempts from localStorage for persistence
    let attempts
    try {
      attempts = JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"firstAttempt":0,"lockedUntil":0}')
    } catch {
      attempts = { count: 0, firstAttempt: now, lockedUntil: 0 }
    }
    
    // Check if currently locked out
    if (attempts.lockedUntil > now) {
      const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000)
      return { 
        allowed: false, 
        error: `Too many attempts. Try again in ${remainingTime} seconds.` 
      }
    }
    
    // Reset counter if lockout period has passed
    if (attempts.lockedUntil > 0 && attempts.lockedUntil <= now) {
      attempts.count = 0
      attempts.lockedUntil = 0
      attempts.firstAttempt = now
    }
    
    return { allowed: true, attemptsRemaining: this.MAX_ATTEMPTS - attempts.count }
  }
  
  /**
   * Record a failed login attempt
   */
  static recordFailedAttempt(identifier) {
    const now = Date.now()
    const storageKey = `rate_limit_${identifier}`
    
    let attempts
    try {
      attempts = JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"firstAttempt":0,"lockedUntil":0}')
    } catch {
      attempts = { count: 0, firstAttempt: now, lockedUntil: 0 }
    }
    
    attempts.count++
    
    // Check if limit exceeded
    if (attempts.count >= this.MAX_ATTEMPTS) {
      attempts.lockedUntil = now + this.LOCKOUT_TIME
      console.warn(`🚨 Rate limit exceeded for ${identifier}. Locked out for ${this.LOCKOUT_TIME / 60000} minutes.`)
    }
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(attempts))
    } catch (error) {
      console.error('Failed to store rate limit data:', error)
    }
  }
  
  /**
   * Reset rate limit for successful login
   */
  static resetRateLimit(identifier) {
    const storageKey = `rate_limit_${identifier}`
    localStorage.removeItem(storageKey)
  }

  /**
   * Enhanced username validation with security checks
   * @param {string} username
   * @returns {object} { valid: boolean, error?: string }
   */
  static validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return { valid: false, error: 'Username is required' }
    }
    
    const trimmed = username.trim()
    
    // Length validation
    if (trimmed.length < 2) {
      return { valid: false, error: 'Username must be at least 2 characters' }
    }
    
    if (trimmed.length > 20) {
      return { valid: false, error: 'Username must be less than 20 characters' }
    }
    
    // Character validation - more restrictive
    const validPattern = /^[a-zA-Z0-9][a-zA-Z0-9_\s-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
    if (!validPattern.test(trimmed)) {
      return { 
        valid: false, 
        error: 'Username must start and end with letter/number, can contain letters, numbers, spaces, hyphens, and underscores' 
      }
    }
    
    // Blocked usernames
    const blockedUsernames = [
      'admin', 'administrator', 'root', 'system', 'guest', 'test', 'demo',
      'null', 'undefined', 'console', 'window', 'document', 'prototype'
    ]
    
    if (blockedUsernames.includes(trimmed.toLowerCase())) {
      return { valid: false, error: 'Username not allowed' }
    }
    
    // XSS/injection patterns
    const dangerousPatterns = [
      /<script/i, /javascript:/i, /on\w+=/i, /\[object/i, /__proto__/i,
      /constructor/i, /prototype/i, /eval\(/i, /function\(/i
    ]
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(trimmed)) {
        return { valid: false, error: 'Username contains invalid characters' }
      }
    }
    
    return { valid: true }
  }

  /* 📊 PART 8: ANALYTICS & DEBUGGING */

  /**
   * Get storage usage info
   * @returns {object} Storage statistics
   */
  static getStorageInfo() {
    let totalSize = 0
    let userCount = 0
    const breakdown = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('control_station_')) {
        const value = localStorage.getItem(key)
        const size = new Blob([value]).size
        totalSize += size
        
        if (key.startsWith(this.USER_DATA_PREFIX)) {
          userCount++
          const username = key.replace(this.USER_DATA_PREFIX, '')
          breakdown[username] = size
        }
      }
    }
    
    return {
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      userCount,
      breakdown,
      currentUser: this.getCurrentUser(),
      isLoggedIn: this.isLoggedIn()
    }
  }
}

/* 🚀 PART 9: DEVELOPMENT HELPERS */
if (import.meta.env.DEV) {
  // Attach to window for debugging
  window.UserManager = UserManager
  
  // Only show debug commands when explicitly requested
  if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  Debug Commands:                                       ║
║  • UserManager.getCurrentUser()                       ║
║  • UserManager.listAllUsers()                         ║
║  • UserManager.getUserData()                          ║
║  • UserManager.getStorageInfo()                       ║
║  • UserManager.switchUser('username')                 ║
║  • UserManager.logout()                                ║
╚════════════════════════════════════════════════════════╝
      `)
    }, 1000)
  }
}

// Export for use in other files
export default UserManager