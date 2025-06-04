# Control Station OS - Claude Code Project Memory

## Project Overview
Control Station OS is a punishment-based productivity system built with React, Vite, and Tailwind CSS. The app uses fear and consequences to drive productivity through XP loss, level demotion, and visual pressure systems.

## Core Philosophy
- **NOT a game** - This is a military-grade productivity system
- **Punishment over rewards** - Fear motivates better than encouragement  
- **Real consequences** - Levels DROP, XP goes NEGATIVE
- **Military aesthetic** - Tactical UI throughout
- **Local-first** - No cloud, user owns data

## Architecture
```
src/
├── components/     # Shared UI components (4 files, ~3,000 lines)
├── modules/        # Feature modules (modular architecture)
│   ├── MissionControl/  # Task management module
│   └── [Future modules...]
├── core/          # Business logic (auth, punishment)
├── stores/        # Zustand state management
├── config/        # Themes and configuration
└── App.jsx        # Main application
```

## Key Systems

### Authentication
- **Multi-user system** via `UserManager.js` with full data isolation
- **Secure registration/login** with optional password protection
- **Session management** with `useAuthStore.js` for state persistence
- **Profile system** with specializations, ranks, and security clearances
- **Debug commands** for testing: `debug.register()`, `debug.login()`, `debug.users()`

### Game Mechanics
- **Fixed XP**: 25/50/100 XP (NO random multipliers)
- **Punishment**: -10 to -50 XP for failures
- **Levels**: Can DROP when XP decreases
- **Tree Health**: Visual pressure (healthy → warning → dying)

### State Management
- `useGameStore.js`: Game state with user isolation
- `useAuthStore.js`: Authentication state
- Zustand with persistence middleware

## Development Workflow

### Starting Development
```bash
# Windows users: Use WSL
wsl
cd /mnt/f/CODING/"Control Station OS_v03"/control-station-os
./start.sh

# Linux/Mac:
npm run dev
```

### Key Commands
- `debug.xp(100)` - Add XP for testing
- `debug.stats()` - View all statistics
- `debug.user()` - Current user info
- `debug.switch('name')` - Switch users

### File Organization Rules
- Max 5 files per component folder
- Single responsibility per file
- Military naming conventions
- No deep nesting

### Code Style
- TypeScript-style JSDoc comments
- Consistent military theming
- Component composition over inheritance
- Predictable, not clever code

## CRITICAL: Claude Code Development Guidelines

### 🚨 BEST PRACTICES FOR CLAUDE CODE

#### 1. **File Size Guidelines**
- **Prefer smaller, focused files** but be pragmatic
- Consider splitting when files become hard to navigate (1000+ lines)
- Current large files to consider refactoring:
  - `MissionControl.jsx` (1500+ lines) - Could benefit from component extraction
  - `useGameStore.js` (1400+ lines) - Could be modularized if needed
  - Balance readability with practicality

#### 2. **Context First - ALWAYS**
- **NEVER write code without reading relevant files first**
- Use `Read`, `Grep`, and `Task` tools to understand the codebase
- If unsure about implementation, read MORE files, don't guess
- Minimum context gathering:
  - Read the file you're modifying
  - Check imports and dependencies
  - Understand the component/module structure

#### 3. **No Dummy Implementations**
- **EVERY line of code must be functional**
- No placeholders, no "TODO: implement later"
- No mock data unless explicitly requested
- If you can't implement it fully, ask for clarification

#### 4. **Fix Errors Properly**
- **NEVER switch libraries to avoid syntax errors**
- If something doesn't work, debug and fix it
- Don't suggest alternative approaches just because of an error
- Common anti-patterns to avoid:
  - "Let's use X library instead" when Y has a syntax error
  - "Here's a simpler implementation" when the complex one has bugs

#### 5. **Clarify Broad Tasks**
- **ASK for specifics when tasks are vague**
- When given "improve it more", respond with:
  - "What specific aspect needs improvement?"
  - "Which feature should I focus on?"
  - "What's the exact problem you're trying to solve?"
- Help break large tasks into smaller, concrete steps

