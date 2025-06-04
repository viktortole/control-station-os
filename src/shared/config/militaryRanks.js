// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ MILITARY RANK SYSTEM - CONTROL STATION OS                                │
// │ Professional military rank structure with authentic icons and progression   │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import {
  Shield, Star, Crown, Medal, Award, Target, Crosshair,
  Gem, Sparkles, Triangle, Hexagon, Circle, Square
} from 'lucide-react'

/**
 * Military rank progression system
 * Based on combined NATO rank structure
 */
export const MILITARY_RANKS = {
  // Enlisted Ranks (Levels 1-10)
  PRIVATE: {
    level: 1,
    name: 'Private',
    abbreviation: 'PVT',
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    category: 'enlisted',
    description: 'Entry level operator'
  },
  CORPORAL: {
    level: 3,
    name: 'Corporal',
    abbreviation: 'CPL',
    icon: Triangle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    category: 'enlisted',
    description: 'Team leader'
  },
  SERGEANT: {
    level: 5,
    name: 'Sergeant',
    abbreviation: 'SGT',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    category: 'enlisted',
    description: 'Squad supervisor'
  },
  STAFF_SERGEANT: {
    level: 8,
    name: 'Staff Sergeant',
    abbreviation: 'SSG',
    icon: Hexagon,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    category: 'enlisted',
    description: 'Section leader'
  },

  // Non-Commissioned Officers (Levels 10-20)
  SERGEANT_FIRST_CLASS: {
    level: 10,
    name: 'Sergeant First Class',
    abbreviation: 'SFC',
    icon: Target,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    category: 'nco',
    description: 'Platoon sergeant'
  },
  MASTER_SERGEANT: {
    level: 15,
    name: 'Master Sergeant',
    abbreviation: 'MSG',
    icon: Star,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    category: 'nco',
    description: 'Senior NCO'
  },

  // Warrant Officers (Levels 15-25)
  WARRANT_OFFICER: {
    level: 18,
    name: 'Warrant Officer',
    abbreviation: 'WO',
    icon: Crosshair,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    category: 'warrant',
    description: 'Technical specialist'
  },

  // Commissioned Officers (Levels 20+)
  SECOND_LIEUTENANT: {
    level: 20,
    name: 'Second Lieutenant',
    abbreviation: '2LT',
    icon: Square,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    category: 'officer',
    description: 'Junior officer'
  },
  FIRST_LIEUTENANT: {
    level: 25,
    name: 'First Lieutenant',
    abbreviation: '1LT',
    icon: Award,
    color: 'text-blue-300',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400/30',
    category: 'officer',
    description: 'Company grade officer'
  },
  CAPTAIN: {
    level: 30,
    name: 'Captain',
    abbreviation: 'CPT',
    icon: Medal,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    category: 'officer',
    description: 'Company commander'
  },
  MAJOR: {
    level: 40,
    name: 'Major',
    abbreviation: 'MAJ',
    icon: Gem,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    category: 'officer',
    description: 'Field grade officer'
  },
  LIEUTENANT_COLONEL: {
    level: 50,
    name: 'Lieutenant Colonel',
    abbreviation: 'LTC',
    icon: Sparkles,
    color: 'text-purple-300',
    bgColor: 'bg-purple-400/20',
    borderColor: 'border-purple-400/30',
    category: 'officer',
    description: 'Battalion commander'
  },
  COLONEL: {
    level: 75,
    name: 'Colonel',
    abbreviation: 'COL',
    icon: Crown,
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30',
    category: 'officer',
    description: 'Senior officer'
  },
  GENERAL: {
    level: 100,
    name: 'General',
    abbreviation: 'GEN',
    icon: Crown,
    color: 'text-red-300',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400/30',
    category: 'general',
    description: 'Flag officer'
  }
}

/**
 * Get rank based on level and performance metrics
 * @param {number} level - Current user level
 * @param {object} stats - Performance statistics
 * @returns {object} Rank information
 */
export function getRankForLevel(level, stats = {}) {
  // Get all ranks and sort by level requirement
  const ranks = Object.values(MILITARY_RANKS).sort((a, b) => a.level - b.level)
  
  // Find the highest rank the user qualifies for
  let qualifiedRank = ranks[0] // Default to lowest rank
  
  for (const rank of ranks) {
    if (level >= rank.level) {
      qualifiedRank = rank
    } else {
      break
    }
  }
  
  // Consider performance modifiers
  const successRate = stats.totalTasksCompleted > 0 
    ? stats.totalTasksCompleted / (stats.totalTasksCompleted + (stats.totalTasksFailed || 0))
    : 1

  // Performance penalties
  if (stats.totalDemotions > 5 && successRate < 0.7) {
    // Find a lower rank (2 levels down)
    const currentIndex = ranks.findIndex(r => r.level === qualifiedRank.level)
    const penaltyIndex = Math.max(0, currentIndex - 2)
    qualifiedRank = ranks[penaltyIndex]
  }
  
  return qualifiedRank
}

/**
 * Get rank abbreviation and styling
 * @param {number} level - Current level
 * @param {object} stats - Performance stats
 * @returns {object} Rank display info
 */
export function getRankDisplay(level, stats = {}) {
  const rank = getRankForLevel(level, stats)
  
  return {
    ...rank,
    displayName: `${rank.abbreviation} ${rank.name}`,
    shortName: rank.abbreviation,
    fullName: rank.name
  }
}

/**
 * Get progress to next rank
 * @param {number} level - Current level
 * @param {object} stats - Performance stats
 * @returns {object} Progress information
 */
export function getRankProgress(level, stats = {}) {
  const currentRank = getRankForLevel(level, stats)
  const ranks = Object.values(MILITARY_RANKS).sort((a, b) => a.level - b.level)
  
  const currentIndex = ranks.findIndex(r => r.level === currentRank.level)
  const nextRank = ranks[currentIndex + 1]
  
  if (!nextRank) {
    return {
      current: currentRank,
      next: null,
      progress: 1,
      levelsNeeded: 0,
      isMaxRank: true
    }
  }
  
  const progress = Math.min(1, level / nextRank.level)
  const levelsNeeded = Math.max(0, nextRank.level - level)
  
  return {
    current: currentRank,
    next: nextRank,
    progress,
    levelsNeeded,
    isMaxRank: false
  }
}

/**
 * Get all available ranks for display
 * @returns {Array} All ranks sorted by level
 */
export function getAllRanks() {
  return Object.values(MILITARY_RANKS).sort((a, b) => a.level - b.level)
}

export default MILITARY_RANKS