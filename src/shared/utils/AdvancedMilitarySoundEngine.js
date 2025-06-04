// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ ADVANCED MILITARY SOUND ENGINE V2.0 - CONTROL STATION OS                 │
// │ Authentic submarine sonar, tactical computer systems, radio communications    │
// │ Real Navy/Military computer sounds with 3D spatial audio                     │
// ╰──────────────────────────────────────────────────────────────────────────────╯

/**
 * Advanced Military Sound System
 * Based on authentic US Navy submarine sonar, military computer systems,
 * and tactical operations center audio feedback patterns.
 */
class AdvancedMilitarySoundEngine {
  constructor() {
    this.audioContext = null
    this.masterGain = null
    this.enabled = true
    this.volume = 0.6 // Reduced from 0.7 for better user experience
    this.initialized = false
    this.soundCache = new Map()
    this.activeNodes = []
    
    // Sound profiles for different contexts
    this.profiles = {
      submarine: { reverb: 0.3, lowpass: 2000, baseFreq: 440 },
      tactical: { reverb: 0.1, lowpass: 4000, baseFreq: 880 },
      command: { reverb: 0.2, lowpass: 3000, baseFreq: 660 }
    }
    
    this.currentProfile = 'tactical'
  }

  // Initialize advanced audio context with 3D positioning
  async initialize() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create master gain node
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
      this.masterGain.connect(this.audioContext.destination)
      
      // Create convolution reverb for military spaces
      await this.setupReverb()
      
      this.initialized = true
      // Advanced Military Sound Engine initialized
      
