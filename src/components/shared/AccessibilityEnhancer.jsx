// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ ♿ ACCESSIBILITY ENHANCER - CONTROL STATION OS                              │
// │ WCAG 2.1 AA compliance utilities and components                             │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { createContext, useContext, useEffect, useState } from 'react'

/* 🎯 PART 1: ACCESSIBILITY CONTEXT */
const AccessibilityContext = createContext({
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal',
  announcements: [],
  announce: () => {},
})

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [announcements, setAnnouncements] = useState([])

  // Detect user preferences
  useEffect(() => {
    // Check for prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(reducedMotionQuery.matches)
    
    const handleMotionChange = (e) => setReducedMotion(e.matches)
    reducedMotionQuery.addEventListener('change', handleMotionChange)
    
    // Check for prefers-contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)
    
    const handleContrastChange = (e) => setHighContrast(e.matches)
    contrastQuery.addEventListener('change', handleContrastChange)
    
    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  // Screen reader announcements
  const announce = (message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date().toISOString()
    }
    
    setAnnouncements(prev => [...prev.slice(-4), announcement])
    
    // Auto-clear announcements
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))
    }, 10000)
  }

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      reducedMotion,
      fontSize,
      announcements,
      announce,
      setHighContrast,
      setReducedMotion,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)

/* 🔊 PART 2: SCREEN READER ANNOUNCEMENTS */
export const ScreenReaderAnnouncements = () => {
  const { announcements } = useAccessibility()
  
  return (
    <div className="sr-only">
      {announcements.map(announcement => (
        <div
          key={announcement.id}
          aria-live={announcement.priority}
          aria-atomic="true"
        >
          {announcement.message}
        </div>
      ))}
    </div>
  )
}

/* 🎯 PART 3: ACCESSIBLE BUTTON COMPONENT */
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  const { reducedMotion } = useAccessibility()
  
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 
    font-bold uppercase tracking-wider transition-all
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    ${!reducedMotion ? 'hover:scale-105 active:scale-95' : ''}
  `
  
  const variants = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg',
    secondary: 'bg-gray-800 text-white border border-gray-600',
    danger: 'bg-red-600 text-white shadow-lg',
    success: 'bg-green-600 text-white shadow-lg',
    ghost: 'text-white hover:bg-white/10'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* 📊 PART 4: ACCESSIBLE PROGRESS BAR */
export const AccessibleProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  className = '',
  showPercentage = true 
}) => {
  const percentage = Math.round((value / max) * 100)
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white/80">{label}</span>
          {showPercentage && (
            <span className="text-sm text-white/60">{percentage}%</span>
          )}
        </div>
      )}
      <div 
        role="progressbar" 
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${value} of ${max} (${percentage}%)`}
        className="h-2 bg-gray-700 rounded-full overflow-hidden"
      >
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/* 🎯 PART 5: SKIP NAVIGATION */
export const SkipNavigation = () => (
  <a
    href="#main-content"
    className="
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
      bg-blue-600 text-white px-4 py-2 rounded-lg font-bold
      focus:outline-none focus:ring-2 focus:ring-blue-300
    "
  >
    Skip to main content
  </a>
)

/* 🏷️ PART 6: ACCESSIBLE BADGE */
export const AccessibleBadge = ({ 
  children, 
  variant = 'default', 
  ariaLabel,
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-600 text-gray-100',
    success: 'bg-green-600 text-green-100',
    warning: 'bg-yellow-600 text-yellow-100',
    danger: 'bg-red-600 text-red-100',
    info: 'bg-blue-600 text-blue-100'
  }
  
  return (
    <span
      className={`
        inline-flex items-center px-2 py-1 text-xs font-bold rounded-full
        ${variants[variant]} ${className}
      `}
      aria-label={ariaLabel}
      role="status"
    >
      {children}
    </span>
  )
}

/* 📱 PART 7: ACCESSIBLE CARD */
export const AccessibleCard = ({ 
  children, 
  heading, 
  headingLevel = 2,
  className = '',
  ...props 
}) => {
  const HeadingTag = `h${headingLevel}`
  
  return (
    <div
      className={`
        bg-gray-900/50 border border-white/10 rounded-lg p-4
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900
        ${className}
      `}
      {...props}
    >
      {heading && (
        <HeadingTag className="text-lg font-bold text-white mb-3">
          {heading}
        </HeadingTag>
      )}
      {children}
    </div>
  )
}

/* 🎨 PART 8: HIGH CONTRAST STYLES */
export const HighContrastStyles = () => {
  const { highContrast } = useAccessibility()
  
  if (!highContrast) return null
  
  return (
    <style>{`
      .high-contrast {
        --text-primary: #ffffff !important;
        --text-secondary: #e5e7eb !important;
        --bg-primary: #000000 !important;
        --bg-secondary: #1f2937 !important;
        --border-color: #ffffff !important;
        --accent-color: #3b82f6 !important;
      }
      
      .high-contrast * {
        background-image: none !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }
      
      .high-contrast button {
        border: 2px solid #ffffff !important;
      }
      
      .high-contrast a {
        color: #60a5fa !important;
        text-decoration: underline !important;
      }
    `}</style>
  )
}

/* 🔧 PART 9: ACCESSIBILITY UTILITIES */
export const a11yUtils = {
  // Generate unique IDs for form associations
  generateId: (prefix = 'a11y') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  },
  
  // Focus management
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }
}

/* 🎯 PART 10: ACCESSIBLE MODAL */
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}) => {
  const titleId = a11yUtils.generateId('modal-title')
  const descId = a11yUtils.generateId('modal-desc')
  
  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement
      
      // Focus trap
      const modalContainer = document.querySelector('[role="dialog"]')
      const cleanup = a11yUtils.trapFocus(modalContainer)
      
      // ESC key handler
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        cleanup()
        document.removeEventListener('keydown', handleEscape)
        if (previousFocus) previousFocus.focus()
      }
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75" aria-hidden="true" />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`
          relative bg-gray-900 border border-white/20 rounded-lg p-6 max-w-lg w-full mx-4
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
        tabIndex={-1}
      >
        <h2 id={titleId} className="text-xl font-bold text-white mb-4">
          {title}
        </h2>
        <div id={descId}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default {
  AccessibilityProvider,
  useAccessibility,
  ScreenReaderAnnouncements,
  AccessibleButton,
  AccessibleProgressBar,
  SkipNavigation,
  AccessibleBadge,
  AccessibleCard,
  HighContrastStyles,
  AccessibleModal,
  a11yUtils
}