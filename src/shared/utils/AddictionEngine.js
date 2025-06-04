// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧠 ADDICTION ENGINE - PSYCHOLOGICAL WARFARE                                  │
// │ SLOT MACHINE PSYCHOLOGY | VARIABLE REWARDS | DOPAMINE OPTIMIZATION         │
// │ This is what makes Control Station OS irresistible                          │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🎰 PART 1: VARIABLE REWARD SYSTEM (SLOT MACHINE PSYCHOLOGY) */
export class VariableRewardSystem {
  constructor() {
    this.lastRewardTime = 0
    this.streakMultiplier = 1
  }

  // Calculate XP with variable rewards - the core addiction mechanism
  calculateReward(baseXP, taskType = 'standard') {
    const now = Date.now()
    const timeSinceLastReward = now - this.lastRewardTime
    
    let finalXP = baseXP
    let bonusType = null
    let message = null
    let soundEffect = 'standard'
    let visualEffect = 'normal'

    // Base variable reward chances (25% bonus, 10% critical, 2% mega)
    const bonusRoll = Math.random()
    const criticalRoll = Math.random()
    const megaRoll = Math.random()

    // 🎰 MEGA JACKPOT (2% chance) - Maximum dopamine hit
    if (megaRoll < 0.02) {
      finalXP = Math.floor(baseXP * 5)
      bonusType = 'MEGA'
      message = '🌟 MEGA BONUS! 5X XP JACKPOT!'
      soundEffect = 'mega_jackpot'
      visualEffect = 'explosion'
      
    // 💥 CRITICAL HIT (10% chance) - Double XP rush
    } else if (criticalRoll < 0.10) {
      finalXP = Math.floor(baseXP * 2)
      bonusType = 'CRITICAL'
      message = '💥 CRITICAL HIT! Double XP!'
      soundEffect = 'critical_hit'
      visualEffect = 'shockwave'
      
    // ✨ BONUS (25% chance) - Regular dopamine maintenance  
    } else if (bonusRoll < 0.25) {
      finalXP = Math.floor(baseXP * 1.5)
      bonusType = 'BONUS'
      message = '✨ Bonus XP! +50%'
      soundEffect = 'bonus'
      visualEffect = 'sparkle'
    }

    // 🔥 STREAK MULTIPLIER (builds addiction through consistency)
    if (this.streakMultiplier > 1) {
      finalXP = Math.floor(finalXP * this.streakMultiplier)
      if (bonusType) {
        message += ` (${this.streakMultiplier}x streak!)`
      } else {
        bonusType = 'STREAK'
        message = `🔥 ${this.streakMultiplier}x Streak Bonus!`
      }
    }

    // 🕒 TIME-BASED BONUSES (creates urgency and FOMO)
    const hour = new Date().getHours()
    if (hour >= 6 && hour <= 9) {
      finalXP = Math.floor(finalXP * 1.2)
      message = (message || '') + ' 🌅 Early Bird Bonus!'
      bonusType = bonusType || 'EARLY_BIRD'
    } else if (hour >= 22 || hour <= 5) {
      finalXP = Math.floor(finalXP * 1.3)
      message = (message || '') + ' 🌙 Night Owl Bonus!'
      bonusType = bonusType || 'NIGHT_OWL'
    }

    // 🎯 TASK TYPE MULTIPLIERS
    const taskMultipliers = {
      'health': 1.2,    // Health tasks get bonus (encourages good habits)
      'focus': 1.3,     // Focus tasks get bigger bonus (high value)
      'urgent': 1.5,    // Urgent tasks get large bonus (creates priority)
      'special': 2.0    // Special tasks get huge bonus (rare events)
    }

    if (taskMultipliers[taskType]) {
      finalXP = Math.floor(finalXP * taskMultipliers[taskType])
    }

    this.lastRewardTime = now

    return {
      originalXP: baseXP,
      finalXP: finalXP,
      bonusType,
      message,
      soundEffect,
      visualEffect,
      multiplier: finalXP / baseXP
    }
  }

