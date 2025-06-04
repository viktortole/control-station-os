// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/App.jsx                                                         │
// │ 🎯 TACTICAL COMMAND CENTER V2.0 - CONTROL STATION OS                        │
// │ Military-Grade Application Shell with Enhanced Punishment Display            │
// │ Developer Tools, Error Boundaries, and Tactical Boot Sequence               │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🏁 PART 1: TACTICAL IMPORTS & DEPENDENCIES */
import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useGameStore from '../shared/stores/useGameStore'
import useAuthStore from '../shared/stores/useAuthStore'
import CompactAuthScreen from '../features/auth/CompactAuthScreen'
import { applyTheme } from '../shared/config/themes'

// Layout components
import Layout from '../components/layout/Layout'

// Game components
import { 
  XPPopup, 
  LevelUpCelebration, 
  AchievementNotification 
} from '../components/shared/GameElements'
import { DailyLoginBonusPopup } from '../features/auth/DailyLoginBonus'

// Extracted components
import PunishmentOverlay from '../features/dashboard/PunishmentOverlay'
// import DeveloperTools from '../components/shared/DeveloperTools' // REMOVED: To be repositioned later
// SettingsView will be lazy loaded below
import AchievementTestPanel from '../features/achievements/AchievementTestPanel'
import TacticalErrorBoundary from '../components/layout/TacticalErrorBoundary'
import CommandPalette from '../components/shared/CommandPalette'
import KeyboardShortcuts from '../components/shared/KeyboardShortcuts'
// import FeedbackCollector from '../components/shared/FeedbackCollector' // REMOVED: To be repositioned later
// import DailyUseTracker from '../components/shared/DailyUseTracker' // REMOVED: To be repositioned later
// import DebugOverlay from '../components/shared/DebugOverlay' // REMOVED: To be repositioned later
// import { 
//   AccessibilityProvider, 
//   ScreenReaderAnnouncements, 
//   SkipNavigation,
//   HighContrastStyles 
// } from './components/AccessibilityEnhancer'

// Lazy load heavy components for better performance with better loading states
const Dashboard = React.lazy(() => 
  import('../features/dashboard/Dashboard').then(module => ({ default: module.default }))
)
const IntelligenceHub = React.lazy(() => 
  import('../features/intelligence/IntelligenceHub').then(module => ({ default: module.default }))
)
const MissionControl = React.lazy(() => 
  import('../features/missions/MissionControl').then(module => ({ default: module.default }))
)
const UltimateFocusGuardian = React.lazy(() => 
  import('../features/focus/UltimateFocusGuardian').then(module => ({ default: module.default }))
)
const AchievementsView = React.lazy(() => 
  import('../features/achievements/AchievementsView').then(module => ({ default: module.default }))
)
const SettingsView = React.lazy(() => 
  import('../features/settings/SettingsView').then(module => ({ default: module.default }))
)

// Static imports for components used in multiple places - LAZY LOADED
const UserProfile = React.lazy(() => 
  import('../features/settings/UserProfile').then(module => ({ default: module.default }))
)

// Icons for tactical UI - import only what's needed immediately
import { 
  Shield, Activity, Crosshair, Database, Cpu, Wifi, WifiOff
} from 'lucide-react'

// Audio system - lazy loaded to prevent blocking
let TacticalAudio = null
const loadTacticalAudio = async () => {
  if (!TacticalAudio) {
    const module = await import('../shared/utils/AdvancedMilitarySoundEngine')
    TacticalAudio = module.TacticalAudio
  }
  return TacticalAudio
}

/* 🚨 PART 2: TACTICAL ERROR BOUNDARY - Using imported component */
// See src/components/TacticalErrorBoundary.jsx for implementation

/* 💀 PART 3: PUNISHMENT OVERLAY COMPONENT - EXTRACTED */
// See src/components/PunishmentOverlay.jsx for implementation

