// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 📁 FILE: src/components/TreeHealth.jsx                                       │
// │ 🌳 PROGRESSIVE TREE VISUALIZATION - CONTROL STATION OS V2.0                  │
// │ Growth-based system: Seedling → Small Tree → Healthy Tree → Dying Tree      │
// │ Visual progression tied to actual XP/mission completion progress             │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Droplets, Sun, Skull, 
  AlertTriangle, TrendingDown, Zap, Sparkles, Trophy
} from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

/* 🌱 PART 1: PROGRESSIVE TREE STAGES & ANIMATIONS */
const TREE_STAGES = {
  // Stage 0: Just starting (0-99 XP)
  seedling: {
    emoji: '🌱',
    stage: 0,
    minXP: 0,
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.3)',
    message: 'New Beginning',
    subtext: 'A fresh start with endless potential',
    animation: 'grow',
    particles: false,
    leaves: 0,
    size: 'text-6xl',
    description: 'Just planted, ready to grow'
  },
  
  // Stage 1: Small growth (100-499 XP)
  sprout: {
    emoji: '🌿',
    stage: 1,
    minXP: 100,
    color: '#16A34A',
    glow: 'rgba(22, 163, 74, 0.3)',
    message: 'First Growth',
    subtext: 'Progress is becoming visible',
    animation: 'sway',
    particles: true,
    leaves: 3,
    size: 'text-7xl',
    description: 'First signs of discipline'
  },
  
  // Stage 2: Young tree (500-999 XP)
  young: {
    emoji: '🌳',
    stage: 2,
    minXP: 500,
    color: '#15803D',
    glow: 'rgba(21, 128, 61, 0.3)',
    message: 'Growing Strong',
    subtext: 'Consistent effort paying off',
    animation: 'sway',
    particles: true,
    leaves: 6,
    size: 'text-8xl',
    description: 'Building momentum'
  },
  
  // Stage 3: Mature tree (1000+ XP)
  mature: {
    emoji: '🌲',
    stage: 3,
    minXP: 1000,
    color: '#166534',
    glow: 'rgba(22, 101, 52, 0.4)',
    message: 'Productivity Master',
    subtext: 'Peak performance achieved',
    animation: 'strong',
    particles: true,
    leaves: 12,
    size: 'text-9xl',
    description: 'True discipline mastery'
  },
  
  // Health degradation states
  warning: {
    emoji: '🍂',
    stage: -1,
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)',
    message: 'Needs Attention',
    subtext: 'Complete tasks to restore health',
    animation: 'shiver',
    particles: false,
    leaves: 2,
    size: 'text-7xl',
    description: 'Losing vitality'
  },
  
  dying: {
    emoji: '🥀',
    stage: -2,
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    message: 'CRITICAL: Tree Dying!',
    subtext: 'ACT NOW OR FACE CONSEQUENCES',
    animation: 'wither',
    particles: false,
    leaves: 0,
    size: 'text-6xl',
    description: 'On the brink of failure'
  }
}

/* 🌳 PART 2: PROGRESSIVE TREE DETERMINATION LOGIC */
const determineTreeStage = (totalXP, treeHealth) => {
  try {
    // Validate inputs
    const validXP = typeof totalXP === 'number' && !isNaN(totalXP) ? totalXP : 0
    
    // If health is actively bad, override XP-based progression
    if (treeHealth === 'dying') return 'dying'
    if (treeHealth === 'warning') return 'warning'
    
    // XP-based progressive growth with safe comparison
    if (validXP >= 1000) return 'mature'
    if (validXP >= 500) return 'young' 
    if (validXP >= 100) return 'sprout'
    return 'seedling'
  } catch (error) {
    console.warn('TreeHealth: Error determining stage, defaulting to seedling', error)
    return 'seedling'
  }
}