  // Update streak multiplier (called daily)
  updateStreakMultiplier(currentStreak) {
    if (currentStreak >= 30) this.streakMultiplier = 2.0
    else if (currentStreak >= 14) this.streakMultiplier = 1.8
    else if (currentStreak >= 7) this.streakMultiplier = 1.5
    else if (currentStreak >= 3) this.streakMultiplier = 1.3
    else if (currentStreak >= 1) this.streakMultiplier = 1.2
    else this.streakMultiplier = 1.0
  }
}

/* 📈 PART 2: PROGRESS PRESSURE SYSTEM */
export class ProgressPressureSystem {
  // Calculate psychological pressure based on progress
  static getProgressPressure(currentXP, nextLevelXP) {
    const progress = (currentXP / nextLevelXP) * 100
    
    if (progress >= 95) {
      return {
        level: 'CRITICAL',
        message: 'SO CLOSE! Just a few more XP!',
        color: 'text-yellow-400',
        effect: 'pulse-urgent',
        urgency: 10
      }
    } else if (progress >= 90) {
      return {
        level: 'HIGH',
        message: 'Almost there! Push to the finish!',
        color: 'text-orange-400', 
        effect: 'pulse-medium',
        urgency: 8
      }
    } else if (progress >= 80) {
      return {
        level: 'BUILDING',
        message: 'Keep the momentum going!',
        color: 'text-green-400',
        effect: 'pulse-soft',
        urgency: 6
      }
    }
    
    return null
  }

  // Generate "almost there" motivational messages
  static getMotivationalMessage(progress, xpNeeded) {
    if (progress >= 95) {
      return [
        `Only ${xpNeeded} XP left! Don't stop now!`,
        `You're literally ONE task away from leveling up!`,
        `${xpNeeded} XP = Level up! Do it NOW!`,
        `SO CLOSE! Finish strong, Commander!`
      ][Math.floor(Math.random() * 4)]
    } else if (progress >= 90) {
      return [
        `${xpNeeded} XP to next level. You got this!`,
        `Push through! Level up is within reach!`,
        `${xpNeeded} XP stands between you and victory!`,
        `Don't quit when you're this close!`
      ][Math.floor(Math.random() * 4)]
    } else if (progress >= 80) {
      return [
        `Building momentum! ${xpNeeded} XP to level up`,
        `You're in the final stretch! Keep going!`,
        `${xpNeeded} XP remaining. Stay focused!`,
        `Almost there! Maintain the pressure!`
      ][Math.floor(Math.random() * 4)]
    }
    
    return null
  }
}

/* 🔥 PART 3: STREAK ANXIETY SYSTEM */
export class StreakAnxietySystem {
  // Check if user should feel streak anxiety
  static getStreakStatus(lastActiveDate, currentStreak) {
    const now = new Date()
    const lastActive = new Date(lastActiveDate)
    const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60)
    
    // Daily streak anxiety (creates fear of loss)
    if (hoursSinceActive >= 18 && currentStreak > 0) {
      return {
        status: 'DANGER',
        message: `🔥 ${currentStreak}-day streak at risk! Complete a task before midnight!`,
        urgency: 'HIGH',
        color: 'text-red-400',
        timeRemaining: this.getTimeUntilMidnight()
      }
    } else if (hoursSinceActive >= 12 && currentStreak >= 3) {
      return {
        status: 'WARNING', 
        message: `⚠️ Don't break your ${currentStreak}-day streak! Task needed today.`,
        urgency: 'MEDIUM',
        color: 'text-yellow-400',
        timeRemaining: this.getTimeUntilMidnight()
      }
    } else if (currentStreak >= 7) {
      return {
        status: 'STRONG',
        message: `🔥 ${currentStreak}-day streak! You're unstoppable!`,
        urgency: 'POSITIVE',
        color: 'text-green-400'
      }
    }
    