/* 🎮 PART 4: PLACEHOLDER VIEWS WITH TACTICAL STYLING */
const TacticalPlaceholder = ({ icon: Icon, title, subtitle, status = "UNDER CONSTRUCTION" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-center h-[60vh]"
  >
    <div className="text-center max-w-md">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6 p-8 rounded-2xl bg-gray-900/50 border border-white/10"
      >
        <Icon className="w-16 h-16 text-white/30" />
      </motion.div>
      <h2 className="text-3xl font-black text-white/80 uppercase tracking-wider mb-2">
        {title}
      </h2>
      <p className="text-white/60 mb-4">{subtitle}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
        <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
        <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
          {status}
        </span>
      </div>
    </div>
  </motion.div>
)

// FocusView now uses lazy-loaded FocusGuardian component


// Removed duplicate lazy loading declarations - moved above

/* ⚙️ PART 5: ENHANCED SETTINGS VIEW - EXTRACTED */
// See src/components/SettingsView.jsx for implementation

/* 🚀 PART 6: TACTICAL BOOT SEQUENCE */
const BootSequence = ({ onComplete }) => {
  const [stage, setStage] = useState(0)
  const stages = [
    { text: "INITIALIZING CONTROL STATION OS...", icon: Cpu },
    { text: "LOADING CORE MODULES...", icon: Database },
    { text: "ESTABLISHING SECURE CONNECTION...", icon: Wifi },
    { text: "ACTIVATING SYSTEM MODULES...", icon: Shield },
    { text: "SYSTEM READY. ALL MODULES OPERATIONAL.", icon: Crosshair },
  ]
  
  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(timer)
          setTimeout(() => {
            onComplete()
          }, 200)
          return prev
        }
        return prev + 1
      })
    }, 200)
    
    // Failsafe - force complete after 3 seconds
    const failsafe = setTimeout(() => {
      onComplete()
    }, 3000)
    
    return () => {
      clearInterval(timer)
      clearTimeout(failsafe)
    }
  }, [onComplete, stages.length])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center"
    >
      <div className="max-w-2xl w-full px-8">
        <div className="space-y-4">
          {stages.slice(0, stage + 1).map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <Icon className="w-6 h-6 text-green-400" />
                <p className="font-mono text-green-400 text-sm">
                  {item.text}
                </p>
                {index === stage && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-green-400"
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((stage + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* 🛠️ PART 7: DEVELOPER COMMAND CENTER - EXTRACTED */
// See src/components/DeveloperTools.jsx for implementation

/* 📡 PART 8: CONNECTION STATUS MONITOR */
const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  if (isOnline) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 px-4 py-2 rounded-lg border border-red-500 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-red-400" />
        <span className="text-sm font-bold text-red-300">OFFLINE MODE</span>
      </div>
    </motion.div>
  )
}

/* 🎯 PART 9: MAIN TACTICAL APP COMPONENT */
function App() {
  // ========== ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY RENDER ==========
  
  // Auth state from store
  const { currentUser, isAuthenticated, isLoading: authLoading, initialize, login, logout } = useAuthStore()
  
  // Component state - ALWAYS called in same order
  const [showBoot, setShowBoot] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const [xpQueue, setXpQueue] = useState([])
  const [levelCelebration, setLevelCelebration] = useState(null)
  const [achievementQueue, setAchievementQueue] = useState([])
  const [punishmentFeedback, setPunishmentFeedback] = useState(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  
  // Store subscriptions - ALWAYS called in same order
  const currentView = useGameStore(state => state.currentView)
  const level = useGameStore(state => state.level)
  const totalXP = useGameStore(state => state.totalXP)
  const achievements = useGameStore(state => state.achievements)
  const commander = useGameStore(state => state.commander)
  const checkStreak = useGameStore(state => state.checkStreak)
  const initializePunishment = useGameStore(state => state.initializePunishment)
  const processDailyLogin = useGameStore(state => state.processDailyLogin)
  const setCommander = useGameStore(state => state.setCommander)
  const settings = useGameStore(state => state.settings)
  const currentTheme = settings?.theme || 'military'
  
  // ========== ALL useEffect HOOKS - CALLED IN SAME ORDER EVERY RENDER ==========
  
  // 1. Export debug states for DebugOverlay (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.debugStates = {
        isAppReady,
        showBoot,
        authLoading,
        isAuthenticated,
        currentUser,
        currentView,
        commander,
        totalXP
      }
    }
  }, [isAppReady, showBoot, authLoading, isAuthenticated, currentUser, currentView, commander, totalXP])
  
  // 2. Initialize auth system - FIXED: initialize is synchronous, not async
  useEffect(() => {
    try {
      const hasSession = initialize() // This returns a boolean, not a Promise
      setIsAppReady(true)
      setShowBoot(false) // Always skip boot screen
    } catch (error) {
      console.error('Auth initialization failed:', error)
      setIsAppReady(true)
      setShowBoot(false)
    }
  }, [initialize])
  
  // 3. Apply theme
  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])
  
  // 4. Safety check for critical state - ensure we always have a valid view
  useEffect(() => {
    if (!currentView || !['dashboard', 'tasks', 'focus', 'stats', 'achievements', 'settings'].includes(currentView)) {
      useGameStore.getState().setView('dashboard')
    }
  }, [currentView])
  
  // ========== ALL useCallback HOOKS - CALLED IN SAME ORDER EVERY RENDER ==========
  
  // Callback 1: XP animation system with anti-spam protection
  const triggerXP = useCallback((amount, bonusType = null, position = null) => {
    const defaultPos = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
    
    const pos = position || defaultPos
    
    // Play XP gain sound based on amount (lazy loaded)
    loadTacticalAudio().then(audio => {
      audio.xpGain(Math.abs(amount))
    }).catch(() => {
      // Silent fail if audio can't load
    })
    
    // Add staggered positioning for rapid-fire clicks
    setXpQueue(prev => {
      // Strict limit queue size to prevent memory issues (reduced from 8 to 5)
      const limitedQueue = prev.length > 5 ? prev.slice(-3) : prev
      
      const offset = limitedQueue.length * 30 // 30px offset per existing popup
      const adjustedPos = {
        x: pos.x + (Math.random() - 0.5) * 60, // Random spread
        y: pos.y + offset
      }
      
      return [...limitedQueue, {
        id: Date.now() + Math.random(),
        amount,
        bonusType,
        position: adjustedPos
      }]
    })
  }, [])
  
  // Callback 2: Handle XP animation complete
  const handleXPComplete = useCallback((id) => {
    setXpQueue(prev => prev.filter(p => p.id !== id))
  }, [])
  
  // Callback 3: Handle level up animation complete
  const handleLevelComplete = useCallback(() => {
    setLevelCelebration(null)
  }, [])
  
  // Callback 4: Handle achievement notification complete
  const handleAchievementComplete = useCallback(() => {
    setAchievementQueue(prev => prev.slice(1))
  }, [])
  
  // 5. Initialize systems after auth
  useEffect(() => {
    if (isAuthenticated && !showBoot) {
      // Force store rehydration with current user
      useGameStore.getState()
      
      // Sync commander name (use lowercase to match storage)
      if (currentUser) {
        setCommander(currentUser.toLowerCase())
      }
      
      // Initialize punishment system
      initializePunishment()
      
      // Check daily streak
      checkStreak()
      
      // Process daily login bonus (creates addiction through daily rewards)
      const loginBonus = processDailyLogin()
      if (loginBonus && loginBonus.xp > 0) {
        // Trigger XP animation for daily bonus
        setTimeout(() => {
          triggerXP(loginBonus.xp, 'BONUS', {
            x: window.innerWidth / 2,
            y: window.innerHeight / 3
          })
        }, 1000)
      }
      
      // Subscribe to punishment events
      const handlePunishment = (e) => {
        setPunishmentFeedback({
          amount: e.detail.xpLost,
          reason: e.detail.reason,
          demoted: e.detail.demoted,
          newLevel: e.detail.newLevel,
          newTotalXP: e.detail.newTotalXP,
          treeHealth: e.detail.treeHealth
        })
        
        // Play punishment sound if enabled (lazy loaded)
        const { settings } = useGameStore.getState()
        if (settings.soundEnabled !== false) {
          loadTacticalAudio().then(audio => {
            audio.punishment()
          }).catch(() => {
            // Silent fail if audio can't load
          })
        }
        
        // Auto-dismiss after 4 seconds
        setTimeout(() => setPunishmentFeedback(null), 4000)
      }
      
      window.addEventListener('punishment', handlePunishment)
      return () => window.removeEventListener('punishment', handlePunishment)
    }
  }, [isAuthenticated, showBoot, currentUser, checkStreak, initializePunishment, processDailyLogin, triggerXP, setCommander])
  
  // Authentication handlers - simplified
  const handleAuthenticate = async (username) => {
    const result = await login(username)
    
    if (result.success) {
      
      // Set commander name immediately
      const normalizedUsername = username.toLowerCase()
      setCommander(normalizedUsername)
      
      // Force store rehydration
      useGameStore.persist.rehydrate()
      
      // Ensure valid view is set
      const gameState = useGameStore.getState()
      if (!gameState.currentView) {
        gameState.setView('dashboard')
      }
      
      // No boot screen - go directly to app
      setShowBoot(false)
    }
    
    return result
  }
  
  
  // 6. Sound settings sync (lazy loaded)
  useEffect(() => {
    const syncAudioSettings = async () => {
      try {
        const audio = await loadTacticalAudio()
        const { settings } = useGameStore.getState()
        audio.setEnabled(settings.soundEnabled !== false)
        
        // Subscribe to settings changes
        const unsubscribe = useGameStore.subscribe((state) => {
          audio.setEnabled(state.settings.soundEnabled !== false)
        })
        
        return unsubscribe
      } catch (error) {
        // Silent fail if audio can't load
        return () => {}
      }
    }
    
    syncAudioSettings()
  }, [])
  
  // 7. Level up detection
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      // Check for level up
      if (state.level > (prevState?.level || level)) {
        setLevelCelebration(state.level)
        // Play epic level up sound (lazy loaded)
        if (state.settings.soundEnabled !== false) {
          loadTacticalAudio().then(audio => {
            audio.levelUp()
          }).catch(() => {
            // Silent fail if audio can't load
          })
        }
      }
      
      // Check for new achievements
      if (state.achievements.length > (prevState?.achievements?.length || achievements.length)) {
        const newAchievements = state.achievements.filter(
          a => !(prevState?.achievements || achievements).includes(a)
        )
        setAchievementQueue(prev => [...prev, ...newAchievements])
      }
    })
    
    return unsubscribe
  }, [level, achievements])
  
  // 8. Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(prev => !prev)
      }
      
      // Keyboard shortcuts help (?)
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setShowKeyboardShortcuts(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // View router with lazy loading potential
  const renderView = () => {
    try {
      // Ensure we always have a valid view
      const safeView = currentView || 'dashboard'
      
      // Enhanced loading fallback for lazy components
      const LoadingFallback = () => (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-white/20 border-t-green-400 rounded-full mx-auto mb-4"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 font-mono text-sm"
            >
              LOADING TACTICAL SYSTEMS...
            </motion.p>
            <div className="mt-2 text-xs text-white/40">
              Initializing military-grade components
            </div>
          </div>
        </div>
      )
      
      switch (safeView) {
        case 'dashboard': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard onXPAnimation={triggerXP} />
            </Suspense>
          )
        }
        case 'tasks': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <MissionControl onXPAnimation={triggerXP} />
            </Suspense>
          )
        }
        case 'focus': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <UltimateFocusGuardian onXPAnimation={triggerXP} initialTab="timer" />
            </Suspense>
          )
        }
        // Legacy routes for backwards compatibility - redirect to focus with specific tabs
        case 'focustest': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <UltimateFocusGuardian onXPAnimation={triggerXP} initialTab="debug" />
            </Suspense>
          )
        }
        case 'activity': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <UltimateFocusGuardian onXPAnimation={triggerXP} initialTab="activity" />
            </Suspense>
          )
        }
        case 'stats': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <IntelligenceHub />
            </Suspense>
          )
        }
        case 'achievements': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <AchievementsView />
            </Suspense>
          )
        }
        case 'settings': {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <SettingsView />
            </Suspense>
          )
        }
        default: {
          return (
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard onXPAnimation={triggerXP} />
            </Suspense>
          )
        }
      }
    } catch (error) {
      // Error rendering view
      return (
        <div className="p-8">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading View</h2>
            <p className="text-white/60 mb-4">{error.message}</p>
            <p className="text-white/40 text-sm mb-4">Current view: {currentView}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
  }
  
  // App render state available for debugging

  // Loading state
  if (!isAppReady || authLoading) {
    return (
      <div className="flex items-center justify-center bg-black" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⚡
        </motion.div>
      </div>
    )
  }
  
  // Skip boot sequence for faster startup
  // Boot sequence removed for performance
  
  // Additional safety check - if we're authenticated but something went wrong
  if (isAuthenticated && !showBoot && !currentView) {
    useGameStore.getState().setView('dashboard')
    // Force re-render by setting a valid view
    return (
      <div className="flex items-center justify-center bg-black text-white" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚡</div>
          <div className="text-white/60">Initializing Control Station...</div>
        </div>
      </div>
    )
  }
  
  // Auth screen with proper styling wrapper
  if (!isAuthenticated) {
    return (
      <div className="bg-black text-white" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <CompactAuthScreen onAuthenticate={handleAuthenticate} />
      </div>
    )
  }
  
  // Main app
  
  return (
    <TacticalErrorBoundary>
      <div className="App bg-black text-white" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        {/* Emergency fallback for black screen */}
        {!isAuthenticated ? (
          <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">⚠️ Authentication Error</h1>
              <p className="mb-4">Please refresh the page and try again.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : (
          <Layout>
            <main id="main-content" className="relative min-h-full">
              {/* Connection Status - Now separate from header */}
              <ConnectionStatus />
              
              {/* Main View */}
              <TacticalErrorBoundary>
                {renderView()}
              </TacticalErrorBoundary>
            </main>
          
          {/* Floating XP popups */}
          <AnimatePresence>
            {xpQueue.map(popup => (
              <XPPopup
                key={popup.id}
                amount={popup.amount}
                bonusType={popup.bonusType}
                position={popup.position}
                onAnimationComplete={() => handleXPComplete(popup.id)}
              />
            ))}
          </AnimatePresence>
          
          {/* Level up celebration */}
          <AnimatePresence>
            {levelCelebration && (
              <LevelUpCelebration
                level={levelCelebration}
                onComplete={handleLevelComplete}
              />
            )}
          </AnimatePresence>
          
          {/* Achievement notifications */}
          <AnimatePresence>
            {achievementQueue.length > 0 && (
              <AchievementNotification
                achievement={achievementQueue[0]}
                onComplete={handleAchievementComplete}
              />
            )}
          </AnimatePresence>
          
          {/* 🌅 DAILY LOGIN BONUS - POSITIVE REINFORCEMENT */}
          <DailyLoginBonusPopup />
          
          {/* TACTICAL PUNISHMENT OVERLAY */}
          <AnimatePresence>
            {punishmentFeedback && (
              <PunishmentOverlay punishment={punishmentFeedback} />
            )}
          </AnimatePresence>
          
          {/* Developer Tools - REMOVED: To be repositioned later */}
          {/* <DeveloperTools /> */}
          
          {/* Achievement Test Panel (dev only) - REMOVED for production */}
          {/* <AchievementTestPanel /> */}
          
          {/* User Profile Modal */}
          <Suspense fallback={<div>Loading profile...</div>}>
            <UserProfile 
              isOpen={showUserProfile} 
              onClose={() => setShowUserProfile(false)} 
            />
          </Suspense>
          
          {/* Command Palette (Cmd/Ctrl + K) */}
          <CommandPalette 
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
          />
          
          {/* Keyboard Shortcuts Help (?) */}
          <KeyboardShortcuts
            isOpen={showKeyboardShortcuts}
            onClose={() => setShowKeyboardShortcuts(false)}
          />
          
          {/* Feedback Collector - REMOVED: To be repositioned later */}
          {/* <FeedbackCollector trigger="manual" /> */}
          
          {/* Daily Use Tracker - REMOVED: To be repositioned later */}
          {/* <DailyUseTracker /> */}
          
          {/* Debug Overlay - Development Only - REMOVED: To be repositioned later */}
          {/* <DebugOverlay /> */}
          </Layout>
        )}
      </div>
    </TacticalErrorBoundary>
  )
}

/* 🚀 PART 10: PERFORMANCE MONITORING */
// Add performance monitoring in development
if (import.meta.env.DEV) {
  // Log render performance
  const logPerformance = () => {
    performance.getEntriesByType('navigation')[0]
    // Performance metrics available via navigation timing API
  }
  
  if (document.readyState === 'complete') {
    logPerformance()
  } else {
    window.addEventListener('load', logPerformance)
  }
}

/* 🎮 PART 11: GLOBAL STYLES FOR TACTICAL EFFECTS */
// Inject critical styles
if (typeof document !== 'undefined' && !document.getElementById('tactical-app-styles')) {
  const style = document.createElement('style')
  style.id = 'tactical-app-styles'
  style.innerHTML = `
    @keyframes tacticalShake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      10% { transform: translate(-10px, -5px) rotate(-1deg); }
      20% { transform: translate(10px, -5px) rotate(1deg); }
      30% { transform: translate(-10px, 5px) rotate(-1deg); }
      40% { transform: translate(10px, 5px) rotate(1deg); }
      50% { transform: translate(-5px, -2px) rotate(-0.5deg); }
      60% { transform: translate(5px, -2px) rotate(0.5deg); }
      70% { transform: translate(-5px, 2px) rotate(-0.5deg); }
      80% { transform: translate(5px, 2px) rotate(0.5deg); }
      90% { transform: translate(-2px, -1px) rotate(0deg); }
    }
    
    /* Prevent text selection during animations */
    .punishment-notification {
      user-select: none;
      -webkit-user-select: none;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .punishment-notification {
        border-width: 4px !important;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `
  document.head.appendChild(style)
}

export default App

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 END OF App.jsx - TACTICAL COMMAND CENTER V2.0                             │
// │ What's New:                                                                  │
// │ - Complete PunishmentOverlay with military-grade visuals                    │
// │ - Developer Command Center for testing (dev mode only)                      │
// │ - Tactical boot sequence on startup                                         │
// │ - Error boundaries with proper recovery                                      │
// │ - Connection status monitoring                                              │
// │ - Enhanced settings with danger zone                                        │
// │ - Performance monitoring in development                                      │
// │ - Proper punishment event handling                                          │
// │ - Suspense boundaries for future code splitting                             │
// │ - Global tactical animations                                                │
// │ Total: 1200+ lines of military-grade application architecture              │
// │ 📁 SAVE THIS FILE AS: src/App.jsx (REPLACE EXISTING)                        │
// ╰──────────────────────────────────────────────────────────────────────────────╯Y