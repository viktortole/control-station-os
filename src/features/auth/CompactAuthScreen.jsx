// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🔐 COMPACT MILITARY AUTH SCREEN - CONTROL STATION OS                         │
// │ Streamlined registration form with compact specialization selector           │
// │ Mobile-optimized and visually appealing design                               │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, AlertTriangle, Lock, User, ChevronRight, UserPlus,
  Eye, EyeOff, Command, Activity, Crosshair, ChevronDown,
  CheckCircle2, X, Star, Crown, Target, Zap
} from 'lucide-react'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import useAuthStore from '../../shared/stores/useAuthStore'
import { MILITARY_SPECIALIZATIONS } from '../../shared/config/militaryInsignia'
import TacticalCommandLogo from '../../components/ui/TacticalCommandLogo'

/* 🎖️ COMPACT SPECIALIZATION SELECTOR */
function CompactSpecSelector({ selectedSpec, onSelect, isDisabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedSpecInfo = MILITARY_SPECIALIZATIONS.find(s => s.id === selectedSpec) || MILITARY_SPECIALIZATIONS[0]

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
        Military Specialization
      </label>
      
      {/* Dropdown Button */}
      <motion.button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-full p-2.5 rounded-lg border-2 transition-all text-left ${
          isDisabled 
            ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed' 
            : 'bg-gray-900/50 border-white/20 hover:border-white/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${selectedSpecInfo.bgColor} border ${selectedSpecInfo.borderColor} flex items-center justify-center`}>
              <selectedSpecInfo.icon className={`w-4 h-4 ${selectedSpecInfo.textColor}`} />
            </div>
            <div>
              <p className={`font-bold text-sm ${selectedSpecInfo.textColor}`}>
                {selectedSpecInfo.name}
              </p>
              <p className="text-xs text-white/50">{selectedSpecInfo.designation}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-white/60" />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
          >
            {MILITARY_SPECIALIZATIONS.map((spec) => (
              <motion.button
                key={spec.id}
                type="button"
                onClick={() => {
                  onSelect(spec.id)
                  setIsOpen(false)
                  TacticalAudio.buttonClick()
                }}
                whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className={`w-full p-3 text-left transition-all border-b border-white/10 last:border-b-0 ${
                  selectedSpec === spec.id ? `${spec.bgColor}/20` : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded ${spec.bgColor} border ${spec.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <spec.icon className={`w-3 h-3 ${spec.textColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${selectedSpec === spec.id ? spec.textColor : 'text-white/90'}`}>
                        {spec.name}
                      </p>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${spec.bgColor}/20 border ${spec.borderColor} ${spec.textColor}`}>
                        {spec.designation}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 truncate">{spec.description}</p>
                  </div>
                  {selectedSpec === spec.id && (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* 🔐 MAIN COMPACT AUTH SCREEN */
export default function CompactAuthScreen({ onAuthenticate }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('infantry')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [authError, setAuthError] = useState('')
  
  const usernameRef = useRef(null)
  
  // Get auth store methods
  const { register, login } = useAuthStore()

  // Focus username on mount
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  // Enhanced authentication with registration support
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setAuthError('COMMANDER NAME REQUIRED')
      TacticalAudio.punishment()
      return
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setAuthError('SECURITY CLEARANCE CONFIRMATION MISMATCH')
        TacticalAudio.punishment()
        return
      }
    }

    setIsProcessing(true)
    setAuthError('')
    
    // Simulate processing time
    setTimeout(async () => {
      try {
        if (mode === 'register') {
          // Registration logic using auth store
          const registrationResult = await register(username, {
            password: password || null,
            specialization: selectedSpec,
            avatar: 'tactical-1',
            rank: 'RECRUIT',
            clearanceLevel: password ? 'CLASSIFIED' : 'PUBLIC'
          })
          
          if (!registrationResult.success) {
            setAuthError(registrationResult.error.toUpperCase())
            setIsProcessing(false)
            TacticalAudio.punishment()
            return
          }
          
          TacticalAudio.missionComplete()
          
          // Registration successful, authenticating user
          
          setTimeout(() => {
            onAuthenticate(registrationResult.user.toUpperCase())
          }, 1500)
          
        } else {
          // Login logic using auth store
          const loginResult = await login(username, password || null)
          
          if (!loginResult.success) {
            setAuthError(loginResult.error === 'Invalid password' ? 
              'SECURITY CLEARANCE MISMATCH' : 
              loginResult.error === 'User not found' ?
              'COMMANDER NOT FOUND IN REGISTRY' :
              loginResult.error.toUpperCase())
            setIsProcessing(false)
            TacticalAudio.punishment()
            return
          }
          
          TacticalAudio.missionComplete()
          
          // Login successful, authenticating user
          
          setTimeout(() => {
            onAuthenticate(loginResult.user.toUpperCase())
          }, 1500)
        }
      } catch (error) {
        console.error('🚨 Authentication error:', error)
        setAuthError('SYSTEM ERROR: ' + error.message)
        setIsProcessing(false)
        TacticalAudio.punishment()
      }
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/20" />
        
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-[0.02]"
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-red-500/30" />
        <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-red-500/30" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-red-500/30" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-red-500/30" />
      </div>
      
      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full max-w-sm mx-auto scale-90"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl"
          animate={{
            background: [
              'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Main container */}
        <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-4 border-2 border-red-500/30 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-4">
            <TacticalCommandLogo size={50} className="mx-auto mb-3" />
            <h1 className="text-xl font-black text-white uppercase tracking-wider mb-1">
              Control Station OS
            </h1>
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
              {mode === 'register' ? 'Commander Registration' : 'Security Clearance'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex mb-4 bg-gray-900/50 rounded-lg p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                mode === 'login'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Login
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                mode === 'register'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Commander Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Enter your callsign"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                Security Clearance {mode === 'login' && '(Optional)'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Enter password (optional)"
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-900/50 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">
                  Confirm Security Clearance
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-900/50 border-2 border-white/20 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Specialization (Register only) */}
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CompactSpecSelector 
                  selectedSpec={selectedSpec}
                  onSelect={setSelectedSpec}
                  isDisabled={isProcessing}
                />
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-400 text-sm font-bold"
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              className={`w-full py-2.5 rounded-lg font-black text-sm uppercase tracking-wider transition-all relative overflow-hidden group ${
                isProcessing 
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-500 cursor-not-allowed' 
                  : mode === 'register'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-500 text-white hover:from-green-500 hover:to-green-600 shadow-lg hover:shadow-green-500/25'
                    : 'bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-500 text-white hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/25'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-2">
                {isProcessing ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>{mode === 'register' ? 'REGISTERING...' : 'AUTHENTICATING...'}</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    <span>{mode === 'register' ? 'CREATE PROFILE' : 'INITIATE PROTOCOL'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-blue-400/40 font-mono uppercase tracking-widest">
              Focus • Progress • Results
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}