// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎭 ANIMATION CONSTANTS - CONTROL STATION OS                                  │
// │ Standardized animation timings and easing for consistent UX                  │
// ╰──────────────────────────────────────────────────────────────────────────────╯

export const ANIMATION_CONFIG = {
  // Standard timing values (in ms)
  timing: {
    instant: 0,
    ultraFast: 100,
    fast: 150,
    normal: 300,
    medium: 400,
    slow: 500,
    deliberate: 800,
    epic: 1200
  },
  
  // Easing curves
  easing: {
    smooth: "easeInOut",
    snappy: "easeOut", 
    sharp: "easeIn",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    military: "cubic-bezier(0.4, 0, 0.2, 1)", // Material design standard
    spring: { type: "spring", stiffness: 300, damping: 30 },
    springBouncy: { type: "spring", stiffness: 400, damping: 15 },
    springSmooth: { type: "spring", stiffness: 200, damping: 40 }
  },
  
  // Common transition configs
  transitions: {
    fadeIn: { duration: 300, ease: "easeOut" },
    slideUp: { duration: 300, ease: "easeOut" },
    scaleIn: { duration: 200, ease: "easeOut" },
    buttonHover: { duration: 150, ease: "easeInOut" },
    modalOpen: { duration: 400, ease: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
    punishment: { duration: 500, ease: "easeOut" },
    glow: { duration: 2000, ease: "easeInOut", repeat: Infinity }
  },
  
  // Animation variants for Framer Motion
  variants: {
    pageEnter: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: "easeOut" }
    },
    
    cardHover: {
      whileHover: { scale: 1.02, transition: { duration: 0.15 } },
      whileTap: { scale: 0.98, transition: { duration: 0.1 } }
    },
    
    buttonPress: {
      whileHover: { scale: 1.05, transition: { duration: 0.15 } },
      whileTap: { scale: 0.95, transition: { duration: 0.1 } }
    },
    
    slideModal: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
      transition: { duration: 0.4, ease: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
    },
    
    // Tactical reveal animation
    tacticalReveal: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
        filter: 'blur(10px)'
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        filter: 'blur(0px)'
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        filter: 'blur(10px)'
      },
      transition: { 
        duration: 0.5,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    },
    
    // Stagger animations for lists
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        }
      }
    },
    
    staggerItem: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.15 }
    },
    
    // XP popup animation
    xpPopup: {
      initial: { scale: 0, opacity: 0, rotate: -180 },
      animate: { 
        scale: [0, 1.2, 1], 
        opacity: 1, 
        rotate: 0,
        transition: {
          duration: 0.6,
          ease: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }
      },
      exit: { 
        scale: 0.8, 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
      }
    },
    
    // Achievement notification
    achievementNotification: {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
      transition: { type: "spring", stiffness: 400, damping: 30 }
    }
  }
}

// GPU-optimized styles
export const GPU_OPTIMIZED = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)', // Force GPU layer
  backfaceVisibility: 'hidden',
  perspective: 1000
}

// Animation effects
export const EFFECTS = {
  // Pulse effect
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  },
  
  // Glow effect
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(59, 130, 246, 0)',
      '0 0 20px 10px rgba(59, 130, 246, 0.4)',
      '0 0 0 0 rgba(59, 130, 246, 0)'
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    }
  },
  
  // Shake effect (for errors)
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.3,
      ease: 'linear'
    }
  },
  
  // Scan line (tactical effect)
  scanLine: {
    y: ['-100%', '100%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  
  // Warning flash
  warningFlash: {
    backgroundColor: [
      'rgba(239, 68, 68, 0)',
      'rgba(239, 68, 68, 0.2)',
      'rgba(239, 68, 68, 0)'
    ],
    transition: {
      duration: 0.5,
      repeat: 3
    }
  }
}

// Hover effects
export const HOVER_EFFECTS = {
  lift: {
    y: -2,
    scale: 1.02,
    transition: { duration: 0.15 }
  },
  
  glow: {
    scale: 1.05,
    filter: 'brightness(1.1)',
    transition: { duration: 0.15 }
  },
  
  tacticalGlow: {
    scale: 1.01,
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
    transition: { duration: 0.15 }
  },
  
  militaryHover: {
    scale: 1.02,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    transition: { duration: 0.15 }
  }
}

// Tap effects
export const TAP_EFFECTS = {
  scale: {
    scale: 0.98,
    transition: { duration: 0.05 }
  },
  
  press: {
    scale: 0.95,
    transition: { duration: 0.05 }
  },
  
  tacticalPress: {
    scale: 0.97,
    filter: 'brightness(0.9)',
    transition: { duration: 0.05 }
  }
}

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// Helper function to combine animation props
export const combineAnimations = (...animations) => {
  return animations.reduce((acc, anim) => ({ ...acc, ...anim }), {})
}

// Export all as default for easy access
export default {
  ...ANIMATION_CONFIG,
  GPU_OPTIMIZED,
  EFFECTS,
  HOVER_EFFECTS,
  TAP_EFFECTS,
  BREAKPOINTS,
  combineAnimations
}