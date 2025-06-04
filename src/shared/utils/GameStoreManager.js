// Game Store Manager - Handles user-specific game state management

import useGameStore from '../stores/useGameStore'
import UserManager from '../../features/auth/UserManager'

class GameStoreManager {
  /**
   * Clear game data for a specific user
   */
  static clearUserGameData(username) {
    const normalizedUsername = username.toLowerCase()
    const storageKey = `control_station_${normalizedUsername}`
    
    // Remove user-specific game data
    localStorage.removeItem(storageKey)
    
    console.log(`Cleared game data for user: ${normalizedUsername}`)
  }
  
  /**
   * Reset game state to initial values for current user
   */
  static resetCurrentUserGameState() {
    const state = useGameStore.getState()
    
    // Reset to initial values
    state.resetProgress()
    
    // Force store to persist the reset
    useGameStore.persist.rehydrate()
  }
  
  /**
   * Initialize fresh game state for new user
   */
  static initializeNewUser(username) {
    const normalizedUsername = username.toLowerCase()
    
    // Clear any existing data for this user
    this.clearUserGameData(normalizedUsername)
    
    // Set commander name
    useGameStore.getState().setCommander(normalizedUsername)
    
    // Reset all progress to ensure fresh start
    useGameStore.getState().resetProgress()
    
    console.log(`Initialized fresh game state for new user: ${normalizedUsername}`)
  }
  
  /**
   * Switch to existing user
   */
  static switchToUser(username) {
    const normalizedUsername = username.toLowerCase()
    
    // Set commander name
    useGameStore.getState().setCommander(normalizedUsername)
    
    // Force rehydration of user-specific data
    useGameStore.persist.rehydrate()
    
    console.log(`Switched to user: ${normalizedUsername}`)
  }
}

export default GameStoreManager