      // Play initialization sound
      this.playBootSequence()
    } catch (error) {
      // Military sound systems offline
      this.enabled = false
    }
  }

  // Setup convolution reverb for military environments
  async setupReverb() {
    try {
      this.reverbNode = this.audioContext.createConvolver()
      
      // Create impulse response for military facility reverb
      const length = this.audioContext.sampleRate * 2 // 2 seconds
      const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate)
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel)
        for (let i = 0; i < length; i++) {
          // Create realistic military facility reverb pattern
          const decay = Math.pow(1 - i / length, 2.5)
          channelData[i] = (Math.random() * 2 - 1) * decay * 0.3
        }
      }
      
      this.reverbNode.buffer = impulse
    } catch (error) {
      console.warn('Reverb setup failed:', error)
    }
  }

  // Play tactical boot sequence (like military computers)
  playBootSequence() {
    const timings = [0, 200, 400, 600, 800]
    const frequencies = [440, 554, 659, 740, 880]
    
    timings.forEach((delay, index) => {
      setTimeout(() => {
        this.generateTacticalBeep(frequencies[index], 150, 0.3)
      }, delay)
    })
  }

  // Generate authentic submarine sonar ping
  generateSubmarineSonar(intensity = 'normal') {
    if (!this.canPlay()) return

    const configs = {
      light: { freq: 2200, duration: 200, volume: 0.4 },
      normal: { freq: 2400, duration: 300, volume: 0.6 },
      heavy: { freq: 2600, duration: 400, volume: 0.8 }
    }
    
    const config = configs[intensity] || configs.normal
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    // Configure submarine sonar characteristics
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(config.freq, this.audioContext.currentTime)
    
    // Add frequency sweep (authentic sonar behavior)
    oscillator.frequency.exponentialRampToValueAtTime(
      config.freq * 0.8, 
      this.audioContext.currentTime + config.duration / 1000
    )
    
    // Bandpass filter for sonar-like quality
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(config.freq, this.audioContext.currentTime)
    filter.Q.setValueAtTime(15, this.audioContext.currentTime)
    
    // Envelope for authentic ping
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(config.volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration / 1000)
    
    // Connect audio graph
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    // Add to active nodes for cleanup
    this.activeNodes.push({ oscillator, gainNode, filter })
    
    // Play and cleanup
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + config.duration / 1000)
    
    oscillator.addEventListener('ended', () => {
      this.cleanupNode({ oscillator, gainNode, filter })
    })
  }

  // Generate tactical computer beep (military computers)
  generateTacticalBeep(frequency = 880, duration = 100, volume = 0.5) {
    if (!this.canPlay()) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    // Sharp, precise computer beep
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    
    // High-pass filter for crispness
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime)
    
    // Quick attack, linear decay
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.005)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000)
    
    // Connect and play
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
    
    this.activeNodes.push({ oscillator, gainNode, filter })
    oscillator.addEventListener('ended', () => {
      this.cleanupNode({ oscillator, gainNode, filter })
    })
  }

  // Generate radio static burst (communications)
  generateRadioStatic(duration = 200, intensity = 0.3) {
    if (!this.canPlay()) return

    const bufferSize = this.audioContext.sampleRate * (duration / 1000)
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const channelData = buffer.getChannelData(0)
    
    // Generate pink noise (more natural than white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      b6 = white * 0.115926
      channelData[i] = pink * intensity * 0.11
    }
    
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    source.buffer = buffer
    
    // High-pass filter for radio quality
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    
    // Quick fade in/out
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000)
    
    source.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    source.start(this.audioContext.currentTime)
    
    this.activeNodes.push({ source, gainNode, filter })
    source.addEventListener('ended', () => {
      this.cleanupNode({ source, gainNode, filter })
    })
  }

  // High-level sound effects for game events
  xpGain(amount) {
    if (amount >= 100) {
      // Major accomplishment - submarine sonar
      this.generateSubmarineSonar('heavy')
      setTimeout(() => this.generateTacticalBeep(1320, 200, 0.4), 100)
    } else if (amount >= 50) {
      // Good accomplishment - tactical beep sequence
      this.generateTacticalBeep(880, 100, 0.5)
      setTimeout(() => this.generateTacticalBeep(1100, 120, 0.4), 80)
    } else {
      // Minor accomplishment - single beep
      this.generateTacticalBeep(660, 80, 0.4)
    }
  }

  levelUp() {
    // Epic level up sequence
    const frequencies = [440, 554, 659, 880, 1108]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTacticalBeep(freq, 200, 0.6)
      }, index * 150)
    })
    
    // Final sonar ping
    setTimeout(() => {
      this.generateSubmarineSonar('heavy')
    }, 800)
  }

  punishment() {
    // Ominous low-frequency warning
    this.generateAlarm()
    setTimeout(() => {
      this.generateRadioStatic(300, 0.4)
    }, 200)
  }

  // Generate alarm sound for failures
  generateAlarm() {
    if (!this.canPlay()) return

    const oscillator1 = this.audioContext.createOscillator()
    const oscillator2 = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    // Dual-tone alarm (like submarine warning)
    oscillator1.type = 'square'
    oscillator2.type = 'square'
    oscillator1.frequency.setValueAtTime(220, this.audioContext.currentTime)
    oscillator2.frequency.setValueAtTime(165, this.audioContext.currentTime)
    
    // Warble effect
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()
    lfo.frequency.setValueAtTime(4, this.audioContext.currentTime)
    lfoGain.gain.setValueAtTime(50, this.audioContext.currentTime)
    
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator1.frequency)
    
    // Low-pass filter for muffled alarm quality
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
    
    // Envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.6, this.audioContext.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5)
    
    // Connect graph
    const merger = this.audioContext.createChannelMerger(2)
    oscillator1.connect(merger, 0, 0)
    oscillator2.connect(merger, 0, 1)
    merger.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    // Start all
    lfo.start(this.audioContext.currentTime)
    oscillator1.start(this.audioContext.currentTime)
    oscillator2.start(this.audioContext.currentTime)
    
    // Stop all
    const stopTime = this.audioContext.currentTime + 1.5
    lfo.stop(stopTime)
    oscillator1.stop(stopTime)
    oscillator2.stop(stopTime)
    
    this.activeNodes.push({ oscillator1, oscillator2, lfo, gainNode, filter, merger, lfoGain })
  }

  // Button click sounds
  buttonClick() {
    this.generateTacticalBeep(1320, 50, 0.3)
  }

  // Success confirmation
  missionComplete() {
    this.generateSubmarineSonar('normal')
    setTimeout(() => {
      this.generateTacticalBeep(1760, 150, 0.4)
    }, 150)
  }

  // Task creation
  taskCreated() {
    this.generateTacticalBeep(880, 60, 0.3)
  }

  // Focus timer start
  focusStart() {
    this.generateTacticalBeep(660, 100, 0.5)
    setTimeout(() => this.generateTacticalBeep(880, 100, 0.4), 100)
  }

  // Focus timer complete
  focusComplete() {
    // Victory fanfare
    const melody = [659, 659, 659, 523, 659, 784, 392]
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTacticalBeep(freq, 150, 0.5)
      }, index * 100)
    })
  }

  // Utility methods
  canPlay() {
    return this.enabled && this.audioContext && this.initialized
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled
    if (!enabled) {
      this.stopAll()
    }
  }

  // Cleanup methods
  cleanupNode(nodeGroup) {
    const index = this.activeNodes.findIndex(n => n === nodeGroup)
    if (index !== -1) {
      this.activeNodes.splice(index, 1)
    }
  }

  stopAll() {
    this.activeNodes.forEach(nodeGroup => {
      Object.values(nodeGroup).forEach(node => {
        try {
          if (node.stop) node.stop()
          if (node.disconnect) node.disconnect()
        } catch (e) {
          // Ignore cleanup errors
        }
      })
    })
    this.activeNodes = []
  }

  // Cleanup when done
  dispose() {
    this.stopAll()
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

// Singleton instance
const TacticalAudio = new AdvancedMilitarySoundEngine()

// Auto-initialize on user interaction
let autoInitialized = false
const initOnInteraction = () => {
  if (!autoInitialized) {
    TacticalAudio.initialize()
    autoInitialized = true
    document.removeEventListener('click', initOnInteraction)
    document.removeEventListener('keydown', initOnInteraction)
  }
}

document.addEventListener('click', initOnInteraction)
document.addEventListener('keydown', initOnInteraction)

export { AdvancedMilitarySoundEngine, TacticalAudio }
export default TacticalAudio