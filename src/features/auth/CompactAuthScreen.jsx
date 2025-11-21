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
import CommandEmblem from '../../components/ui/CommandEmblem'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../shared/config/adminAuth'

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
  const [rememberCommander, setRememberCommander] = useState(false)
  
  const usernameRef = useRef(null)
  
  // Get auth store methods
  const { register, login } = useAuthStore()

  // Focus username on mount
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

  // Load any locally saved credentials
  useEffect(() => {
    try {
      const saved = localStorage.getItem('csos_saved_credentials')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.username) {
          setUsername(parsed.username)
          setRememberCommander(true)
        }
        if (parsed.password) {
          setPassword(parsed.password)
        }
      }
    } catch (error) {
      // Ignore malformed saved credentials
    }
  }, [])

  const persistCredentials = (name, pwd, shouldPersist) => {
    if (!shouldPersist) {
      localStorage.removeItem('csos_saved_credentials')
      return
    }
    localStorage.setItem('csos_saved_credentials', JSON.stringify({
      username: name,
      password: pwd || null
    }))
  }

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

          persistCredentials(username.trim(), password, rememberCommander)
          
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

          persistCredentials(username.trim(), password, rememberCommander)
          
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

  const handleAdminLogin = async () => {
    setIsProcessing(true)
    setAuthError('')
    try {
      // Prefill fields for clarity
      setUsername(ADMIN_USERNAME)
      if (ADMIN_PASSWORD) {
        setPassword(ADMIN_PASSWORD)
      }

      const result = await login(ADMIN_USERNAME, ADMIN_PASSWORD || null)
      if (!result.success) {
        setAuthError(`ADMIN LOGIN FAILED: ${result.error?.toUpperCase() || 'UNKNOWN'}`)
        TacticalAudio.punishment()
        setIsProcessing(false)
        return
      }

      TacticalAudio.missionComplete()
      setTimeout(() => {
        onAuthenticate(result.user.toUpperCase())
      }, 500)
      setIsProcessing(false)
    } catch (error) {
      setAuthError(`ADMIN LOGIN ERROR: ${error.message?.toUpperCase()}`)
      TacticalAudio.punishment()
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 overflow-y-auto bg-[#050608]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,88,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.18),transparent_32%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_auto_0.95fr] gap-6 items-center">
        {/* Left: Hero panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/5 p-7 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_25%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.05),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_40%)]" />
          <div className="relative flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-red-500/20 scale-125" />
              <CommandEmblem size={140} className="flex-shrink-0 relative" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-200">
                Control Station OS
              </p>
              <h1 className="text-3xl font-black text-white tracking-wide leading-tight">
                Mission Access Console
              </h1>
              <p className="text-sm text-white/75 max-w-xl">
                Secure entry to operations, telemetry, and command modules. Clearance is required to unlock mission control.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Secure Sessions', 'Multi-Commander', 'XP Discipline', 'Fast Launch'].map(label => (
                  <span
                    key={label}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/10 text-white/80 border border-white/10"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
            <div className="relative mt-6 grid grid-cols-2 gap-3">
              {[
                { title: 'Readiness', value: '99.9%', accent: 'from-green-500/60 to-emerald-400/40' },
                { title: 'Discipline Mode', value: 'Strict', accent: 'from-red-500/40 to-orange-400/20' },
                { title: 'Latency', value: '<120ms', accent: 'from-sky-400/40 to-cyan-300/20' },
                { title: 'Access Logs', value: 'Encrypted', accent: 'from-amber-400/40 to-yellow-300/20' }
              ].map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-3 text-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.25)] relative overflow-hidden`}
              >
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-300 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 font-semibold">{card.title}</p>
                <p className="text-lg font-black mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Center HUD */}
        <div className="hidden lg:flex flex-col items-center gap-3 text-white/60">
          <div className="w-32 h-32 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-white/0 relative overflow-hidden">
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <motion.div
              className="absolute inset-6 rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 60%)'
              }}
            />
          </div>
          <div className="text-center space-y-1 text-[11px] font-mono">
            <div className="uppercase tracking-[0.2em] text-white/70">System Status</div>
            <div className="text-emerald-300 font-semibold">Standby • All Modules Ready</div>
            <div className="text-white/50">Last sync: now</div>
          </div>
        </div>

        {/* Right: Auth card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          className="relative bg-[#0b0c10]/95 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.55)] max-w-lg w-full mx-auto overflow-hidden"
        >
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_32%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                Security Clearance
              </p>
              <h2 className="text-2xl font-black text-white tracking-wide leading-tight">
                Control Station OS
              </h2>
              <p className="text-[12px] text-white/60 mt-1">
                Authenticate to access mission control and telemetry modules.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-white/65 text-[11px] font-mono">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Build: Tactical</span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">Access: Multi-user</span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex mb-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-[0.08em] transition-all border ${
                mode === 'login'
                  ? 'border-red-500 text-white bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/40'
                  : 'border-white/12 text-white/80 hover:text-white hover:border-white/30 bg-black/30'
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
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold uppercase tracking-[0.08em] transition-all border ${
                mode === 'register'
                  ? 'border-emerald-500 text-white bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-900/40'
                  : 'border-white/12 text-white/80 hover:text-white hover:border-white/30 bg-black/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </div>
            </button>
          </div>

          {/* Access hints */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/70">Primary</p>
              <p className="text-sm font-semibold text-white">Standard Login</p>
              <p className="text-[11px] text-white/50">Local secure channel</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/70">Alternate</p>
              <p className="text-sm font-semibold text-white">Admin Override</p>
              <p className="text-[11px] text-white/50">Operator credentials</p>
            </div>
          </div>

          {/* Admin quick login */}
          <div className="mb-4">
            <div className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-amber-200/20 bg-black/25 text-amber-50 text-[12px] font-semibold uppercase tracking-[0.08em]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Override
              </div>
              <button
                type="button"
                onClick={handleAdminLogin}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-amber-300/50 text-amber-50 text-[11px] hover:bg-amber-400/10 transition-all disabled:opacity-60"
              >
                <span>Enter</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-amber-100/70 font-mono">
              Operator credentials required for system override.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username */}
            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f1119] border border-white/12 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors shadow-inner shadow-black/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
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
                  className="w-full pl-10 pr-12 py-2.5 bg-[#0f1119] border border-white/12 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors shadow-inner shadow-black/40"
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
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
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
                    className="w-full pl-10 pr-12 py-2.5 bg-[#0f1119] border border-white/12 rounded-lg text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors shadow-inner shadow-black/40"
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
            
            {/* Remember commander */}
            <div className="flex items-center justify-between text-xs text-white/60">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-red-500 rounded border-white/30 bg-gray-900/50"
                  checked={rememberCommander}
                  disabled={isProcessing}
                  onChange={(e) => setRememberCommander(e.target.checked)}
                />
                <span className="font-bold uppercase tracking-wider">Remember commander</span>
              </label>
              <span className="text-white/40">{mode === 'register' ? 'Saves new profile locally' : 'Prefills on next launch'}</span>
            </div>
            
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
                    <span>{mode === 'register' ? 'Create Profile' : 'Enter Control Station'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </motion.button>

            <div className="mt-2 text-[11px] font-mono text-white/60 flex items-center justify-between">
              <span>Link secure: AES-256</span>
              <span>Session integrity: OK</span>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-blue-400/40 font-mono uppercase tracking-widest">
              Focus • Progress • Results
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
