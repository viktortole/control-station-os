// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ Control Station OS - Auth Screen                                             │
// │ Tactical theme, professional desktop feel                                    │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, Lock, User, ChevronRight, UserPlus,
  Eye, EyeOff, Activity, Crosshair, ChevronDown
} from 'lucide-react'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'
import useAuthStore from '../../shared/stores/useAuthStore'
import { MILITARY_SPECIALIZATIONS } from '../../shared/config/militaryInsignia'
import CommandEmblem from '../../components/ui/CommandEmblem'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../shared/config/adminAuth'

// Specialization selector (unchanged logic, calmer styling)
function CompactSpecSelector({ selectedSpec, onSelect, isDisabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedSpecInfo = MILITARY_SPECIALIZATIONS.find(s => s.id === selectedSpec) || MILITARY_SPECIALIZATIONS[0]

  return (
    <div className="relative">
      <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1">
        Military Specialization
      </label>
      <motion.button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-full p-2.5 rounded-lg border border-white/15 bg-[#0f1119] text-left transition-all ${
          isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${selectedSpecInfo.bgColor} border ${selectedSpecInfo.borderColor} flex items-center justify-center`}>
              <selectedSpecInfo.icon className={`w-4 h-4 ${selectedSpecInfo.textColor}`} />
            </div>
            <div>
              <p className={`font-bold text-sm ${selectedSpecInfo.textColor}`}>{selectedSpecInfo.name}</p>
              <p className="text-xs text-white/50">{selectedSpecInfo.designation}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#0c0d14] border border-white/12 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
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
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.04)' }}
                className="w-full p-3 text-left border-b border-white/8 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded ${spec.bgColor} border ${spec.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <spec.icon className={`w-3 h-3 ${spec.textColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${spec.textColor}`}>{spec.name}</p>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${spec.bgColor}/25 border ${spec.borderColor} ${spec.textColor}`}>
                        {spec.designation}
                      </span>
                    </div>
                    <p className="text-xs text-white/55 truncate">{spec.description}</p>
                  </div>
                  {selectedSpec === spec.id && <span className="text-green-400 text-xs font-bold">Active</span>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
  const { register, login } = useAuthStore()

  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('csos_saved_credentials')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.username) {
          setUsername(parsed.username)
          setRememberCommander(true)
        }
        if (parsed.password) setPassword(parsed.password)
      }
    } catch {
      // ignore
    }
  }, [])

  const persistCredentials = (name, pwd, shouldPersist) => {
    if (!shouldPersist) {
      localStorage.removeItem('csos_saved_credentials')
      return
    }
    localStorage.setItem('csos_saved_credentials', JSON.stringify({ username: name, password: pwd || null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setAuthError('COMMANDER NAME REQUIRED')
      TacticalAudio.punishment()
      return
    }
    if (mode === 'register' && password !== confirmPassword) {
      setAuthError('SECURITY CLEARANCE CONFIRMATION MISMATCH')
      TacticalAudio.punishment()
      return
    }

    setIsProcessing(true)
    setAuthError('')

    setTimeout(async () => {
      try {
        if (mode === 'register') {
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
          setTimeout(() => onAuthenticate(registrationResult.user.toUpperCase()), 1200)
        } else {
          const loginResult = await login(username, password || null)
          if (!loginResult.success) {
            setAuthError(
              loginResult.error === 'Invalid password'
                ? 'SECURITY CLEARANCE MISMATCH'
                : loginResult.error === 'User not found'
                  ? 'COMMANDER NOT FOUND'
                  : loginResult.error.toUpperCase()
            )
            setIsProcessing(false)
            TacticalAudio.punishment()
            return
          }
          persistCredentials(username.trim(), password, rememberCommander)
          TacticalAudio.missionComplete()
          setTimeout(() => onAuthenticate(loginResult.user.toUpperCase()), 800)
        }
        setIsProcessing(false)
      } catch (error) {
        console.error('🚨 Authentication error:', error)
        setAuthError('SYSTEM ERROR: ' + error.message)
        setIsProcessing(false)
        TacticalAudio.punishment()
      }
    }, 400)
  }

  const handleAdminLogin = async () => {
    setIsProcessing(true)
    setAuthError('')
    try {
      setUsername(ADMIN_USERNAME)
      if (ADMIN_PASSWORD) setPassword(ADMIN_PASSWORD)
      const result = await login(ADMIN_USERNAME, ADMIN_PASSWORD || null)
      if (!result.success) {
        setAuthError(`ADMIN LOGIN FAILED: ${result.error?.toUpperCase() || 'UNKNOWN'}`)
        TacticalAudio.punishment()
        setIsProcessing(false)
        return
      }
      TacticalAudio.missionComplete()
      setTimeout(() => onAuthenticate(result.user.toUpperCase()), 500)
      setIsProcessing(false)
    } catch (error) {
      setAuthError(`ADMIN LOGIN ERROR: ${error.message?.toUpperCase()}`)
      TacticalAudio.punishment()
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 overflow-y-auto bg-[#050608]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,88,88,0.14),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.14),transparent_32%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto space-y-4">
        {/* In-app header bar */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b0c10]/85 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-600/85 flex items-center justify-center text-white font-black text-sm border border-white/20">CS</div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-mono">Control Station OS</p>
              <p className="text-sm text-white font-semibold">Mission Access Console</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/60 font-mono">
            <span>Build: Tactical</span>
            <span>Status: Online</span>
            <span>Region: Local</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_auto_0.95fr] gap-6 items-center">
          {/* Left: Hero panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/5 p-7 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.05),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_45%)]" />
            <div className="relative flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-red-500/18 scale-125" />
                <CommandEmblem size={140} className="flex-shrink-0 relative" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-200">Control Station OS</p>
                <h1 className="text-3xl font-black text-white tracking-wide leading-tight">Mission Access Console</h1>
                <p className="text-sm text-white/75 max-w-xl">
                  Secure entry to operations, telemetry, and command modules. Clearance is required to unlock mission control.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Secure Sessions', 'Multi-Commander', 'Fast Launch'].map(label => (
                    <span
                      key={label}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/8 text-white/80 border border-white/10"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-2 gap-3">
              {[
                { title: 'Readiness', value: '99.9%', accent: 'from-green-500/50 to-emerald-400/30' },
                { title: 'System Load', value: 'CPU 18% • RAM 42%', accent: 'from-sky-400/30 to-cyan-300/15' },
                { title: 'Latency', value: '<120ms', accent: 'from-slate-400/30 to-slate-500/15' },
                { title: 'Last Session', value: 'Focus 52m • XP +75 • End 06:40', accent: 'from-amber-400/30 to-yellow-300/15' }
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-3 text-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.25)] relative overflow-hidden`}
                >
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-300 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" aria-hidden="true" />
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold">{card.title}</p>
                  <p className="text-lg font-black mt-1 leading-tight">{card.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Center HUD */}
          <div className="hidden lg:flex flex-col items-center gap-3 text-white/65">
            <div className="w-32 h-32 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-white/0 relative overflow-hidden">
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <motion.div
                className="absolute inset-6 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), transparent 60%)' }}
              />
            </div>
            <div className="text-center space-y-1 text-[11px] font-mono">
              <div className="uppercase tracking-[0.18em] text-white/70">System Status</div>
              <div className="text-emerald-300 font-semibold">Nodes online: 3 • All modules ready</div>
              <div className="text-white/55">Last sync: 12s ago • Uptime: 04:12:33</div>
            </div>
          </div>

          {/* Right: Auth card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
            className="relative bg-[#0b0c10]/95 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-white/12 shadow-[0_18px_60px_rgba(0,0,0,0.55)] max-w-lg w-full mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_32%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300">Security Clearance</p>
                <h2 className="text-2xl font-black text-white tracking-wide leading-tight">Control Station OS</h2>
                <p className="text-[12px] text-white/60 mt-1">Authenticate to access mission control and telemetry modules.</p>
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
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-[0.05em] transition-all border ${
                  mode === 'login'
                    ? 'border-red-500 text-white bg-red-600/90 shadow-lg shadow-red-900/35'
                    : 'border-white/12 text-white/75 hover:text-white hover:border-white/30 bg-black/40'
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
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-[0.05em] transition-all border ${
                  mode === 'register'
                    ? 'border-emerald-500 text-white bg-emerald-600/90 shadow-lg shadow-emerald-900/35'
                    : 'border-white/12 text-white/75 hover:text-white hover:border-white/30 bg-black/40'
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
            <div className="mb-3">
              <div className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-amber-200/15 bg-black/30 text-amber-50 text-[12px] font-semibold uppercase tracking-[0.06em]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Override
                </div>
                <button
                  type="button"
                  onClick={handleAdminLogin}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-amber-200/40 text-amber-50 text-[11px] hover:bg-amber-400/10 transition-all disabled:opacity-60"
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
              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
                  Commander Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
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

              <div>
                <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
                  Security Clearance {mode === 'login' && '(Optional)'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-1 font-mono">
                    Confirm Security Clearance
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <CompactSpecSelector selectedSpec={selectedSpec} onSelect={setSelectedSpec} isDisabled={isProcessing} />
                </motion.div>
              )}

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

              <div className="flex items-center justify-between text-xs text-white/60">
                <label className="inline-flex items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-red-500 rounded border-white/30 bg-gray-900/50"
                    checked={rememberCommander}
                    disabled={isProcessing}
                    onChange={(e) => setRememberCommander(e.target.checked)}
                  />
                  <span className="font-bold uppercase tracking-[0.14em]">Remember commander</span>
                </label>
                <span className="text-white/45">{mode === 'register' ? 'Saves new profile locally' : 'Prefills on next launch'}</span>
              </div>

              <motion.button
                type="submit"
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.01 }}
                whileTap={{ scale: isProcessing ? 1 : 0.99 }}
                className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-[0.1em] transition-all relative overflow-hidden group ${
                  isProcessing
                    ? 'bg-gray-800 border-2 border-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 border-2 border-red-500 text-white hover:bg-red-500 shadow-lg shadow-red-900/40'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-900" />
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

            <div className="mt-4 text-center">
              <p className="text-xs text-blue-400/40 font-mono uppercase tracking-[0.18em]">
                Focus • Progress • Results
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