/* 🌿 PART 3: ENHANCED ANIMATED TREE COMPONENT */
const AnimatedTree = ({ stage, totalXP, isGrowing = false }) => {
  // Safe config access with fallback
  const treeConfig = TREE_STAGES[stage] || TREE_STAGES.seedling
  const [showGrowthEffect, setShowGrowthEffect] = useState(false)
  
  // Trigger growth effect when growing
  useEffect(() => {
    if (isGrowing) {
      setShowGrowthEffect(true)
      setTimeout(() => setShowGrowthEffect(false), 2000)
    }
  }, [isGrowing])
  
  // Memoize progress calculation to prevent recalculation on every render
  const progressToNext = useMemo(() => {
    if (stage === 'dying' || stage === 'warning') return 0
    
    const currentStage = TREE_STAGES[stage]
    const nextStageKey = Object.keys(TREE_STAGES).find(key => 
      TREE_STAGES[key].stage === currentStage.stage + 1
    )
    
    if (!nextStageKey) return 100 // Already at max
    
    const nextStage = TREE_STAGES[nextStageKey]
    const progress = ((totalXP - currentStage.minXP) / (nextStage.minXP - currentStage.minXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }, [stage, totalXP])
  
  return (
    <div className="relative w-56 h-56">
      {/* Glow effect with stage-appropriate intensity - GPU optimized */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ 
          backgroundColor: treeConfig.glow,
          willChange: 'transform, opacity' // GPU acceleration hint
        }}
        animate={
          stage === 'dying' 
            ? { opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }
            : stage === 'mature'
            ? { opacity: [0.4, 0.6, 0.4], scale: [0.95, 1.1, 0.95] }
            : { opacity: [0.2, 0.4, 0.2], scale: [0.95, 1.05, 0.95] }
        }
        transition={{ 
          duration: stage === 'dying' ? 1.5 : stage === 'mature' ? 4 : 3, 
          repeat: Infinity,
          ease: "easeInOut" // Smoother animation
        }}
      />
      
      {/* Growth burst effect */}
      <AnimatePresence>
        {showGrowthEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 2, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${treeConfig.color}40 0%, transparent 70%)`,
              willChange: 'transform, opacity' // GPU acceleration
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Tree base with stage-appropriate animations */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={
          treeConfig.animation === 'grow' ? {
            scale: [0.95, 1.05, 0.95],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          } : treeConfig.animation === 'strong' ? {
            rotate: [-1, 1, -1],
            scale: [1, 1.02, 1],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          } : treeConfig.animation === 'sway' ? {
            rotate: [-2, 2, -2],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          } : treeConfig.animation === 'shiver' ? {
            rotate: [-1, 1, -1],
            x: [-2, 2, -2],
            transition: { duration: 1.5, repeat: Infinity }
          } : {
            rotate: [0, -5, 0],
            y: [0, 3, 0],
            transition: { duration: 2.5, repeat: Infinity }
          }
        }
      >
        {/* Tree emoji with dynamic sizing and styling */}
        <motion.span 
          className={`${treeConfig.size} select-none drop-shadow-2xl`}
          style={{ 
            filter: stage === 'dying' ? 'grayscale(0.7) brightness(0.7)' : 
                   stage === 'warning' ? 'grayscale(0.3) brightness(0.9)' : 'none',
          }}
          animate={isGrowing ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {treeConfig.emoji}
        </motion.span>
        
        {/* Growth sparkles for positive stages */}
        {(stage === 'sprout' || stage === 'young' || stage === 'mature') && (
          <>
            {[...Array(treeConfig.leaves || 0)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                style={{
                  left: `${50 + Math.cos(i * Math.PI / 3) * (30 + i * 5)}%`,
                  top: `${50 + Math.sin(i * Math.PI / 3) * (30 + i * 5)}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            ))}
          </>
        )}
        
        {/* Falling leaves for warning state */}
        {stage === 'warning' && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`leaf-${i}`}
                className="absolute text-2xl"
                initial={{ 
                  top: '15%', 
                  left: `${25 + i * 15}%`,
                  opacity: 0 
                }}
                animate={{
                  top: '110%',
                  left: `${25 + i * 15 + (Math.random() * 30 - 15)}%`,
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeInOut"
                }}
              >
                🍂
              </motion.div>
            ))}
          </>
        )}
        
        {/* Death particles for dying state */}
        {stage === 'dying' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`death-${i}`}
                className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
                initial={{ 
                  bottom: '45%', 
                  left: '50%',
                  opacity: 0 
                }}
                animate={{
                  bottom: '-5%',
                  left: `${50 + (Math.random() * 60 - 30)}%`,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
      
      {/* Stage progression indicator */}
      {stage !== 'dying' && stage !== 'warning' && progressToNext < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-center">
            <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: treeConfig.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1 font-mono">
              {progressToNext.toFixed(0)}% to next stage
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* 📊 PART 3: HEALTH INDICATORS */
const HealthIndicator = ({ icon: Icon, label, value, color, isActive }) => (
  <motion.div
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
      isActive 
        ? 'bg-white/10 border border-white/20' 
        : 'bg-white/5 border border-white/10 opacity-50'
    }`}
    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Icon className={`w-4 h-4 ${isActive ? color : 'text-gray-500'}`} />
    <div>
      <p className="text-xs text-white/40 uppercase">{label}</p>
      <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
        {value}
      </p>
    </div>
  </motion.div>
)

/* 🌳 PART 4: MAIN PROGRESSIVE TREE HEALTH COMPONENT */
export default function TreeHealth() {
  const { todayXP, streak, treeHealth, settings, totalXP } = useGameStore()
  const [pulseWarning, setPulseWarning] = useState(false)
  const [prevTotalXP, setPrevTotalXP] = useState(totalXP)
  const [isGrowing, setIsGrowing] = useState(false)
  
  // Determine current tree stage based on XP and health
  const currentStage = useMemo(() => 
    determineTreeStage(totalXP, treeHealth), 
    [totalXP, treeHealth]
  )
  
  const treeConfig = TREE_STAGES[currentStage]
  
  // Detect XP growth for animations
  useEffect(() => {
    if (totalXP > prevTotalXP) {
      setIsGrowing(true)
      setTimeout(() => setIsGrowing(false), 1000)
    }
    setPrevTotalXP(totalXP)
  }, [totalXP, prevTotalXP])
  
  // Pulse warning for dying state
  useEffect(() => {
    if (treeHealth === 'dying') {
      setPulseWarning(true)
      const interval = setInterval(() => {
        setPulseWarning(prev => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [treeHealth])
  
  // Calculate water needed (XP needed to improve health)
  const waterNeeded = treeHealth === 'dying' ? 50 : treeHealth === 'warning' ? 100 : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Background with dynamic color based on health */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(135deg, ${
            treeHealth === 'healthy' ? 'rgba(16, 185, 129, 0.1)' :
            treeHealth === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
            'rgba(239, 68, 68, 0.2)'
          } 0%, rgba(0, 0, 0, 0.5) 100%)`
        }}
      />
      
      {/* Alert border for dying state */}
      {treeHealth === 'dying' && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500 rounded-3xl"
          animate={{ opacity: pulseWarning ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white/90">Productivity Tree</h3>
            <p className={`text-sm font-semibold mt-1 ${
              treeHealth === 'healthy' ? 'text-green-400' :
              treeHealth === 'warning' ? 'text-yellow-400' :
              'text-red-400 animate-pulse'
            }`}>
              {treeConfig.message}
            </p>
          </div>
          
          {/* Critical alert for dying state */}
          {treeHealth === 'dying' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <Skull className="w-5 h-5 text-red-400" />
              <span className="text-sm font-bold text-red-400">CRITICAL</span>
            </motion.div>
          )}
        </div>
        
        {/* Progressive Tree visualization */}
        <div className="flex items-center justify-center mb-8">
          <AnimatedTree 
            stage={currentStage} 
            totalXP={totalXP}
            isGrowing={isGrowing}
          />
        </div>
        
        {/* Stage Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-bold text-white/90 uppercase tracking-wider">
                {treeConfig.message}
              </p>
              <p className="text-xs text-white/50 font-mono">
                Stage {treeConfig.stage >= 0 ? treeConfig.stage + 1 : 'Crisis'}: {treeConfig.description}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Health metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <HealthIndicator
            icon={Droplets}
            label="Today's XP"
            value={`${todayXP} / ${settings.dailyXPGoal}`}
            color="text-blue-400"
            isActive={todayXP > 0}
          />
          <HealthIndicator
            icon={Sun}
            label="Streak"
            value={`${streak} days`}
            color="text-yellow-400"
            isActive={streak > 0}
          />
          <HealthIndicator
            icon={Heart}
            label="Health"
            value={treeConfig.message.split(':')[0]}
            color={`text-${treeHealth === 'healthy' ? 'green' : treeHealth === 'warning' ? 'yellow' : 'red'}-400`}
            isActive={true}
          />
          <HealthIndicator
            icon={Zap}
            label="Water Needed"
            value={waterNeeded > 0 ? `${waterNeeded} XP` : 'None'}
            color="text-purple-400"
            isActive={waterNeeded > 0}
          />
        </div>
        
        {/* Action prompt */}
        <div className={`text-center p-4 rounded-xl ${
          treeHealth === 'dying' ? 'bg-red-500/10 border border-red-500/30' :
          treeHealth === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
          'bg-green-500/10 border border-green-500/30'
        }`}>
          <p className="text-sm text-white/80 font-medium">
            {treeConfig.subtext}
          </p>
          
          {treeHealth !== 'healthy' && (
            <motion.div
              className="mt-3 flex items-center justify-center gap-2 text-white/60"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">
                Complete tasks to restore health
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Warning message for dying state */}
        {treeHealth === 'dying' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-red-400/80 font-mono uppercase tracking-wider">
              Continued neglect will result in XP penalties
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* 🎨 PART 5: PROGRESSIVE TREE HEALTH WIDGET (Compact Version) */
export function TreeHealthWidget() {
  const { treeHealth, totalXP } = useGameStore()
  
  // Determine current stage for widget
  const currentStage = useMemo(() => 
    determineTreeStage(totalXP, treeHealth), 
    [totalXP, treeHealth]
  )
  
  const config = TREE_STAGES[currentStage]
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg
        bg-gray-900/50 border transition-all cursor-pointer
        ${currentStage === 'dying' ? 'border-red-500/30 animate-pulse' :
          currentStage === 'warning' ? 'border-yellow-500/30' :
          'border-green-500/30'}
      `}
    >
      <motion.span 
        className="text-2xl"
        animate={currentStage === 'dying' ? { rotate: [0, -5, 5, 0] } : {}}
        transition={{ duration: 0.5, repeat: currentStage === 'dying' ? Infinity : 0 }}
      >
        {config.emoji}
      </motion.span>
      <div>
        <p className="text-xs text-white/40 uppercase">
          {currentStage === 'dying' || currentStage === 'warning' ? 'Tree Health' : 'Growth Stage'}
        </p>
        <p className={`text-sm font-bold ${
          currentStage === 'dying' ? 'text-red-400' :
          currentStage === 'warning' ? 'text-yellow-400' :
          currentStage === 'mature' ? 'text-emerald-400' :
          currentStage === 'young' ? 'text-green-400' :
          currentStage === 'sprout' ? 'text-lime-400' :
          'text-green-300'
        }`}>
          {config.message.split(':')[0]}
        </p>
      </div>
    </motion.div>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🌳 END OF TreeHealth.jsx                                                     │
// │ 📁 SAVE THIS FILE AS: src/components/TreeHealth.jsx                         │
// │ This creates the visual pressure system for productivity health              │
// │ Import and use in Dashboard.jsx or as a standalone component                │
// ╰──────────────────────────────────────────────────────────────────────────────╯