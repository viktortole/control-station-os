import '@testing-library/jest-dom'

// Mock the audio context for testing
global.AudioContext = class MockAudioContext {
  constructor() {
    this.state = 'running'
    this.sampleRate = 44100
    this.currentTime = 0
  }
  
  close() {
    return Promise.resolve()
  }
  
  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { value: 440 }
    }
  }
  
  createGain() {
    return {
      connect: () => {},
      gain: { value: 1 }
    }
  }
  
  get destination() {
    return {}
  }
}

// Mock localStorage and sessionStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key) => global.localStorage[key] || null,
    setItem: (key, value) => { global.localStorage[key] = value },
    removeItem: (key) => { delete global.localStorage[key] },
    clear: () => { global.localStorage = {} }
  },
  writable: true
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: (key) => global.sessionStorage[key] || null,
    setItem: (key, value) => { global.sessionStorage[key] = value },
    removeItem: (key) => { delete global.sessionStorage[key] },
    clear: () => { global.sessionStorage = {} }
  },
  writable: true
})

// Initialize storage objects
global.localStorage = {}
global.sessionStorage = {}

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    href: 'http://localhost:3000'
  },
  writable: true
})

// Mock performance.memory for system monitoring
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 1024 * 1024 * 10, // 10MB
    totalJSHeapSize: 1024 * 1024 * 20, // 20MB  
    jsHeapSizeLimit: 1024 * 1024 * 100 // 100MB
  },
  writable: true
})

// Mock navigator properties
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
  writable: true
})

Object.defineProperty(navigator, 'platform', {
  value: 'Win32',
  writable: true
})

Object.defineProperty(navigator, 'language', {
  value: 'en-US',
  writable: true
})

Object.defineProperty(navigator, 'cookieEnabled', {
  value: true,
  writable: true
})

Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true
})