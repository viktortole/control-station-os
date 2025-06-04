// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 FOCUS GUARDIAN SERVICE - ENTERPRISE INTEGRATION                          │
// │ WebSocket connection to Python Focus Guardian backend                       │
// │ Real-time activity monitoring and session management                        │
// ╰──────────────────────────────────────────────────────────────────────────────╯

class FocusGuardianService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3 // Reduced from 5
    this.reconnectDelay = 2000 // Increased from 1000
    this.isConnecting = false
    this.isConnected = false
    this.shouldReconnect = true
    
    // Event callbacks
    this.activityCallback = null
    this.sessionCallback = null
    this.metricsCallback = null
    this.alertCallback = null
    this.connectionCallback = null
    
    // Connection state
    this.baseUrl = 'localhost:8000'
    this.wsUrl = `ws://${this.baseUrl}/ws/focus`
    this.apiUrl = `http://${this.baseUrl}/api/focus`
    
    // Timeout and interval management
    this.connectionTimeout = null
    this.reconnectTimeout = null
  }

  // Connection Management
  async connect() {
    if (this.isConnecting || this.isConnected || !this.shouldReconnect) {
      console.log('🔄 Connect skipped:', { 
        isConnecting: this.isConnecting, 
        isConnected: this.isConnected, 
        shouldReconnect: this.shouldReconnect 
      })
      return
    }

    console.log('🔌 Attempting WebSocket connection to:', this.wsUrl)
    this.isConnecting = true
    
    // Clear any existing timeouts
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
    }
    
    try {
      this.ws = new WebSocket(this.wsUrl)
      this.setupEventHandlers()
      
      // Connection timeout - reduced to 5 seconds
      this.connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.warn('⚠️ WebSocket connection timeout - Focus Guardian service may not be running')
          this.handleConnectionError(new Error('Connection timeout'))
        }
      }, 5000)
      
    } catch (error) {
      console.error('❌ Failed to connect to Focus Guardian:', error)
      this.handleConnectionError(error)
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('✅ Connected to Focus Guardian service')
      this.isConnected = true
      this.isConnecting = false
      this.reconnectAttempts = 0
      
      // Clear connection timeout since we're now connected
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
        this.connectionTimeout = null
      }
      
      if (this.connectionCallback) {
        this.connectionCallback(true)
      }
      
      // Send initial handshake
      this.sendCommand('handshake', {
        client: 'Control Station OS',
        version: '1.0.0'
      })
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onclose = (event) => {
      // Silent handling for connection close
      
      this.isConnected = false
      this.isConnecting = false
      
      if (this.connectionCallback) {
        this.connectionCallback(false)
      }
      
      // Auto-reconnect if not intentional close and we should reconnect
      if (event.code !== 1000 && this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      // Silent handling - WebSocket errors are expected when service isn't running
      this.handleConnectionError(error)
    }
  }

  handleMessage(data) {
    // Log all message types for debugging
    console.log('📨 Focus Guardian message:', data.type, data)
    console.log('🔄 Activity callback status:', !!this.activityCallback)
    
    switch (data.type) {
      case 'initial_status':
      case 'status_update':
        // Handle initial status and status updates
        if (this.activityCallback && data.focus) {
          this.activityCallback(data.focus)
        }
        break
        
      case 'focus_update':
        // Handle focus updates from our new event system
        if (this.activityCallback) {
          this.activityCallback(data.data)
        }
        break
        
      case 'window_changed':
        // Handle window change events
        if (this.activityCallback) {
          this.activityCallback({
            ...data.data,
            type: 'window_changed'
          })
        }
        break
        
      case 'activity_logged':
        // Handle activity logging events
        if (this.activityCallback) {
          this.activityCallback({
            ...data.data,
            type: 'activity_logged'
          })
        }
        break
        
      case 'focus_session_update':
        if (this.sessionCallback) {
          this.sessionCallback(data.data, data.event)
        }
        break
        
      case 'activity_update':
        // Legacy activity update handling
        if (this.activityCallback) {
          this.activityCallback(data.data)
        }
        break
        
      case 'pomodoro_update':
        // Handle pomodoro updates
        if (this.sessionCallback) {
          this.sessionCallback(data.data, 'pomodoro_update')
        }
        break
        
      case 'system_metrics':
        if (this.metricsCallback) {
          this.metricsCallback(data.data)
        }
        break
        
      case 'distraction_alert':
        if (this.alertCallback) {
          this.alertCallback(data.data)
        }
        break
        
      case 'handshake_response':
        console.log('🤝 Handshake successful:', data.data)
        break
        
      case 'command_response':
        console.log('⚡ Command response:', data)
        break
        
      case 'pong':
        console.log('🏓 Pong received')
        break
        
      case 'error':
        console.error('❌ WebSocket error:', data.message)
        break
        
      default:
        console.log('❓ Unknown message type:', data.type, data)
    }
  }

  handleConnectionError(error) {
    this.isConnected = false
    this.isConnecting = false
    
    if (this.connectionCallback) {
      this.connectionCallback(false, error)
    }
    
    this.scheduleReconnect()
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.shouldReconnect) {
      // Silently stop reconnecting after max attempts
      this.shouldReconnect = false
      return
    }

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }

  disconnect() {
    // Silent disconnect
    
    // Stop any future reconnection attempts
    this.shouldReconnect = false
    
    // Clear all timeouts
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
      this.connectionTimeout = null
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close(1000, 'Intentional disconnect')
      this.ws = null
    }
    
    this.isConnected = false
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  // Reset connection state for fresh connection attempts
  reset() {
    this.disconnect()
    this.shouldReconnect = true
    this.reconnectAttempts = 0
    
    // Clear connection state
    this.isConnected = false
    this.isConnecting = false
    
    // Reset callback handlers
    this.activityCallback = null
    this.sessionCallback = null
    this.metricsCallback = null
    this.alertCallback = null
    this.connectionCallback = null
  }

  // Session Management
  async startSession(sessionType, durationMinutes, goalDescription = null) {
    if (!this.isConnected) {
      throw new Error('Not connected to Focus Guardian service')
    }

    const sessionData = {
      session_type: sessionType,
      duration_minutes: durationMinutes,
      goal_description: goalDescription
    }

    try {
      // Send via WebSocket for immediate response
      const response = await this.sendCommand('start_session', sessionData)
      
      // Also call REST API for reliability
      await this.apiCall('POST', '/session/start', sessionData)
      
      return response
    } catch (error) {
      console.error('❌ Failed to start session:', error)
      throw error
    }
  }

  async endSession() {
    if (!this.isConnected) {
      throw new Error('Not connected to Focus Guardian service')
    }

    try {
      const response = await this.sendCommand('end_session')
      await this.apiCall('POST', '/session/end')
      return response
    } catch (error) {
      console.error('❌ Failed to end session:', error)
      throw error
    }
  }

  async pauseSession() {
    return this.sendCommand('pause_session')
  }

  async resumeSession() {
    return this.sendCommand('resume_session')
  }

  // Data Retrieval
  async getCurrentSession() {
    return this.apiCall('GET', '/session/current')
  }

  async getDailyMetrics(date = null) {
    const dateParam = date ? `?date=${date}` : ''
    return this.apiCall('GET', `/metrics/daily${dateParam}`)
  }

  async getFocusPatterns(daysBack = 30) {
    return this.apiCall('GET', `/patterns?days=${daysBack}`)
  }

  async createFocusGoal(goal) {
    return this.apiCall('POST', '/goals', goal)
  }

  // Event Handlers
  onActivityUpdate(callback) {
    this.activityCallback = callback
  }

  onSessionUpdate(callback) {
    this.sessionCallback = callback
  }

  onSystemMetrics(callback) {
    this.metricsCallback = callback
  }

  onDistractionAlert(callback) {
    this.alertCallback = callback
  }

  onConnectionChange(callback) {
    this.connectionCallback = callback
  }

  // Utility Methods
  async sendCommand(command, data = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('WebSocket not connected'))
        return
      }

      const message = {
        command,
        data,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substring(7)
      }

      try {
        this.ws.send(JSON.stringify(message))
        
        // For now, resolve immediately
        // In production, you'd wait for response with matching ID
        resolve({ success: true, command, data })
      } catch (error) {
        reject(error)
      }
    })
  }

  async apiCall(method, endpoint, data = null) {
    const url = `${this.apiUrl}${endpoint}`
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`❌ API call failed [${method} ${endpoint}]:`, error)
      throw error
    }
  }

  // Health Check
  async healthCheck() {
    try {
      const response = await fetch(`http://${this.baseUrl}/api/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Connection Status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// Singleton instance
export const focusGuardianService = new FocusGuardianService()
export default FocusGuardianService