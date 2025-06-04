# Control Station OS

A punishment-based productivity system with real consequences. Built with React, featuring XP loss, level demotion, and military-grade accountability.

## Quick Start

```bash
# Development
npm install
npm run dev

# Production Build  
npm run build

# Desktop App
npm run electron
```

## Core Features

- **Task Management**: Military-style mission control
- **XP System**: Fixed values (25/50/100 XP) with real penalties
- **Punishment Mechanics**: Level demotion and negative XP
- **Multi-User**: Isolated data per commander
- **Focus Tools**: Pomodoro timer with pressure system
- **Analytics**: Performance tracking and insights

## Architecture

- **Frontend**: React 18, Vite, Tailwind CSS
- **State**: Zustand with persistence
- **Auth**: Multi-user with optional passwords  
- **Build**: Electron for desktop distribution

## Key Files

- `src/app/App.jsx` - Main application shell
- `src/shared/stores/useGameStore.js` - Core game state
- `src/features/missions/MissionControl.jsx` - Task management
- `CLAUDE.md` - Development notes and patterns

## Development

See `CLAUDE.md` for detailed development information and coding patterns.