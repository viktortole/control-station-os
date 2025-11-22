// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 💀 PUNISHMENTSYSTEM.JS - CONTROL STATION OS V2.0 TACTICAL UPGRADE            │
// │ Military-Grade Discipline Engine with Enhanced Punishment Mechanics          │
// │ Now with Mission Failure reporting and proper consequences                   │
// │ 📁 FILE: src/core/game/PunishmentSystem.js                                   │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🏁 PART 1: TACTICAL PUNISHMENT CONFIGURATION */
export const PUNISHMENT_CONFIG = {
  // XP Losses (Standardized to 25/50/100 rule)
  losses: {
    mission_failed: -25,     // Reporting mission failure (honorable)
    mission_abandoned: -50,  // Abandoning without reporting (cowardice) 
    daily_skip: -25,         // Standardized to -25
    idle_day: -50,          // Full day of inactivity
    streak_break: -25,       // Streak maintenance failure
    level_demotion: -50,     // Additional shame for demotion
    tree_death: -100,        // Letting tree die completely (max punishment)
  },
  
  // Demotion Rules
  demotion: {
    enabled: true,
    threshold: (level) => Math.pow(level - 1, 2) * 100,
    graceAmount: 10, // NEW: Small buffer before demotion
    messages: [
      "DEMOTED TO LEVEL {level}. Disappointing.",
      "RANK REDUCTION: LEVEL {level}. Pathetic.",
      "TACTICAL FAILURE. LEVEL {level}. Do better.",
      "DEMOTION CONFIRMED. LEVEL {level}. Weak.",
    ],
    effects: ['screen_flash', 'alarm_sound', 'tree_damage', 'shake_interface'],
  },
  
  // Tree Health System (Rebalanced)
  treeHealth: {
    healthy: { 
      minXP: 50,    // Reduced from 100
      streak: 2,    // Reduced from 3
      message: "Thriving", 
      warning: "Maintain discipline to keep tree healthy" 
    },
    warning: { 
      minXP: 0, 
      streak: 0, 
      message: "Needs attention", 
      warning: "Complete missions to prevent deterioration" 
    },
    dying: { 
      minXP: -25,   // Reduced from -50
      streak: 0, 
      message: "DYING - Act now!", 
      warning: "CRITICAL: Immediate action required or face -100 XP penalty" 
    },
  },
  
  // Punishment Feedback (Enhanced)
  feedback: {
    visualFlashDuration: 600,
    screenShakeDuration: 400,
    audioEnabled: true,
    shakeIntensity: 15,
    notificationDuration: 4000,
    cascadeDelay: 100, // NEW: For multiple punishments
  },
  
  // Idle Tracking (More reasonable)
  idle: {
    warningMinutes: 30,      // Warning after 30 min
    punishmentMinutes: 60,   // Punish after 1 hour
    severePunishmentHours: 8, // Severe punishment after 8 hours
    maxDailyIdlePunishments: 5, // Cap daily idle punishments
  }
}

/* 🎯 PART 2: ENHANCED PUNISHMENT ENGINE CLASS */
export class PunishmentEngine {
  constructor(store) {
    this.store = store
    this.lastActivity = Date.now()
    this.idleCheckInterval = null
    this.punishmentQueue = []
    this.isProcessingPunishment = false
    this.dailyIdlePunishments = 0
    this.lastIdleReset = new Date().toDateString()
    this.soundCache = new Map()
    
    this.initializeSystem()

      // Track first user interaction to unlock audio
      const gestureHandler = () => {
        this.hasUserGesture = true
        window.removeEventListener('click', gestureHandler)
        window.removeEventListener('keydown', gestureHandler)
      }
      window.addEventListener('click', gestureHandler, { once: true })
      window.addEventListener('keydown', gestureHandler, { once: true })
  }
  
  /* 🚀 PART 3: SYSTEM INITIALIZATION - NON-BLOCKING */
  initializeSystem() {
    // Only initialize non-blocking systems immediately
    this.initializeStyles()
    this.setupCommanderWarnings()
    
    // Defer blocking operations until after first user interaction
    this.deferredInitialization()
  }
  
