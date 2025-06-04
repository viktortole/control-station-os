// 📊 DATA MANAGER - Export/Import functionality for Control Station OS
import useGameStore from '../stores/useGameStore'
import useAuthStore from '../stores/useAuthStore'

class DataManager {
  /**
   * Export all user data to a JSON file
   * @returns {void}
   */
  static exportData() {
    const gameState = useGameStore.getState()
    const authState = useAuthStore.getState()
    
    // Gather all relevant data
    const exportData = {
      // Metadata
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      appVersion: import.meta.env.VITE_APP_VERSION || '0.0.1',
      
      // User data
      commander: gameState.commander,
      currentUser: authState.currentUser,
      
      // Game state
      level: gameState.level,
      totalXP: gameState.totalXP,
      todayXP: gameState.todayXP,
      streak: gameState.streak,
      longestStreak: gameState.longestStreak,
      
      // Tasks and projects
      tasks: gameState.tasks,
      projects: gameState.projects,
      
      // Achievements and stats
      achievements: gameState.achievements,
      stats: gameState.stats,
      
      // Settings
      settings: gameState.settings,
      
      // Additional data
      totalDemotions: gameState.totalDemotions,
      totalPunishments: gameState.totalPunishments,
      unlockedThemes: gameState.unlockedThemes,
      unlockedFeatures: gameState.unlockedFeatures,
      
      // Punishment system data
      lastPunishmentTime: gameState.lastPunishmentTime,
      treeDyingPunished: gameState.treeDyingPunished,
    }
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `control-station-backup-${exportData.commander || 'guest'}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    console.log('📊 Data exported successfully')
  }
  
  /**
   * Import data from a JSON file
   * @param {File} file - The file to import
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async importData(file) {
    try {
      // Validate file type
      if (!file.type.includes('json')) {
        return { success: false, message: 'Invalid file type. Please select a JSON file.' }
      }
      
      // Read file
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate data structure
      if (!data.version || !data.exportDate) {
        return { success: false, message: 'Invalid backup file format.' }
      }
      
      // Version compatibility check
      const majorVersion = data.version.split('.')[0]
      if (majorVersion !== '1') {
        return { success: false, message: `Incompatible backup version (${data.version}). This app requires version 1.x.x` }
      }
      
      // Confirm import
      const confirmMessage = `This will replace ALL current data with the backup from ${new Date(data.exportDate).toLocaleDateString()}. 
      
Commander: ${data.commander || 'Unknown'}
Level: ${data.level}
Total XP: ${data.totalXP}
Tasks: ${data.tasks?.length || 0}

Continue?`
      
      if (!confirm(confirmMessage)) {
        return { success: false, message: 'Import cancelled.' }
      }
      
      // Import the data
      const gameStore = useGameStore.getState()
      
      // Update game state
      gameStore.setState({
        commander: data.commander,
        level: data.level || 1,
        totalXP: data.totalXP || 0,
        todayXP: 0, // Reset today's XP
        previousLevelXP: data.previousLevelXP || 0,
        streak: data.streak || 0,
        longestStreak: data.longestStreak || 0,
        tasks: data.tasks || [],
        projects: data.projects || gameStore.projects,
        achievements: data.achievements || [],
        stats: data.stats || gameStore.stats,
        settings: { ...gameStore.settings, ...data.settings },
        totalDemotions: data.totalDemotions || 0,
        totalPunishments: data.totalPunishments || 0,
        unlockedThemes: data.unlockedThemes || ['military'],
        unlockedFeatures: data.unlockedFeatures || [],
        lastPunishmentTime: data.lastPunishmentTime,
        treeDyingPunished: data.treeDyingPunished || false,
      })
      
      // Update auth if needed
      if (data.currentUser && data.commander) {
        const authStore = useAuthStore.getState()
        authStore.setCurrentUser(data.currentUser)
      }
      
      // Reinitialize systems
      gameStore.checkStreak()
      gameStore.initializePunishment()
      
      console.log('📊 Data imported successfully')
      return { success: true, message: 'Data imported successfully! The page will reload.' }
      
    } catch (error) {
      console.error('Import error:', error)
      return { success: false, message: `Import failed: ${error.message}` }
    }
  }
  
  /**
   * Create a shareable link with limited data (for sharing with friends)
   * @returns {string} - Shareable data string
   */
  static createShareableData() {
    const gameState = useGameStore.getState()
    
    const shareData = {
      commander: gameState.commander,
      level: gameState.level,
      totalXP: gameState.totalXP,
      streak: gameState.streak,
      achievements: gameState.achievements.length,
      tasksCompleted: gameState.stats.totalTasksCompleted,
      shareDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    // Encode as base64 for easy sharing
    const encoded = btoa(JSON.stringify(shareData))
    return encoded
  }
  
  /**
   * Import shareable data (limited import for comparing with friends)
   * @param {string} shareCode - The share code to import
   * @returns {{success: boolean, data?: object, message?: string}}
   */
  static importShareableData(shareCode) {
    try {
      const decoded = atob(shareCode)
      const data = JSON.parse(decoded)
      
      if (!data.version || !data.commander) {
        return { success: false, message: 'Invalid share code' }
      }
      
      return { success: true, data }
    } catch (error) {
      return { success: false, message: 'Invalid share code format' }
    }
  }
}

export default DataManager