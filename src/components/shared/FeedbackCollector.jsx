// 💬 FEEDBACK COLLECTOR - Simple feedback system for getting user input
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, X } from 'lucide-react'
import useGameStore from '../../shared/stores/useGameStore'

const FeedbackCollector = ({ trigger = 'manual' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState('rating') // rating, feedback, thanks
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [category, setCategory] = useState('')
  const { commander } = useGameStore()
  
  // Auto-trigger based on usage
  React.useEffect(() => {
    if (trigger === 'after-usage') {
      // Show feedback after user has been active for 10 minutes
      const timer = setTimeout(() => {
        const hasGivenFeedback = localStorage.getItem('feedback-given')
        if (!hasGivenFeedback) {
          setIsOpen(true)
        }
      }, 10 * 60 * 1000) // 10 minutes
      
      return () => clearTimeout(timer)
    }
  }, [trigger])
  
  const handleSubmit = () => {
    // Create feedback object
    const feedbackData = {
      timestamp: new Date().toISOString(),
      commander,
      rating,
      category,
      feedback,
      version: '1.0.0',
      platform: navigator.platform,
      userAgent: navigator.userAgent
    }
    
    // Save to localStorage for later collection
    const existingFeedback = JSON.parse(localStorage.getItem('user-feedback') || '[]')
    existingFeedback.push(feedbackData)
    localStorage.setItem('user-feedback', JSON.stringify(existingFeedback))
    localStorage.setItem('feedback-given', 'true')
    
    // Show in console for easy copying
    // Feedback collected
    
    setStep('thanks')
    setTimeout(() => {
      setIsOpen(false)
      setTimeout(() => {
        setStep('rating')
        setRating(0)
        setFeedback('')
        setCategory('')
      }, 1000)
    }, 2000)
  }
  
  const categories = [
    { id: 'bugs', label: 'Bug Report', icon: '🐛' },
    { id: 'features', label: 'Feature Request', icon: '💡' },
    { id: 'usability', label: 'Usability Issue', icon: '🤔' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'other', label: 'General Feedback', icon: '💬' }
  ]
  
  if (!isOpen && trigger === 'manual') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-20 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-full shadow-lg transition-colors z-40"
        title="Send Feedback"
      >
        <MessageSquare className="w-5 h-5 text-blue-400" />
      </motion.button>
    )
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Feedback Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900/95 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Send Feedback</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {step === 'rating' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-white font-bold mb-3">How's Control Station OS working for you?</h4>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Quick Feedback */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => {
                        setRating(rating || 4)
                        setCategory('positive')
                        setFeedback('Love the app! Works great.')
                        handleSubmit()
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-400 text-sm"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Love it!
                    </button>
                    <button
                      onClick={() => {
                        setRating(rating || 2)
                        setStep('feedback')
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 text-sm"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Issues
                    </button>
                  </div>
                  
                  {rating > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setStep('feedback')}
                      className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-white text-sm"
                    >
                      Add details →
                    </motion.button>
                  )}
                </motion.div>
              )}
              
              {step === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-white font-bold mb-3">Tell me more</h4>
                  
                  {/* Category Selection */}
                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-2">What's this about?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-2 rounded-lg text-left transition-colors ${
                            category === cat.id
                              ? 'bg-blue-500/30 border border-blue-500/50'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-xs text-white/80">
                            {cat.icon} {cat.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Feedback Text */}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What can I improve? Any bugs? What's confusing?"
                    className="w-full h-24 p-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 resize-none focus:outline-none focus:border-blue-500/50"
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setStep('rating')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-sm transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!category || !feedback.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-blue-400 text-sm transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 'thanks' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-4xl mb-2">🙏</div>
                  <h4 className="text-white font-bold mb-2">Thanks for the feedback!</h4>
                  <p className="text-white/60 text-sm">
                    Your input helps make Control Station OS better.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FeedbackCollector