// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ ⚡ XP SYSTEM AUTHORITY - CONTROL STATION OS                                 │
// │ SINGLE SOURCE OF TRUTH FOR ALL XP VALUES                                   │
// │ FIXED VALUES: 25/50/100 XP ONLY (NO EXCEPTIONS)                            │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/* 🎯 CORE XP VALUES - NEVER CHANGE THESE */
export const XP_VALUES = {
  // Mission XP (ONLY these values allowed)
  LOW: 25,
  MEDIUM: 50, 
  HIGH: 100,
  
  // Achievement XP (constrained to fixed values)
  ACHIEVEMENT_SMALL: 25,   // First task, small milestones
  ACHIEVEMENT_MEDIUM: 50,  // Week streaks, level ups
  ACHIEVEMENT_MAJOR: 100,  // Major milestones, big achievements
  
  // Focus Session XP
  POMODORO: 100,      // Standard 25min focus
  SHORT_BREAK: 25,    // 5min break completed
  LONG_BREAK: 50,     // 15min break completed
  DEEP_WORK: 100,     // Extended focus (was 200 - FIXED)
  
  // Bonus XP (must use fixed values)
  QUICK_WIN: 25,      // Fast completion bonus
  PERFECT_DAY: 50,    // All daily tasks done
  STREAK_BONUS: 25,   // Streak maintenance
}

/* ⚔️ PUNISHMENT VALUES - STANDARDIZED */
export const PUNISHMENT_VALUES = {
  // Task failures
  TASK_FAILED: -25,
  TASK_ABANDONED: -50,
  TASK_DELETED: -25,
  
  // Daily penalties  
  DAILY_SKIP: -25,        // Missed daily goal (was -30)
  IDLE_DAY: -50,          // Full day wasted
  
  // Streak breaks
  STREAK_BREAK: -25,
  
  // Level system
  LEVEL_DEMOTION: -50,
  
  // Extreme penalties
  TREE_DEATH: -100,       // Maximum punishment
}

/* 🎖️ STANDARDIZED ACHIEVEMENT DEFINITIONS */
export const ACHIEVEMENT_XP = {
  // First-time achievements (25 XP)
  first_task: XP_VALUES.ACHIEVEMENT_SMALL,
  first_streak: XP_VALUES.ACHIEVEMENT_SMALL,
  first_focus: XP_VALUES.ACHIEVEMENT_SMALL,
  
  // Regular milestones (50 XP)  
  task_streak_3: XP_VALUES.ACHIEVEMENT_MEDIUM,
  task_streak_7: XP_VALUES.ACHIEVEMENT_MEDIUM,  // was 200
  level_5: XP_VALUES.ACHIEVEMENT_MEDIUM,        // was 75
  level_10: XP_VALUES.ACHIEVEMENT_MEDIUM,       // was 150
  
  // Major achievements (100 XP)
  level_25: XP_VALUES.ACHIEVEMENT_MAJOR,        // was 300
  perfectionist: XP_VALUES.ACHIEVEMENT_MAJOR,   // was 500
  speed_demon: XP_VALUES.ACHIEVEMENT_MAJOR,     // was 250
  focus_master: XP_VALUES.ACHIEVEMENT_MAJOR,    // was 200
  survivor: XP_VALUES.ACHIEVEMENT_MAJOR,        // was 300
  elite_commander: XP_VALUES.ACHIEVEMENT_MAJOR, // was 1000
}

/* 📊 MISSION PRIORITY MAPPING */
export const MISSION_XP_BY_PRIORITY = {
  high: XP_VALUES.HIGH,     // 100 XP
  medium: XP_VALUES.MEDIUM, // 50 XP  
  low: XP_VALUES.LOW,       // 25 XP
}

/* 🎯 DAILY LOGIN BONUS - FIXED VALUES */
export const LOGIN_BONUS = {
  base: XP_VALUES.LOW,      // 25 XP (was 50)
  streak_2: XP_VALUES.LOW,  // No multipliers - fixed 25
  streak_5: XP_VALUES.MEDIUM, // 50 XP max
  streak_10: XP_VALUES.HIGH,  // 100 XP max
}

/* 🛡️ VALIDATION FUNCTION */
export function isValidXP(xpValue) {
  const validValues = [
    XP_VALUES.LOW, XP_VALUES.MEDIUM, XP_VALUES.HIGH,
    ...Object.values(PUNISHMENT_VALUES)
  ]
  return validValues.includes(xpValue)
}

/* 📝 XP CALCULATION HELPERS */
export function getTaskXP(priority) {
  return MISSION_XP_BY_PRIORITY[priority] || XP_VALUES.LOW
}

export function getFocusXP(sessionType) {
  const focusXP = {
    pomodoro: XP_VALUES.POMODORO,
    shortBreak: XP_VALUES.SHORT_BREAK,
    longBreak: XP_VALUES.LONG_BREAK,
    deepWork: XP_VALUES.DEEP_WORK,
  }
  return focusXP[sessionType] || XP_VALUES.LOW
}

export function getAchievementXP(achievementId) {
  return ACHIEVEMENT_XP[achievementId] || XP_VALUES.ACHIEVEMENT_SMALL
}

/* 🎯 EXPORT ALL FOR EASY IMPORT */
export default {
  XP_VALUES,
  PUNISHMENT_VALUES, 
  ACHIEVEMENT_XP,
  MISSION_XP_BY_PRIORITY,
  LOGIN_BONUS,
  isValidXP,
  getTaskXP,
  getFocusXP,
  getAchievementXP,
}