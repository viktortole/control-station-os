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
const localStore = {}
const sessionStore = {}

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key) => localStore[key] || null,
    setItem: (key, value) => { localStore[key] = value },
    removeItem: (key) => { delete localStore[key] },
    clear: () => { Object.keys(localStore).forEach((key) => delete localStore[key]) }
  },
  writable: true
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: (key) => sessionStore[key] || null,
    setItem: (key, value) => { sessionStore[key] = value },
    removeItem: (key) => { delete sessionStore[key] },
    clear: () => { Object.keys(sessionStore).forEach((key) => delete sessionStore[key]) }
  },
  writable: true
})

// Expose storage mocks globally for code that references the global objects
global.localStorage = window.localStorage
global.sessionStorage = window.sessionStorage

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
