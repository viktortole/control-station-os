// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 APPLICATION CONFIGURATION - CONTROL STATION OS                             │
// │ Centralized configuration for app metadata and settings                      │
// ╰──────────────────────────────────────────────────────────────────────────────╯

export const APP_CONFIG = {
  // Application metadata
  name: 'Control Station OS',
  version: 'Closed Alpha V0.1',
  tagline: 'Military-Grade Productivity System',
  description: 'Punishment-based task management with XP loss and level demotion',
  
  // Build information
  buildDate: new Date().toISOString(),
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Feature flags
  features: {
    punishment: true,
    multiUser: true,
    achievements: true,
    sounds: true,
    animations: true,
    developerTools: import.meta.env.DEV
  },
  
  // System requirements
  requirements: {
    minResolution: { width: 320, height: 568 },
    recommendedResolution: { width: 1920, height: 1080 },
    supportedBrowsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+']
  },
  
  // Storage keys
  storage: {
    authSession: 'control_station_current_user',
    lastUser: 'control_station_last_user',
    userPrefix: 'control_station_user_',
    gamePrefix: 'control_station_',
    settingsPrefix: 'control_station_settings_'
  },
  
  // XP system configuration (DEPRECATED - Use xp.config.js)
  xpSystem: {
    taskXP: {
      high: 100,      // Use XP_VALUES.HIGH instead
      medium: 50,     // Use XP_VALUES.MEDIUM instead
      low: 25         // Use XP_VALUES.LOW instead
    },
    punishments: {
      taskFailure: 25,     // Standardized to -25
      taskDeletion: 25,    // Standardized to -25
      dailyGoalMissed: 25, // Standardized to -25
      abandonPenalty: 50   // Standardized to -50
    },
    bonusChances: {
      mega: 0.01,    // 1%
      critical: 0.04, // 4%
      bonus: 0.1     // 10%
    }
  },
  
  // Theme configuration
  themes: {
    default: 'military',
    available: ['military', 'midnight', 'hacker', 'crimson', 'tactical']
  },
  
  // Audio configuration
  audio: {
    defaultVolume: 0.7,
    enabledByDefault: true
  },
  
  // Performance settings
  performance: {
    maxXPAnimations: 10,
    animationTimeout: 3000,
    debounceDelay: 300,
    autosaveInterval: 30000 // 30 seconds
  },
  
  // API endpoints (for future use)
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.controlstation.app',
    version: 'v1'
  }
}

// Version helper functions
export const getVersion = () => APP_CONFIG.version
export const getFullVersion = () => `${APP_CONFIG.name} v${APP_CONFIG.version}`
export const getBuildInfo = () => ({
  version: APP_CONFIG.version,
  date: APP_CONFIG.buildDate,
  environment: APP_CONFIG.environment
})

// Storage key helpers
export const getStorageKey = (type, identifier) => {
  const prefix = APP_CONFIG.storage[type]
  return prefix ? `${prefix}${identifier}` : identifier
}

// Feature flag helpers
export const isFeatureEnabled = (feature) => {
  return APP_CONFIG.features[feature] ?? false
}

// Environment helpers
export const isDev = () => APP_CONFIG.isDevelopment
export const isProd = () => APP_CONFIG.isProduction

export default APP_CONFIG