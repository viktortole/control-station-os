/* eslint-env node */
const { app, BrowserWindow, Menu, shell, dialog } = require('electron')
const path = require('path')
const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production'
const devUrl = process.env.ELECTRON_DEV_URL || process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window with military-inspired styling
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 12 },
    // icon: path.join(__dirname, '../public/icon.png'), // Optional
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    titleBarStyle: 'default',
    show: false, // Don't show until ready
    backgroundColor: '#000000', // Black background for boot sequence
    title: 'Control Station OS - Military-Grade Productivity'
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL(devUrl)
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Tactical startup message
    if (!isDev) {
      setTimeout(() => {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Control Station OS - Deployment Successful',
          message: 'Welcome to Control Station OS',
          detail: 'Military-grade productivity system activated.\n\n• Complete missions to gain XP\n• Abandon missions to lose XP\n• Experience real consequences\n\nNo mercy mode is active. Good luck, Commander.',
          buttons: ['Roger that!'],
          defaultId: 0
        })
      }, 2000)
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  // On macOS, keep app running even when windows are closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Create application menu
const template = [
  {
    label: 'Control Station',
    submenu: [
      {
        label: 'About Control Station OS',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About Control Station OS',
            message: 'Control Station OS v1.0',
            detail: 'Military-grade productivity system\n\nFeatures:\n• Punishment-based task management\n• XP system with level progression\n• Multi-user support\n• Real consequences for failure\n\nBuilt for commanders who demand discipline.',
            buttons: ['Close']
          })
        }
      },
      { type: 'separator' },
      {
        label: 'Reset All Data',
        click: () => {
          const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'warning',
            title: 'Nuclear Option',
            message: 'Reset All Progress?',
            detail: 'This will permanently delete:\n• All XP and levels\n• All missions and tasks\n• All user profiles\n• All statistics\n\nThis action cannot be undone!',
            buttons: ['Cancel', 'NUKE EVERYTHING'],
            defaultId: 0,
            cancelId: 0
          })
          
          if (choice === 1) {
            // Clear all localStorage and reload
            mainWindow.webContents.executeJavaScript(`
              localStorage.clear();
              sessionStorage.clear();
              location.reload();
            `)
          }
        }
      },
      { type: 'separator' },
      { role: 'quit', label: 'Exit Control Station' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload', label: 'Reload System' },
      { role: 'forceReload', label: 'Force Reload' },
      { role: 'toggleDevTools', label: 'Developer Tools' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Reset Zoom' },
      { role: 'zoomIn', label: 'Zoom In' },
      { role: 'zoomOut', label: 'Zoom Out' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
    ]
  },
  {
    label: 'Mission Control',
    submenu: [
      {
        label: 'Quick Deploy Daily Routine',
        accelerator: 'Ctrl+D',
        click: () => {
          mainWindow.webContents.executeJavaScript(`
            if (window.debug && window.debug.deployTemplateSet) {
              window.debug.deployTemplateSet('daily-routine');
            }
          `)
        }
      },
      {
        label: 'Add 100 XP (Testing)',
        accelerator: 'Ctrl+X',
        click: () => {
          mainWindow.webContents.executeJavaScript(`
            if (window.debug && window.debug.xp) {
              window.debug.xp(100);
            }
          `)
        }
      },
      {
        label: 'Punishment Test (-50 XP)',
        accelerator: 'Ctrl+P',
        click: () => {
          mainWindow.webContents.executeJavaScript(`
            if (window.debug && window.debug.punish) {
              window.debug.punish(50, 'Menu Test Punishment');
            }
          `)
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'User Manual',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Control Station OS - User Manual',
            message: 'Quick Start Guide',
            detail: `MISSION CONTROL BASICS:

1. CREATE PROFILE
   • Enter your commander name
   • Choose your operating parameters

2. DEPLOY MISSIONS
   • Use "Show Templates" for quick deployment
   • Deploy by category or individual missions
   • Custom missions via "Deploy Mission" button

3. COMPLETE MISSIONS
   • Click the circle to complete missions
   • Gain XP and level up
   • Build your productivity streak

4. FACE CONSEQUENCES
   • Abandon missions = XP loss
   • Multiple failures = level demotion
   • Tree health indicates performance

KEYBOARD SHORTCUTS:
• Ctrl+D: Deploy Daily Routine
• Ctrl+X: Add XP (testing)
• Ctrl+P: Test punishment

Remember: This is not a game. Actions have consequences.`,
            buttons: ['Understood']
          })
        }
      },
      {
        label: 'Report Issue',
        click: () => {
          shell.openExternal('https://github.com/your-repo/control-station-os/issues')
        }
      }
    ]
  }
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))

// Prevent navigation away from the app
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    
    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
      event.preventDefault()
    }
  })
})
