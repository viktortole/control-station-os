import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh in dev for better DX
      fastRefresh: true
    })
  ],
  
  // Configure server settings
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: false,
    hmr: {
      overlay: false
    }
  },
  
  // Configure root and entry point explicitly
  root: '.',
  
  // Explicitly define which files to process
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('zustand')) {
              return 'vendor-state'
            }
            return 'vendor-misc'
          }
          
          // Large feature modules (lazy loaded)
          if (id.includes('features/missions/MissionControl')) {
            return 'lazy-missions'
          }
          if (id.includes('features/focus/EnhancedFocusGuardian')) {
            return 'lazy-focus'
          }
          if (id.includes('features/dashboard/Dashboard')) {
            return 'lazy-dashboard'
          }
          if (id.includes('features/achievements')) {
            return 'lazy-achievements'
          }
          if (id.includes('features/settings')) {
            return 'lazy-settings'
          }
          if (id.includes('features/intelligence')) {
            return 'lazy-intelligence'
          }
          
          // Core game systems (split for performance)
          if (id.includes('stores/useGameStore') || id.includes('utils/PunishmentSystem')) {
            return 'core-game'
          }
          if (id.includes('stores/useAuthStore') || id.includes('auth/UserManager')) {
            return 'core-auth'
          }
          
          // Shared utilities
          if (id.includes('shared/utils')) {
            return 'shared-utils'
          }
          if (id.includes('shared/config')) {
            return 'shared-config'
          }
        }
      }
    },
    // Optimize chunk size and improve minification
    chunkSizeWarningLimit: 200,
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: false,
    // Optimize CSS
    cssMinify: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'zustand'],
    force: true
  },
  
  // Improve build performance
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})