  // Defer expensive operations to prevent blocking startup
  deferredInitialization() {
    // Initialize on next tick to prevent blocking
    setTimeout(() => {
      this.initializeIdleTracking()
    }, 0)
    
    // Initialize sounds on first user interaction to comply with browser policies
    const initializeSoundsOnInteraction = () => {
      this.initializeSounds()
      document.removeEventListener('click', initializeSoundsOnInteraction)
      document.removeEventListener('keydown', initializeSoundsOnInteraction)
    }
    
    // Only add listeners if document is ready
    if (typeof document !== 'undefined') {
      document.addEventListener('click', initializeSoundsOnInteraction, { once: true })
      document.addEventListener('keydown', initializeSoundsOnInteraction, { once: true })
    }
  }
  
  /* 💀 PART 4: CORE PUNISHMENT METHODS - ENHANCED */
  
  // Main punishment method with queue system
  async punish(amount, reason, options = {}) {
    const punishment = {
      amount: Math.abs(amount) * -1, // Ensure negative
      reason,
      timestamp: Date.now(),
      type: options.type || 'standard',
      silent: options.silent || false,
    }
    
    // Add to queue for cascade effect
    this.punishmentQueue.push(punishment)
    
    // Process queue if not already processing
    if (!this.isProcessingPunishment) {
      await this.processPunishmentQueue()
    }
    
    return this.getLastPunishmentResult()
  }
  
  // Process punishment queue with cascade effects
  async processPunishmentQueue() {
    this.isProcessingPunishment = true
    
    while (this.punishmentQueue.length > 0) {
      const punishment = this.punishmentQueue.shift()
      await this.executePunishment(punishment)
      
      // Cascade delay for multiple punishments
      if (this.punishmentQueue.length > 0) {
        await this.delay(PUNISHMENT_CONFIG.feedback.cascadeDelay)
      }
    }
    
    this.isProcessingPunishment = false
  }
  
  // Execute single punishment
  async executePunishment(punishment) {
    const state = this.store.getState()
    const currentXP = state.totalXP
    const currentLevel = state.level
    
    // Calculate new XP
    const newXP = currentXP + punishment.amount
    
    // Update XP and track punishment
    this.store.setState({ 
      totalXP: newXP,
      todayXP: state.todayXP + punishment.amount,
      totalPunishments: (state.totalPunishments || 0) + 1,
      lastPunishmentTime: punishment.timestamp,
      stats: {
        ...state.stats,
        totalXPLost: (state.stats.totalXPLost || 0) + Math.abs(punishment.amount)
      }
    })
    
    // Check for level demotion
    const demotionResult = await this.checkDemotion(newXP, currentLevel)
    
    // Trigger feedback (unless silent)
    if (!punishment.silent) {
      await this.triggerPunishmentFeedback(punishment, demotionResult)
    }
    
    // Update tree health
    this.updateTreeHealth()
    
    // Log punishment
    this.logPunishment(punishment, demotionResult)
    
    // Store last result
    this.lastPunishmentResult = {
      xpLost: Math.abs(punishment.amount),
      newTotalXP: newXP,
      demoted: demotionResult.demoted,
      newLevel: demotionResult.newLevel,
      treeHealth: this.getTreeHealth(),
      reason: punishment.reason,
    }
    
    // Emit punishment event
    this.emitPunishmentEvent(this.lastPunishmentResult)
  }
  
  // Enhanced demotion check with grace period
  async checkDemotion(currentXP, currentLevel) {
    if (currentLevel <= 1) return { demoted: false, newLevel: currentLevel }
    
    const previousLevelThreshold = PUNISHMENT_CONFIG.demotion.threshold(currentLevel)
    const graceThreshold = previousLevelThreshold - PUNISHMENT_CONFIG.demotion.graceAmount
    
    if (currentXP < graceThreshold) {
      // DEMOTION TRIGGERED!
      const newLevel = Math.max(1, currentLevel - 1)
      const message = this.getRandomDemotionMessage(newLevel)
      
      // Apply demotion with additional punishment
      this.store.setState({ 
        level: newLevel,
        totalXP: currentXP + PUNISHMENT_CONFIG.losses.level_demotion,
        totalDemotions: (this.store.getState().totalDemotions || 0) + 1,
      })
      
      // Special effects for demotion
      await this.triggerDemotionEffects()
      
      return { 
        demoted: true, 
        newLevel,
        message,
        previousLevel: currentLevel
      }
    }
    
    return { demoted: false, newLevel: currentLevel }
  }
  
