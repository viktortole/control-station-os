// Error Reporter - Captures errors for debugging
class ErrorReporter {
  constructor() {
    this.errors = []
    this.maxErrors = 50
    this.setupErrorHandlers()
  }

  setupErrorHandlers() {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'error',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      })
    })

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'unhandledRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      })
    })

    // Override console.error
    const originalError = console.error
    console.error = (...args) => {
      this.logError({
        type: 'console.error',
        message: args.map(arg => String(arg)).join(' '),
        timestamp: new Date().toISOString()
      })
      originalError.apply(console, args)
    }
  }

  logError(error) {
    this.errors.push(error)
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Save to localStorage for persistence
    try {
      localStorage.setItem('controlstation_errors', JSON.stringify(this.errors))
    } catch (e) {
      // Ignore storage errors
    }
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    localStorage.removeItem('controlstation_errors')
  }

  // Get errors as formatted text for copying
  getErrorReport() {
    if (this.errors.length === 0) {
      return 'No errors captured'
    }

    return this.errors.map(err => {
      return `[${err.timestamp}] ${err.type}: ${err.message}${err.stack ? '\n' + err.stack : ''}`
    }).join('\n\n---\n\n')
  }
}

// Create global instance
const errorReporter = new ErrorReporter()

// Add debug command
if (import.meta.env.DEV && typeof window !== 'undefined') {
  if (!window.debug) window.debug = {}
  
  window.debug.errors = () => {
    const report = errorReporter.getErrorReport()
    console.log(report)
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(report).then(() => {
        console.log('✅ Error report copied to clipboard!')
      })
    }
    
    return errorReporter.getErrors()
  }
  
  window.debug.clearErrors = () => {
    errorReporter.clearErrors()
    console.log('✅ Errors cleared')
  }
}

export default errorReporter