### 🎯 ULTRATHINK Approach
Before ANY code changes:
1. **ANALYZE** - What's really needed? Read the context
2. **PLAN** - Break it into clear, small steps
3. **EXECUTE** - Follow each step precisely
4. **REVIEW** - Is this the best solution? Is the file too large?

### 📏 Potential Refactoring Opportunities
1. **MissionControl.jsx** - Consider extracting if performance issues arise:
   - Mission list rendering logic
   - Filter and analytics components
   - Template management

2. **useGameStore.js** - Consider splitting if state management becomes complex:
   - XP and level management
   - Task/mission operations
   - Achievement tracking
   - Statistics calculations

## Recent Fixes Applied
1. **✅ Import Paths Fixed**: Corrected ALL relative import paths across entire codebase
2. **✅ Feature-Based Architecture**: Reorganized into feature-based structure
3. **✅ Development Server**: Now starts successfully on WSL
4. **✅ File Structure**: All imports properly reference new directory structure
5. **✅ Clean Architecture**: Removed duplicates and organized files
6. **✅ ESLint Compliance**: Fixed switch statement braces and case declarations
7. **✅ Vite Compatibility**: Replaced process.env.NODE_ENV with import.meta.env.DEV
8. **✅ Hook Dependencies**: Added missing dependencies to useEffect hooks
9. **✅ Unused Variables**: Cleaned up unused imports and variables
10. **✅ Build Validation**: Production build completes successfully (141KB main JS, 86KB CSS)
11. **✅ Complete Import Fix**: Fixed 21 files with import path errors after reorganization
12. **✅ Compact Auth Screen**: Replaced massive registration form with streamlined mobile-friendly design
13. **✅ 10% Size Reduction**: Made registration form even more compact to fit at 100% browser zoom
14. **✅ Authentication System Overhaul**: Fixed UserManager.register error and rebuilt entire auth flow
15. **✅ Secure Multi-User System**: Complete registration/login with password protection and data isolation
16. **✅ Production-Ready Auth**: Full integration between UserManager, AuthStore, and UI components

## Current Status
- **Server**: Running on http://localhost:5174/
- **Build**: Production build working (690KB total assets, optimized chunks)
- **Authentication**: Fully working registration/login system with security features
- **ESLint**: Major issues fixed, minor warnings remain
- **Architecture**: Feature-based V03 with clean separation of concerns
- **Performance**: Fast builds (2s dev, 35s production)
- **Ready for**: Full production deployment and user testing

## Testing Strategy
- Manual testing through debug commands
- User flow testing with multiple commanders
- Performance testing on older devices
- Cross-platform compatibility (WSL vs native)

## Deployment Readiness
- [x] Clean file structure
- [x] Removed duplicates
- [x] Fixed imports
- [x] WSL compatibility
- [ ] Production build testing
- [ ] Performance optimization

## Next Features (Future)
- Focus timer with pomodoro
- Advanced statistics dashboard
- Team features (optional)
- Cloud sync (optional)

## Debug Checklist
When debugging issues:
1. Check browser console for errors
2. Verify user data isolation with `debug.users()`
3. Test XP calculations with `debug.xp()`
4. Confirm theme application
5. Test punishment system if enabled

---
*"Control your station, don't let it control you"* - Project motto

# ⚠️ IMPORTANT INSTRUCTION REMINDERS ⚠️

## DO WHAT HAS BEEN ASKED - NOTHING MORE, NOTHING LESS

1. **NEVER create files unless absolutely necessary** - Prefer editing existing files
2. **ALWAYS prefer editing an existing file to creating a new one**
3. **NEVER proactively create documentation files (*.md) or README files**
4. **Only create documentation if EXPLICITLY requested**

## BEFORE WRITING ANY CODE:
- ✅ Did I read the relevant files first?
- ✅ Is this file getting too large (>300 lines)?
- ✅ Am I fixing the actual problem or avoiding it?
- ✅ Is the task specific enough or should I ask for clarification?
- ✅ Am I adding real, working code (no placeholders)?

**REMEMBER: ULTRATHINK before acting. Quality over speed. Precision over assumptions.**