    return null
  }

  static getTimeUntilMidnight() {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const hours = Math.floor((midnight - now) / (1000 * 60 * 60))
    const minutes = Math.floor(((midnight - now) % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Calculate daily login bonus (positive reinforcement)
  static getDailyBonus(consecutiveDays) {
    const baseBonusXP = 50
    let multiplier = 1
    let bonusMessage = "Daily Login Bonus!"
    
    if (consecutiveDays >= 30) {
      multiplier = 3.0
      bonusMessage = "🏆 30-Day Legend Bonus!"
    } else if (consecutiveDays >= 14) {
      multiplier = 2.5
      bonusMessage = "💎 Two-Week Warrior Bonus!"
    } else if (consecutiveDays >= 7) {
      multiplier = 2.0
      bonusMessage = "⭐ Weekly Champion Bonus!"
    } else if (consecutiveDays >= 3) {
      multiplier = 1.5
      bonusMessage = "🔥 Streak Building Bonus!"
    }
    
    return {
      xp: Math.floor(baseBonusXP * multiplier),
      message: bonusMessage,
      multiplier
    }
  }
}

/* 👥 PART 4: SOCIAL PROOF SYSTEM */
export class SocialProofSystem {
  // Generate convincing fake social activity (creates FOMO)
  static getGlobalActivity() {
    const now = new Date()
    const hour = now.getHours()
    
    // Activity varies by time of day (realistic patterns)
    let baseUsers = 150
    if (hour >= 6 && hour <= 9) baseUsers = 340    // Morning peak
    else if (hour >= 12 && hour <= 14) baseUsers = 280  // Lunch peak  
    else if (hour >= 18 && hour <= 21) baseUsers = 420  // Evening peak
    else if (hour >= 22 || hour <= 5) baseUsers = 80    // Night low
    
    // Add randomness to make it feel real
    const variance = Math.floor(Math.random() * 50) - 25
    const onlineUsers = Math.max(50, baseUsers + variance)
    
    const todayMissions = Math.floor(onlineUsers * (Math.random() * 8 + 4))
    const weeklyXP = Math.floor(onlineUsers * (Math.random() * 5000 + 15000))
    
    return {
      onlineUsers,
      todayMissions,
      weeklyXP,
      topStreak: Math.floor(Math.random() * 30) + 20,
      topCommander: this.generateCommanderName()
    }
  }

  static generateCommanderName() {
    const prefixes = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Ghost', 'Hunter', 'Iron', 'Jade']
    const suffixes = ['Wolf', 'Eagle', 'Tiger', 'Viper', 'Storm', 'Blade', 'Fire', 'Shadow', 'Steel', 'Phoenix']
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`
  }

  // Generate recent activity feed (creates social pressure)
  static getRecentActivity() {
    const activities = [
      { type: 'level_up', user: this.generateCommanderName(), level: Math.floor(Math.random() * 20) + 5 },
      { type: 'mission_complete', user: this.generateCommanderName(), mission: 'Daily Routine' },
      { type: 'streak_milestone', user: this.generateCommanderName(), days: Math.floor(Math.random() * 15) + 7 },
      { type: 'achievement', user: this.generateCommanderName(), achievement: 'First Blood' },
      { type: 'xp_milestone', user: this.generateCommanderName(), xp: (Math.floor(Math.random() * 10) + 1) * 1000 }
    ]
    
    return activities
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(activity => ({
        ...activity,
        timestamp: Date.now() - Math.random() * 300000 // Last 5 minutes
      }))
  }
}

/* ⚡ PART 5: INSTANT GRATIFICATION SYSTEM */
export class InstantGratificationSystem {
  // Generate quick-win tasks for immediate dopamine
  static getQuickWinTasks() {
    const quickTasks = [
      { title: 'Drink a Glass of Water', xp: 25, time: 1, icon: '💧' },
      { title: 'Take 5 Deep Breaths', xp: 25, time: 1, icon: '🫁' },
      { title: 'Stand and Stretch', xp: 25, time: 2, icon: '🧘' },
      { title: 'Smile for 10 Seconds', xp: 25, time: 1, icon: '😊' },
      { title: 'Write Down 1 Thing You\'re Grateful For', xp: 25, time: 2, icon: '🙏' },
      { title: 'Do 10 Push-ups', xp: 25, time: 3, icon: '💪' },
      { title: 'Clean Your Desk for 2 Minutes', xp: 25, time: 2, icon: '🧹' },
      { title: 'Send 1 Positive Message', xp: 25, time: 3, icon: '💬' },
      { title: 'Look Out Window for 30 Seconds', xp: 25, time: 1, icon: '👀' },
      { title: 'Do 10 Jumping Jacks', xp: 25, time: 2, icon: '🏃' }
    ]
    
    // Return 3 random quick tasks
    return quickTasks
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(task => ({
        ...task,
        id: `quick_${Date.now()}_${Math.random()}`,
        priority: 'instant',
        projectId: 'quick-wins',
        missionType: 'instant'
      }))
  }

  // Calculate instant gratification bonus
  static getInstantBonus(completionTime, estimatedTime) {
    if (completionTime <= estimatedTime * 0.5) {
      return {
        bonus: 50,
        message: '⚡ Lightning Speed! +50 XP',
        effect: 'lightning'
      }
    } else if (completionTime <= estimatedTime) {
      return {
        bonus: 25,
        message: '🎯 Perfect Timing! +25 XP',
        effect: 'perfect'
      }
    }
    return null
  }
}

/* 🎵 PART 6: AUDIO FEEDBACK SYSTEM */
export class AudioFeedbackSystem {
  static playRewardSound(rewardType) {
    // For now, use Web Audio API to generate simple tones
    // Later can be replaced with actual sound files
    if (!window.AudioContext && !window.webkitAudioContext) return
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const frequencies = {
      'standard': [440, 554, 659],      // A-C#-E chord
      'bonus': [523, 659, 784],         // C-E-G chord (major)
      'critical': [392, 494, 587],      // G-B-D chord (triumphant)
      'mega': [523, 659, 784, 1047],    // C-E-G-C (octave)
      'punishment': [233, 277, 330],    // Minor chord (ominous)
      'level_up': [523, 659, 784, 1047, 523] // Ascending fanfare
    }
    
    const freq = frequencies[rewardType] || frequencies['standard']
    
    freq.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime + index * 0.1)
      oscillator.stop(audioContext.currentTime + 0.3 + index * 0.1)
    })
  }
}

/* 📊 PART 7: ADDICTION METRICS TRACKER */
export class AddictionMetrics {
  static trackBehavior(action, context = {}) {
    const metrics = JSON.parse(localStorage.getItem('addiction_metrics') || '{}')
    const today = new Date().toDateString()
    
    if (!metrics[today]) {
      metrics[today] = {
        sessions: 0,
        task_completions: 0,
        xp_gains: 0,
        time_spent: 0,
        compulsive_checks: 0,
        streak_checks: 0,
        level_progress_checks: 0
      }
    }
    
    metrics[today][action] = (metrics[today][action] || 0) + 1
    
    // Store additional context
    if (context.xp) metrics[today].xp_gains += context.xp
    if (context.time) metrics[today].time_spent += context.time
    
    localStorage.setItem('addiction_metrics', JSON.stringify(metrics))
    
    // Return addiction score (higher = more addictive behavior)
    return this.calculateAddictionScore(metrics[today])
  }
  
  static calculateAddictionScore(dayMetrics) {
    const {
      sessions = 0,
      task_completions = 0,
      compulsive_checks = 0,
      streak_checks = 0,
      level_progress_checks = 0
    } = dayMetrics
    
    // Higher scores indicate more addictive engagement
    return Math.min(100, 
      (sessions * 5) + 
      (task_completions * 10) + 
      (compulsive_checks * 3) + 
      (streak_checks * 2) + 
      (level_progress_checks * 1)
    )
  }
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🧠 END OF ADDICTION ENGINE - PSYCHOLOGICAL WARFARE                           │
// │ This system implements proven addiction psychology:                          │
// │ • Variable Ratio Rewards (slot machine psychology)                          │ 
// │ • Loss Aversion (streak anxiety)                                            │
// │ • Progress Pressure (almost there psychology)                               │
// │ • Social Proof (fake but convincing activity)                               │
// │ • Instant Gratification (quick dopamine hits)                               │
// │ • Audio Feedback (Pavlovian conditioning)                                   │
// │ • Behavioral Tracking (addiction optimization)                              │
// │ 📁 SAVE AS: src/core/psychology/AddictionEngine.js                          │
// ╰──────────────────────────────────────────────────────────────────────────────╯