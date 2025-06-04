import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { applyTheme } from '../shared/config/themes'
import errorReporter from '../shared/utils/ErrorReporter'

// Apply military theme immediately
applyTheme('military')

// Hide boot screen immediately
const bootScreen = document.getElementById('boot-screen')
if (bootScreen) {
  bootScreen.style.display = 'none'
}

// Create root and render WITHOUT StrictMode for faster initial load
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)

// Dispatch app mounted event
window.dispatchEvent(new CustomEvent('appMounted'))