  /* 🎯 PART 5: MISSION FAILURE SYSTEM - NEW */
  
  // Report mission failure (honorable defeat)
  async reportMissionFailure(task) {
    const reason = `Mission Failed: ${task.title}`
    const xpLoss = task.priority === 'high' 
      ? PUNISHMENT_CONFIG.losses.mission_failed * 1.5 
      : PUNISHMENT_CONFIG.losses.mission_failed
      
    return this.punish(xpLoss, reason, { type: 'mission_failure' })
  }
  
  // Abandon mission (cowardice)
  async abandonMission(task) {
    const reason = `Mission Abandoned: ${task.title}`
    const xpLoss = task.priority === 'high'
      ? PUNISHMENT_CONFIG.losses.mission_abandoned * 2
      : PUNISHMENT_CONFIG.losses.mission_abandoned
      
    return this.punish(xpLoss, reason, { type: 'mission_abandoned' })
  }
  
  /* 💀 PART 5B: MISSING PUNISHMENT METHODS */
  
  // Daily skip punishment 
  async punishDailySkip() {
    const reason = "Daily goal skipped"
    return this.punish(PUNISHMENT_CONFIG.losses.daily_skip, reason, { type: 'daily_skip' })
  }
  
  // Streak break punishment
  async punishStreakBreak(streak) {
    const reason = `${streak}-day streak broken`
    return this.punish(PUNISHMENT_CONFIG.losses.streak_break, reason, { type: 'streak_break' })
  }
  
  /* 🌳 PART 6: ENHANCED TREE HEALTH SYSTEM */
  
  getTreeHealth() {
    const state = this.store.getState()
    const { todayXP, streak } = state
    const { treeHealth } = PUNISHMENT_CONFIG
    
    // Check if tree has been dying too long
    const lastHealthCheck = state.lastTreeHealthCheck || Date.now()
    const hoursDying = state.treeHealth === 'dying' 
      ? (Date.now() - lastHealthCheck) / (1000 * 60 * 60)
      : 0
      
    // Auto-punish if tree dying for too long
    if (hoursDying > 4 && !state.treeDyingPunished) {
      this.punish(PUNISHMENT_CONFIG.losses.tree_death, "Tree death from neglect", { 
        type: 'tree_death',
        silent: false 
      })
      this.store.setState({ treeDyingPunished: true })
    }
    
    // FIXED tree health logic - proper hierarchy based on XP thresholds
    // healthy.minXP: 50, warning.minXP: 0, dying.minXP: -25
    if (todayXP >= treeHealth.healthy.minXP && streak >= treeHealth.healthy.streak) {
      // >= 50 XP AND >= 2 streak = healthy
      return 'healthy'
    } else if (todayXP >= treeHealth.warning.minXP) {
      // >= 0 XP but < 50 XP or < 2 streak = warning
      return 'warning'
    } else {
      // < 0 XP (negative) = dying
      return 'dying'
    }
  }
  
  updateTreeHealth() {
    const health = this.getTreeHealth()
    const previousHealth = this.store.getState().treeHealth
    
    this.store.setState({ 
      treeHealth: health,
      lastTreeHealthCheck: Date.now(),
      treeDyingPunished: health !== 'dying' ? false : this.store.getState().treeDyingPunished
    })
    
    // Announce health changes (but avoid spam during positive actions)
    if (previousHealth !== health) {
      // Don't announce improvements immediately after XP gains to avoid conflicting with mission success
      const isImprovement = (
        (previousHealth === 'dying' && health === 'warning') ||
        (previousHealth === 'dying' && health === 'healthy') ||
        (previousHealth === 'warning' && health === 'healthy')
      )
      
      if (isImprovement) {
        // Delay improvement announcements so they don't interfere with mission completion feedback
        setTimeout(() => {
          this.announceTreeHealthChange(previousHealth, health)
        }, 2000)
      } else {
        // Announce declines immediately (punishment feedback)
        this.announceTreeHealthChange(previousHealth, health)
      }
    }
  }
  
  /* 🚨 PART 7: ENHANCED PUNISHMENT FEEDBACK */
  
