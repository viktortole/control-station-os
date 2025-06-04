// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 👤 USER PROFILE MANAGEMENT - CONTROL STATION OS                             │
// │ Complete user customization with nickname and security settings             │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  User, Shield, Lock, Eye, EyeOff, Edit3, Save, X, 
  AlertTriangle, CheckCircle2, Key, UserCheck, Settings
} from 'lucide-react'
import useAuthStore from '../../shared/stores/useAuthStore'
import UserManager from '../auth/UserManager'
import { TacticalAudio } from '../../shared/utils/AdvancedMilitarySoundEngine'

export default function UserProfile({ isOpen, onClose }) {
  const { currentUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  
  // Form states
  const [nickname, setNickname] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  // UI states
  const [saveStatus, setSaveStatus] = useState(null) // 'saving', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')
  
  // Timeout refs for cleanup
  const saveTimeoutRef = useRef(null)
  const passwordTimeoutRef = useRef(null)

  // Load current user data
  useEffect(() => {
    if (currentUser && isOpen) {
      const userData = UserManager.getUserData(currentUser)
      setNickname(userData?.profile?.nickname || currentUser)
      setDisplayName(userData?.profile?.displayName || currentUser)
    }
  }, [currentUser, isOpen])
  
  // Cleanup timeouts on unmount or dialog close
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current)
      }
    }
  }, [])
  
  // Cleanup when dialog closes
  useEffect(() => {
    if (!isOpen) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current)
      }
    }
  }, [isOpen])

  // Handle nickname/display name save
  const handleSaveProfile = async () => {
    if (!nickname.trim()) {
      setErrorMessage('Nickname cannot be empty')
      TacticalAudio.punishment()
      return
    }

    setSaveStatus('saving')
    setErrorMessage('')

    try {
      // Update user profile data
      const userData = UserManager.getUserData(currentUser)
      const updatedData = {
        ...userData,
        profile: {
          ...userData.profile,
          nickname: nickname.trim(),
          displayName: displayName.trim() || nickname.trim(),
          lastUpdated: new Date().toISOString()
        }
      }

      UserManager.saveUserData(currentUser, updatedData)
      
      setSaveStatus('success')
      TacticalAudio.missionComplete()
      
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus(null)
        setIsEditing(false)
      }, 2000)

    } catch (error) {
      setSaveStatus('error')
      setErrorMessage(error.message || 'Failed to update profile')
      TacticalAudio.punishment()
    }
  }

  // Handle password change
  const handleChangePassword = async () => {
    setErrorMessage('')

    // Validation
    if (!currentPassword) {
      setErrorMessage('Current password is required')
      TacticalAudio.punishment()
      return
    }

    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters')
      TacticalAudio.punishment()
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match')
      TacticalAudio.punishment()
      return
    }

    setSaveStatus('saving')

    try {
      // In a real app, you'd verify the current password
      // For this demo, we'll just update the stored password hash
      const userData = UserManager.getUserData(currentUser)
      const updatedData = {
        ...userData,
        security: {
          ...userData.security,
          passwordHash: btoa(newPassword), // Simple encoding for demo
          passwordUpdated: new Date().toISOString(),
          securityLevel: newPassword.length >= 8 ? 'high' : 'medium'
        }
      }

      UserManager.saveUserData(currentUser, updatedData)
      
      setSaveStatus('success')
      TacticalAudio.missionComplete()
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Clear any existing timeout
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current)
      }
      
      passwordTimeoutRef.current = setTimeout(() => {
        setSaveStatus(null)
        setShowChangePassword(false)
      }, 2000)

    } catch (error) {
      setSaveStatus('error')
      setErrorMessage(error.message || 'Failed to update password')
      TacticalAudio.punishment()
    }
  }

  // Cancel editing
  const handleCancel = () => {
    const userData = UserManager.getUserData(currentUser)
    setNickname(userData?.profile?.nickname || currentUser)
    setDisplayName(userData?.profile?.displayName || currentUser)
    setIsEditing(false)
    setErrorMessage('')
    setSaveStatus(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                  Commander Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white/90 uppercase tracking-wider">
                    Profile Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400 font-semibold">Edit</span>
                    </button>
                  )}
                </div>

                {/* Username (Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Username (Callsign)
                  </label>
                  <div className="p-3 bg-gray-800/50 border border-white/10 rounded-lg">
                    <span className="text-white/90 font-mono uppercase">{currentUser}</span>
                    <span className="text-white/40 text-sm ml-2">(Cannot be changed)</span>
                  </div>
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Nickname
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:border-blue-400/50 focus:outline-none transition-colors"
                      placeholder="Enter your preferred nickname"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 border border-white/10 rounded-lg">
                      <span className="text-white/90">{nickname}</span>
                    </div>
                  )}
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:border-blue-400/50 focus:outline-none transition-colors"
                      placeholder="Full display name (optional)"
                    />
                  ) : (
                    <div className="p-3 bg-gray-800/30 border border-white/10 rounded-lg">
                      <span className="text-white/90">{displayName}</span>
                    </div>
                  )}
                </div>

                {/* Profile Action Buttons */}
                {isEditing && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saveStatus === 'saving'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-semibold">
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                      </span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400 font-semibold">Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Security Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white/90 uppercase tracking-wider">
                    Security Settings
                  </h3>
                  {!showChangePassword && (
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg transition-all"
                    >
                      <Key className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-400 font-semibold">Change Password</span>
                    </button>
                  )}
                </div>

                {/* Change Password Form */}
                {showChangePassword && (
                  <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-orange-500/20">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-3 pr-12 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:border-orange-400/50 focus:outline-none transition-colors"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-3 pr-12 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:border-orange-400/50 focus:outline-none transition-colors"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/60"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:border-orange-400/50 focus:outline-none transition-colors"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleChangePassword}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Key className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-orange-400 font-semibold">
                          {saveStatus === 'saving' ? 'Updating...' : 'Update Password'}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setShowChangePassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setErrorMessage('')
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400 font-semibold">Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {saveStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Changes saved successfully!</span>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-semibold">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 👤 END OF USER PROFILE MANAGEMENT                                           │
// │ Features:                                                                    │
// │ • Nickname and display name customization                                   │
// │ • Password change functionality                                             │
// │ • Military-themed UI with tactical feedback                                 │
// │ • Form validation and error handling                                        │
// │ • Audio feedback for actions                                               │
// │ • Data persistence through UserManager                                      │
// │ 📁 SAVE AS: src/components/UserProfile.jsx                                  │
// ╰──────────────────────────────────────────────────────────────────────────────╯