// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/stores/useAuthStore.js                                          │
// │ 🎯 PURPOSE: Handle multi-user authentication state and session management   │
// │ 📦 DEPENDENCIES:                                                             │
// │   - zustand: State management                                               │
// │   - UserManager: Multi-user session handling from core/auth                │
// │ 🔗 CONNECTIONS:                                                              │
// │   - Used by: App.jsx, AuthScreen.jsx, Layout.jsx (logout)                  │
// │   - Uses: UserManager for session persistence and user data                │
// │ 💾 STATE/PROPS: Authentication state (currentUser, isAuthenticated, etc.)   │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import { create } from 'zustand'
import UserManager from '../../features/auth/UserManager'
import GameStoreManager from '../utils/GameStoreManager'

/* 🔐 PART 1: AUTHENTICATION STORE */
const useAuthStore = create((set, get) => ({
  // 📊 Authentication State
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  availableUsers: [],
  lastLoginTime: null,
  sessionTimeout: null,
  
  /* 🚀 PART 2: INITIALIZATION */
  
  /**
   * Initialize auth state - check for existing session
   */
  initialize: () => {
    try {
      // Ensure admin account exists for controlled quick login
      UserManager.ensureAdminAccount()

      const currentUser = UserManager.getCurrentUser()
      const availableUsers = UserManager.listAllUsers()
      
      set({
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading: false,
        availableUsers,
        lastLoginTime: currentUser ? new Date().toISOString() : null
      })
      
      if (currentUser) {
        // Update user's last login time
        const userData = UserManager.getUserData(currentUser) || {}
        userData.lastLogin = new Date().toISOString()
        userData.isFirstTime = false
        UserManager.setUserData(userData, currentUser)
        
        // Session restored for commander
      } else {
        // No active session found
      }
      
      return !!currentUser
    } catch (error) {
      // Auth initialization failed
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        availableUsers: []
      })
      return false
    }
  },
  
  /* 🚪 PART 3: LOGIN/LOGOUT ACTIONS */
  
  /**
   * Register a new commander
   * @param {string} username - Commander's username 
   * @param {object} profileData - Profile data including password, specialization, etc.
   */
  register: async (username, profileData = {}) => {
    try {
      const normalizedUsername = username.trim().toLowerCase()
      
      // Registering new commander
      
      // Perform registration
      const registrationResult = UserManager.register(normalizedUsername, profileData)
      
      if (!registrationResult.success) {
        return { success: false, error: registrationResult.error || 'Registration failed' }
      }
      
      // Update state after successful registration
      set({
        currentUser: normalizedUsername,
        isAuthenticated: true,
        lastLoginTime: new Date().toISOString(),
        availableUsers: UserManager.listAllUsers()
      })
      
      // Initialize fresh game state for new user
      GameStoreManager.initializeNewUser(normalizedUsername)
      
      // Registration successful
      
      // Trigger window event
      window.dispatchEvent(new CustomEvent('auth-register', { 
        detail: { user: normalizedUsername, profileData } 
      }))
      
      return { success: true, user: normalizedUsername, isNewUser: true }
    } catch (error) {
      // Registration failed
      return { success: false, error: error.message }
    }
  },

  /**
   * Login a commander
   * @param {string} username - Commander's username
   * @param {string} password - Commander's password (optional)
   * @param {object} options - Login options
   */
  login: async (username, password = null, options = {}) => {
    try {
      // UserManager handles validation internally
      const normalizedUsername = username.trim().toLowerCase()
      
      // Check if this is a new user
      const isNewUser = !UserManager.userExists(normalizedUsername)
      
      // Perform secure login with password
      const loginResult = UserManager.login(normalizedUsername, password)
      
      if (!loginResult.success) {
        return { success: false, error: loginResult.error || 'Login failed' }
      }
      
      const loggedInUser = loginResult.username
      
      // Update state
      set({
        currentUser: loggedInUser,
        isAuthenticated: true,
        lastLoginTime: new Date().toISOString(),
        availableUsers: UserManager.listAllUsers()
      })
      
      // REMOVED: window.location.reload() - causes black screen issue
      // Instead, we'll rely on proper store initialization in App.jsx
      
      // Initialize user data if new
      if (isNewUser) {
        // New commander registered
        
        // Initialize fresh game state
        GameStoreManager.initializeNewUser(loggedInUser)
        
        // Set initial preferences
        const currentData = UserManager.getUserData(loggedInUser) || {}
        UserManager.setUserData({
          ...currentData,
          preferences: {
            theme: 'military',
            soundEnabled: true,
            punishmentEnabled: false, // Default OFF
            idleTrackingEnabled: false, // Default OFF
            ...options.preferences
          }
        }, loggedInUser)
      } else {
        // Existing user - switch to their data
        GameStoreManager.switchToUser(loggedInUser)
      }
      
      // Login successful
      
      // Trigger window event for other components
      window.dispatchEvent(new CustomEvent('auth-login', { 
        detail: { user: loggedInUser, isNewUser } 
      }))
      
      return { success: true, user: loggedInUser, isNewUser }
    } catch (error) {
      // Login failed
      
      set({
        currentUser: null,
        isAuthenticated: false
      })
      
      return { success: false, error: error.message }
    }
  },
  
  /**
   * Logout current commander
   * @param {object} options - Logout options
   */
  logout: async (options = {}) => {
    try {
      const currentUser = get().currentUser
      
      // Update user's last logout time
      if (currentUser) {
        const userData = UserManager.getUserData(currentUser) || {}
        userData.lastLogout = new Date().toISOString()
        userData.sessionEnded = true
        UserManager.setUserData(userData, currentUser)
      }
      
      // Perform secure logout
      UserManager.logout()
      
      // Clear state
      set({
        currentUser: null,
        isAuthenticated: false,
        lastLoginTime: null,
        sessionTimeout: null
      })
      
      // Logout successful
      
      // Trigger window event
      window.dispatchEvent(new CustomEvent('auth-logout', { 
        detail: { user: currentUser } 
      }))
      
      // Reload if requested (default behavior)
      if (options.reload !== false) {
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
      
      return { success: true }
    } catch (error) {
      // Logout failed
      return { success: false, error: error.message }
    }
  },
  
  /**
   * Switch to a different commander
   * @param {string} username - Target commander's username
   */
  switchUser: async (username) => {
    try {
      const currentUser = get().currentUser
      
      // Logout current user (without reload)
      await get().logout({ reload: false })
      
      // Login new user
      const result = await get().login(username)
      
      if (result.success) {
        // User switched successfully
        
        // REMOVED: window.location.reload() - use proper state management instead
        // The app should handle user switching without reloading
      }
      
      return result
    } catch (error) {
      // User switch failed
      return { success: false, error: error.message }
    }
  },
  
  /* 👥 PART 4: USER MANAGEMENT */
  
  /**
   * Refresh available users list
   */
  refreshUsers: () => {
    const availableUsers = UserManager.listAllUsers()
    set({ availableUsers })
    return availableUsers
  },
  
  /**
   * Get current user data
   */
  getCurrentUserData: () => {
    const currentUser = get().currentUser
    return currentUser ? UserManager.getUserData(currentUser) : null
  },
  
  /**
   * Update current user's preferences
   * @param {object} preferences - Preferences to update
   */
  updateUserPreferences: (preferences) => {
    const currentUser = get().currentUser
    if (!currentUser) return false
    
    const currentData = UserManager.getUserData(currentUser) || {}
    const updatedData = {
      ...currentData,
      preferences: {
        ...currentData.preferences,
        ...preferences
      },
      lastUpdated: new Date().toISOString()
    }
    
    return UserManager.setUserData(updatedData, currentUser)
  },
  
  /**
   * Delete a commander (with confirmation)
   * @param {string} username - Commander to delete
   * @param {boolean} confirmed - Must be true to execute
   */
  deleteCommander: (username, confirmed = false) => {
    if (!confirmed) {
      // deleteCommander requires confirmed=true
      return false
    }
    
    const currentUser = get().currentUser
    
    // Can't delete current user
    if (username === currentUser) {
      // Cannot delete currently logged in user
      return false
    }
    
    // UserManager doesn't have deleteUser - would need to implement
    // User deletion not implemented in UserManager
    const success = false
    
    if (success) {
      // Refresh users list
      get().refreshUsers()
      // Commander deleted successfully
    }
    
    return success
  },
  
  /* ⏰ PART 5: SESSION MANAGEMENT */
  
  /**
   * Check if session is still valid
   */
  validateSession: () => {
    const state = get()
    
    if (!state.isAuthenticated || !state.currentUser) {
      return false
    }
    
    // Check if user data still exists
    const userData = UserManager.getUserData(state.currentUser)
    if (!userData) {
      // User data not found, invalidating session
      get().logout({ reload: false })
      return false
    }
    
    return true
  },
  
  /**
   * Extend session (update last activity)
   */
  extendSession: () => {
    const currentUser = get().currentUser
    if (currentUser) {
      const currentData = UserManager.getUserData(currentUser) || {}
      UserManager.setUserData({
        ...currentData,
        lastActivity: new Date().toISOString()
      }, currentUser)
    }
  },
  
  /* 🧹 PART 6: MAINTENANCE */
  
  /**
   * Get authentication analytics
   */
  getAuthStats: () => {
    const state = get()
    const storageInfo = UserManager.getStorageInfo()
    
    return {
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
      totalUsers: state.availableUsers.length,
      lastLoginTime: state.lastLoginTime,
      storageUsed: storageInfo.totalSizeKB + ' KB',
      storageBreakdown: storageInfo.breakdown,
      sessionValid: get().validateSession()
    }
  },
  
  /**
   * Emergency cleanup (nuclear option)
   */
  emergencyReset: (confirmed = false) => {
    if (!confirmed) {
      // emergencyReset requires confirmed=true
      return false
    }
    
    try {
      // Clear all Control Station data
      UserManager.clearAllData(true)
      
      // Reset state
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        availableUsers: [],
        lastLoginTime: null,
        sessionTimeout: null
      })
      
      // Emergency reset completed
      
      // Reload page
      setTimeout(() => {
        window.location.reload()
      }, 100)
      
      return true
    } catch (error) {
      // Emergency reset failed
      return false
    }
  }
}))

/* 🚀 PART 7: AUTO-INITIALIZATION */
// Auto-initialization removed to prevent conflicts with App.jsx
// App.jsx will handle initialization explicitly

/* 🛡️ PART 8: DEVELOPER TOOLS */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.authStore = useAuthStore
  
  // Add auth debug commands to existing debug object
  if (!window.debug) window.debug = {}
  
  Object.assign(window.debug, {
    // Auth commands
    auth: () => useAuthStore.getState(),
    login: (name, password) => useAuthStore.getState().login(name, password),
    register: (name, data) => useAuthStore.getState().register(name, data),
    logout: () => useAuthStore.getState().logout(),
    switch: (name) => useAuthStore.getState().switchUser(name),
    users: () => useAuthStore.getState().availableUsers,
    authStats: () => useAuthStore.getState().getAuthStats(),
    
    // Maintenance commands
    deleteUser: (name) => useAuthStore.getState().deleteCommander(name, true),
    resetAuth: () => useAuthStore.getState().emergencyReset(true),
  })
  
  // Auth store loaded with debug commands available in development mode
}

export default useAuthStore