  async triggerPunishmentFeedback(punishment, demotionResult) {
    const { feedback } = PUNISHMENT_CONFIG
    
    // Create promise array for parallel effects
    const effects = []
    
    // Visual effects
    effects.push(this.flashScreen(punishment.type))
    effects.push(this.shakeScreen(feedback.shakeIntensity))
    
    // Audio effects
    if (feedback.audioEnabled && this.store.getState().settings.soundEnabled) {
      effects.push(this.playPunishmentSound(
        demotionResult.demoted ? 'demotion' : punishment.type
      ))
    }
    
    // Show notification
    effects.push(this.showPunishmentNotification(punishment, demotionResult))
    
    // Execute all effects in parallel
    await Promise.all(effects)
  }
  
  // Enhanced screen flash with types
  async flashScreen(type = 'standard') {
    const colors = {
      standard: 'rgba(239, 68, 68, 0.3)',
      mission_failure: 'rgba(255, 170, 0, 0.4)',
      mission_abandoned: 'rgba(220, 38, 38, 0.5)',
      tree_death: 'rgba(139, 0, 0, 0.6)',
      demotion: 'rgba(255, 0, 0, 0.7)',
    }
    
    const flash = document.createElement('div')
    flash.className = 'punishment-flash'
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: ${colors[type] || colors.standard};
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: multiply;
    `
    
    document.body.appendChild(flash)
    
    // Animate flash
    await this.animateElement(flash, [
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: PUNISHMENT_CONFIG.feedback.visualFlashDuration,
      easing: 'ease-out'
    })
    
    document.body.removeChild(flash)
  }
  
  // Enhanced screen shake
  async shakeScreen(intensity) {
    const keyframes = [
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: `translate(-${intensity}px, -${intensity/2}px) rotate(-1deg)` },
      { transform: `translate(${intensity}px, -${intensity/2}px) rotate(1deg)` },
      { transform: `translate(-${intensity/2}px, ${intensity}px) rotate(0deg)` },
      { transform: `translate(${intensity/2}px, ${intensity}px) rotate(-1deg)` },
      { transform: 'translate(0, 0) rotate(0deg)' }
    ]
    
    await this.animateElement(document.body, keyframes, {
      duration: PUNISHMENT_CONFIG.feedback.screenShakeDuration,
      easing: 'ease-out'
    })
  }
  
  // Enhanced audio system
  async playPunishmentSound(type) {
      if (!this.hasUserGesture) {
        return null
      }
    const soundMap = {
      standard: '/sounds/punishment.mp3',
      mission_failure: '/sounds/mission-failed.mp3',
      mission_abandoned: '/sounds/abandon.mp3',
      demotion: '/sounds/demotion.mp3',
      tree_death: '/sounds/critical.mp3',
      warning: '/sounds/warning.mp3',
      alarm: '/sounds/alarm.mp3'
    }
    
    const soundUrl = soundMap[type] || soundMap.standard
    
    try {
      // Use cached audio or create new
      let audio = this.soundCache.get(soundUrl)
      if (!audio) {
        audio = new Audio(soundUrl)
        audio.volume = 0.6
        this.soundCache.set(soundUrl, audio)
      }
      
      // Clone for overlapping sounds
      const audioClone = audio.cloneNode()
      audioClone.volume = 0.6
      await audioClone.play()
    } catch (error) {
      console.warn('Punishment sound failed:', error)
    }
  }
  
  // TACTICAL punishment notification
  async showPunishmentNotification(punishment, demotionResult) {
    const notification = document.createElement('div')
    notification.className = 'punishment-notification'
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10001;
      pointer-events: none;
    `
    
    // Determine severity and styling
    const severity = demotionResult.demoted ? 'critical' : 
                    punishment.type === 'tree_death' ? 'severe' :
                    punishment.type === 'mission_abandoned' ? 'high' : 'standard'
    
    const icons = {
      critical: '💀',
      severe: '☠️',
      high: '⚠️',
      standard: '❌'
    }
    
    notification.innerHTML = `
      <div class="punishment-notification-inner ${severity}" style="
        background: rgba(0, 0, 0, 0.95);
        border: 3px solid ${severity === 'critical' ? '#DC2626' : '#EF4444'};
        border-radius: 1rem;
        padding: 2rem 3rem;
        min-width: 400px;
        box-shadow: 0 0 100px rgba(239, 68, 68, 0.5), inset 0 0 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
      ">
        <!-- Status Lights -->
        <div style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #EF4444;
            animation: blink 0.5s infinite;
          "></div>
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #F59E0B;
            animation: blink 0.5s infinite;
            animation-delay: 0.1s;
          "></div>
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10B981;
            animation: blink 0.5s infinite;
            animation-delay: 0.2s;
          "></div>
        </div>
        
        <!-- Icon -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="
            font-size: 4rem;
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
            animation: pulse 1s ease-in-out infinite;
          ">
            ${icons[severity]}
          </div>
        </div>
        
        <!-- XP Loss Display -->
        <div style="
          text-align: center;
          margin-bottom: 1rem;
        ">
          <div style="
            font-size: 3rem;
            font-weight: 900;
            color: #EF4444;
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
            font-family: monospace;
            letter-spacing: 2px;
          ">
            -${Math.abs(punishment.amount)} XP
          </div>
        </div>
        
        <!-- Reason -->
        <div style="
          text-align: center;
          color: #FFF;
          font-size: 1.125rem;
          margin-bottom: 1rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        ">
          ${punishment.reason}
        </div>
        
        <!-- Demotion Alert -->
        ${demotionResult.demoted ? `
          <div style="
            background: linear-gradient(45deg, #7F1D1D, #991B1B);
            color: #FFF;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1.5rem;
            border: 2px solid #DC2626;
            text-align: center;
            animation: shake 0.5s ease-in-out;
          ">
            <div style="
              font-weight: 900;
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 2px;
            ">
              ${demotionResult.message}
            </div>
            <div style="
              font-size: 0.875rem;
              opacity: 0.8;
            ">
              Previous Level: ${demotionResult.previousLevel} → Current Level: ${demotionResult.newLevel}
            </div>
          </div>
        ` : ''}
        
        <!-- Insult -->
        <div style="
          text-align: center;
          color: #EF4444;
          font-size: 0.875rem;
          margin-top: 1.5rem;
          font-style: italic;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 3px;
        ">
          ${this.getContextualInsult(punishment.type)}
        </div>
        
        <!-- Progress Bar -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(239, 68, 68, 0.2);
        ">
          <div style="
            height: 100%;
            background: linear-gradient(90deg, #EF4444, #DC2626);
            animation: shrink ${PUNISHMENT_CONFIG.feedback.notificationDuration}ms linear forwards;
          "></div>
        </div>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    await this.animateElement(notification, [
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8) rotateX(90deg)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1) rotateX(0deg)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1) rotateX(0deg)' }
    ], {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    })
    
    // Wait and remove
    await this.delay(PUNISHMENT_CONFIG.feedback.notificationDuration)
    
    // Animate out
    await this.animateElement(notification, [
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' }
    ], {
      duration: 300,
      easing: 'ease-in'
    })
    
    document.body.removeChild(notification)
  }
  
  /* ⏰ PART 8: SMARTER IDLE TRACKING */
  
  initializeIdleTracking() {
    if (typeof window === 'undefined') return // Skip in server environments
    
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    // Throttled activity tracking to prevent excessive event handling
    let activityThrottle = null
    const trackActivity = () => {
      if (activityThrottle) return
      activityThrottle = setTimeout(() => {
        this.lastActivity = Date.now()
        this.resetIdleWarning()
        activityThrottle = null
      }, 1000) // Throttle to once per second
    }
    
    // Track activity with passive listeners for better performance
    activityEvents.forEach(event => {
      window.addEventListener(event, trackActivity, { passive: true })
    })
    
    // Check for idle every 2 minutes (reduced frequency)
    this.idleCheckInterval = setInterval(() => {
      this.checkIdlePunishment()
    }, 120000)
    
    // Check for daily reset every 30 minutes (reduced frequency)
    setInterval(() => {
      const today = new Date().toDateString()
      if (today !== this.lastIdleReset) {
        this.dailyIdlePunishments = 0
        this.lastIdleReset = today
      }
    }, 1800000) // Check every 30 minutes
    
    console.log('⏱️ Idle tracking system initialized (optimized)')
  }
  
  checkIdlePunishment() {
    // Skip if punishments disabled or capped
    if (!this.store.getState().settings.punishmentEnabled) return
    if (this.dailyIdlePunishments >= PUNISHMENT_CONFIG.idle.maxDailyIdlePunishments) return
    
    const now = Date.now()
    const idleMinutes = (now - this.lastActivity) / 60000
    const { idle } = PUNISHMENT_CONFIG
    
    // Warning phase
    if (idleMinutes >= idle.warningMinutes && idleMinutes < idle.punishmentMinutes) {
      this.showIdleWarning(idle.punishmentMinutes - idleMinutes)
      return
    }
    
    // Punishment phase
    if (idleMinutes >= idle.punishmentMinutes) {
      const idleHours = Math.floor(idleMinutes / 60)
      const punishment = idleHours >= idle.severePunishmentHours
        ? PUNISHMENT_CONFIG.losses.idle_day
        : PUNISHMENT_CONFIG.losses.idle_hour * idleHours
        
      this.punish(punishment, `Idle for ${idleHours} hour${idleHours > 1 ? 's' : ''}`, {
        type: 'idle'
      })
      
      this.lastActivity = now
      this.dailyIdlePunishments++
    }
  }
  
  /* 🎖️ PART 9: COMMANDER FEATURES */
  
  setupCommanderWarnings() {
    // Tree health warnings
    setInterval(() => {
      const health = this.store.getState().treeHealth
      if (health === 'dying') {
        this.showCommanderWarning("TREE CRITICAL - IMMEDIATE ACTION REQUIRED")
      }
    }, 300000) // Every 5 minutes
  }
  
  showCommanderWarning(message) {
    const warning = document.createElement('div')
    warning.className = 'commander-warning'
    warning.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: rgba(220, 38, 38, 0.95);
      border: 2px solid #EF4444;
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      color: white;
      font-weight: 900;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
      z-index: 9999;
      animation: slideInRight 0.3s ease-out;
    `
    
    warning.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="font-size: 1.5rem;">⚠️</div>
        <div>${message}</div>
      </div>
    `
    
    document.body.appendChild(warning)
    
    setTimeout(() => {
      warning.style.animation = 'slideOutRight 0.3s ease-in forwards'
      setTimeout(() => document.body.removeChild(warning), 300)
    }, 5000)
  }
  
  /* 💬 PART 10: CONTEXTUAL INSULTS */
  
  getContextualInsult(type) {
    const insults = {
      standard: [
        "Pathetic.",
        "Weakness detected.",
        "Unacceptable performance.",
        "Discipline lacking.",
      ],
      mission_failure: [
        "Mission failure noted in permanent record.",
        "Tactical incompetence confirmed.",
        "Objectives not achieved. Disappointing.",
        "Failure is not an option. Yet here we are.",
      ],
      mission_abandoned: [
        "Cowardice logged.",
        "Abandonment is defeat.",
        "No honor in retreat.",
        "Quitters never win.",
      ],
      idle: [
        "Motion is life. You chose death.",
        "Inactivity breeds weakness.",
        "Time wasted is life wasted.",
        "The enemy never rests. Why do you?",
      ],
      demotion: [
        "Rank reduction deserved.",
        "Leadership material? Hardly.",
        "Demoted but not surprised.",
        "Maybe try harder next time.",
      ],
      tree_death: [
        "You killed your only friend.",
        "Even plants deserve better.",
        "Neglect has consequences.",
        "The tree died. Like your ambition.",
      ]
    }
    
    const pool = insults[type] || insults.standard
    return pool[Math.floor(Math.random() * pool.length)]
  }
  
  getRandomDemotionMessage(level) {
    const messages = PUNISHMENT_CONFIG.demotion.messages
    const template = messages[Math.floor(Math.random() * messages.length)]
    return template.replace('{level}', level)
  }
  
  /* 🛠️ PART 11: UTILITY METHODS */
  
  async animateElement(element, keyframes, options) {
    return new Promise(resolve => {
      const animation = element.animate(keyframes, options)
      animation.onfinish = resolve
    })
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  getLastPunishmentResult() {
    return this.lastPunishmentResult || null
  }
  
  emitPunishmentEvent(result) {
    window.dispatchEvent(new CustomEvent('punishment', { 
      detail: result,
      bubbles: true 
    }))
  }
  
  resetIdleWarning() {
    // Remove any existing idle warnings
    document.querySelectorAll('.idle-warning').forEach(el => el.remove())
  }
  
  showIdleWarning(minutesRemaining) {
    this.resetIdleWarning()
    
    const warning = document.createElement('div')
    warning.className = 'idle-warning'
    warning.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(245, 158, 11, 0.95);
      border: 2px solid #F59E0B;
      border-radius: 0.5rem;
      padding: 1rem;
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
      z-index: 9998;
      animation: pulse 2s ease-in-out infinite;
    `
    
    warning.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="animation: spin 2s linear infinite;">⏰</div>
        <div>IDLE WARNING: ${Math.round(minutesRemaining)} minutes until punishment</div>
      </div>
    `
    
    document.body.appendChild(warning)
  }
  
  announceTreeHealthChange(oldHealth, newHealth) {
    // Only announce NEGATIVE changes to avoid spamming positive actions
    const negativeMessages = {
      'healthy-warning': "Tree health declining - needs attention",
      'healthy-dying': "CRITICAL: Tree health critical - act immediately", 
      'warning-dying': "WARNING: Tree entering critical state"
    }
    
    // Only announce POSITIVE changes when tree was in bad state
    const positiveMessages = {
      'warning-healthy': "Tree health restored - well done",
      'dying-warning': "Tree stabilizing but still needs care", 
      'dying-healthy': "Excellent recovery - tree fully restored"
    }
    
    const key = `${oldHealth}-${newHealth}`
    
    // Show negative changes immediately (punishment feedback)
    if (negativeMessages[key]) {
      this.showCommanderWarning(negativeMessages[key])
    }
    
    // Show positive changes only for recovery (not on mission completion)
    // This prevents "declining" messages when user completes missions
    if (positiveMessages[key] && (oldHealth === 'dying' || oldHealth === 'warning')) {
      // Delay positive message to not interfere with mission completion feedback
      setTimeout(() => {
        this.showCommanderWarning(positiveMessages[key])
      }, 1500)
    }
  }
  
  /* 🎨 PART 12: INITIALIZE STYLES */
  
  initializeStyles() {
    if (document.getElementById('punishment-system-styles')) return
    
    const styles = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-10px) rotate(-1deg); }
        20% { transform: translateX(10px) rotate(1deg); }
        30% { transform: translateX(-10px) rotate(-1deg); }
        40% { transform: translateX(10px) rotate(1deg); }
        50% { transform: translateX(-5px) rotate(-0.5deg); }
        60% { transform: translateX(5px) rotate(0.5deg); }
        70% { transform: translateX(-5px) rotate(-0.5deg); }
        80% { transform: translateX(5px) rotate(0.5deg); }
        90% { transform: translateX(-2px); }
      }
      
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .punishment-flash {
        animation: flashFade 0.6s ease-out forwards;
      }
      
      @keyframes flashFade {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      .commander-warning {
        animation: slideInRight 0.3s ease-out;
      }
      
      .punishment-notification-inner.critical {
        animation: criticalPulse 0.5s ease-in-out 3;
      }
      
      @keyframes criticalPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      /* Idle warning pulse */
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
        }
        50% { 
          transform: scale(1.02); 
          box-shadow: 0 0 40px rgba(245, 158, 11, 0.8);
        }
      }
    `
    
    const styleSheet = document.createElement('style')
    styleSheet.id = 'punishment-system-styles'
    styleSheet.innerHTML = styles
    document.head.appendChild(styleSheet)
  }
  
  // Preload sounds for instant playback
  initializeSounds() {
    const sounds = [
      '/sounds/punishment.mp3',
      '/sounds/mission-failed.mp3',
      '/sounds/abandon.mp3',
      '/sounds/demotion.mp3',
      '/sounds/critical.mp3',
      '/sounds/warning.mp3',
      '/sounds/alarm.mp3'
    ]
    
    // Pre-create Audio objects without attempting to play them
    // This prevents autoplay policy violations and blocking
    sounds.forEach(url => {
      const audio = new Audio()
      audio.volume = 0.6
      audio.preload = 'metadata' // Only load metadata, not full audio
      audio.src = url
      this.soundCache.set(url, audio)
    })
    
    console.log('🔊 Punishment audio system initialized (lazy loading)')
  }
  
  /* 📊 PART 13: ENHANCED PUNISHMENT ANALYTICS */
  
  logPunishment(punishment, demotionResult) {
    const punishments = JSON.parse(localStorage.getItem('punishments') || '[]')
    
    const record = {
      timestamp: punishment.timestamp,
      amount: Math.abs(punishment.amount),
      reason: punishment.reason,
      type: punishment.type,
      demoted: demotionResult.demoted,
      newLevel: demotionResult.newLevel,
      totalXP: this.store.getState().totalXP,
      treeHealth: this.getTreeHealth(),
    }
    
    punishments.push(record)
    
    // Keep last 500 punishments
    if (punishments.length > 500) {
      punishments.splice(0, punishments.length - 500)
    }
    
    localStorage.setItem('punishments', JSON.stringify(punishments))
  }
  
  getPunishmentHistory() {
    return JSON.parse(localStorage.getItem('punishments') || '[]')
  }
  
  getPunishmentStats() {
    const history = this.getPunishmentHistory()
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    
    return {
      total: history.length,
      last24h: history.filter(p => now - p.timestamp < day).length,
      last7d: history.filter(p => now - p.timestamp < 7 * day).length,
      totalXPLost: history.reduce((sum, p) => sum + p.amount, 0),
      demotions: history.filter(p => p.demoted).length,
      byType: history.reduce((acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1
        return acc
      }, {})
    }
  }
  
  /* 🧹 PART 14: CLEANUP */
  
  destroy() {
    if (this.idleCheckInterval) {
      clearInterval(this.idleCheckInterval)
    }
    this.resetIdleWarning()
    this.soundCache.clear()
  }
}

/* 🎯 PART 15: ENHANCED INTEGRATION HELPER */
export function integratePunishmentSystem(store) {
  const engine = new PunishmentEngine(store)
  
  // Add punishment methods to store
  store.setState({
    punishmentEngine: engine,
    
    // Remove the old deleteTask override since they don't want deletion to punish
    
    // Add new task failure methods
    failTask: (taskId) => {
      const task = store.getState().tasks.find(t => t.id === taskId)
      if (task && !task.completed) {
        engine.reportMissionFailure(task)
        
        // Mark task as failed
        store.setState(state => ({
          tasks: state.tasks.map(t => 
            t.id === taskId 
              ? { ...t, failed: true, failedAt: new Date() } 
              : t
          ),
          stats: {
            ...state.stats,
            totalTasksFailed: (state.stats.totalTasksFailed || 0) + 1
          }
        }))
      }
    },
    
    // Add abandon task method (worse than failure)
    abandonTask: (taskId) => {
      const task = store.getState().tasks.find(t => t.id === taskId)
      if (task && !task.completed) {
        engine.abandonMission(task)
        
        // Remove task completely
        store.setState(state => ({
          tasks: state.tasks.filter(t => t.id !== taskId),
          stats: {
            ...state.stats,
            totalTasksAbandoned: (state.stats.totalTasksAbandoned || 0) + 1
          }
        }))
      }
    },
    
    // Manual punishment trigger
    punish: (amount, reason, options) => engine.punish(amount, reason, options),
    
    // Get punishment stats
    getPunishmentStats: () => engine.getPunishmentStats(),
  })
  
  // Calculate and set correct initial tree health
  engine.updateTreeHealth()
  
  return engine
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 💀 END OF PUNISHMENTSYSTEM.JS V2.0 - TACTICAL DISCIPLINE ENGINE              │
// │ What's New:                                                                  │
// │ - Mission failure system (report failure vs abandon)                         │
// │ - Smarter idle tracking with warnings                                        │
// │ - Enhanced notification system with military styling                         │
// │ - Contextual insults based on failure type                                   │
// │ - Sound preloading for instant feedback                                      │
// │ - Tree death punishment after prolonged neglect                              │
// │ - Daily idle punishment cap to prevent spam                                  │
// │ - Commander warnings for critical states                                     │
// │ - Better visual effects with proper animations                               │
// │ - Punishment queue system for cascade effects                                │
// │ Total: 1000+ lines of military-grade discipline                            │
// │ 📁 SAVE THIS FILE AS: src/core/game/PunishmentSystem.js (REPLACE EXISTING)   │
// ╰──────────────────────────────────────────────────────────────────────────────╯