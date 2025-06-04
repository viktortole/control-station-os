#!/bin/bash
# Control Station OS - Project Cleanup Script
# This script cleans up unnecessary files and organizes the project structure

echo "🧹 Starting Control Station OS Cleanup..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create archive directories if they don't exist
echo -e "${YELLOW}Creating archive directories...${NC}"
mkdir -p archive/old-plans
mkdir -p docs/archive/completed
mkdir -p docs/active/development

# Function to safely move files
move_file() {
    if [ -f "$1" ]; then
        mv "$1" "$2"
        echo -e "${GREEN}✓ Moved: $1 → $2${NC}"
    else
        echo -e "${RED}✗ Not found: $1${NC}"
    fi
}

# Function to safely delete files
delete_file() {
    if [ -f "$1" ]; then
        rm "$1"
        echo -e "${GREEN}✓ Deleted: $1${NC}"
    else
        echo -e "${RED}✗ Not found: $1${NC}"
    fi
}

echo -e "\n${YELLOW}1. Deleting backup and test files...${NC}"
delete_file "src/app/App.jsx.backup"
delete_file "src/app/App-test.jsx"
delete_file "control-station-os@1.0.0"
delete_file "vite"
delete_file "wsl"

echo -e "\n${YELLOW}2. Removing duplicate components...${NC}"
delete_file "src/features/auth/AuthScreen.jsx"
delete_file "src/features/auth/EnhancedAuthScreen.jsx"
delete_file "src/features/auth/SecureUserManager.js"
delete_file "src/features/focus/SimpleFocusGuardian.jsx"

echo -e "\n${YELLOW}3. Moving old planning documents to archive...${NC}"
move_file "IMMEDIATE-ACTION-PLAN.md" "archive/old-plans/"
move_file "FIXES-APPLIED.md" "archive/old-plans/"
move_file "CLEANUP_COMPLETE.md" "archive/old-plans/"
move_file "COMPREHENSIVE-TODO-LIST.md" "archive/old-plans/"
move_file "LARGE_TODO_LIST.md" "archive/old-plans/"
move_file "PROJECT-HEALTH-CHECK.md" "archive/old-plans/"
move_file "ACTIVE-APP-TRACKING-INFO.md" "archive/old-plans/"
move_file "IMPROVEMENTS-SUMMARY.md" "archive/old-plans/"
move_file "READY-TO-SHIP.md" "docs/archive/completed/"

echo -e "\n${YELLOW}4. Creating missing documentation files...${NC}"
if [ ! -f "docs/active/development/CHANGELOG.md" ]; then
    touch "docs/active/development/CHANGELOG.md"
    echo "# Changelog" > "docs/active/development/CHANGELOG.md"
    echo -e "${GREEN}✓ Created: CHANGELOG.md${NC}"
fi

if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
# Control Station OS Environment Variables
# Copy this file to .env and update with your values

# Development
NODE_ENV=development
PORT=5173

# Python Service (optional)
PYTHON_SERVICE_URL=http://localhost:8000

# Feature Flags
ENABLE_PYTHON_BACKEND=false
ENABLE_DEBUG_MODE=true
EOF
    echo -e "${GREEN}✓ Created: .env.example${NC}"
fi

echo -e "\n${YELLOW}5. Updating .gitignore...${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
dist-ssr/
release/
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Testing
coverage/
.nyc_output

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Temporary files
*.tmp
*.temp
*.backup
.cache

# OS files
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
EOF
echo -e "${GREEN}✓ Updated: .gitignore${NC}"

echo -e "\n${YELLOW}6. Creating project status file...${NC}"
cat > docs/active/CURRENT-STATUS.md << 'EOF'
# Control Station OS - Current Status

## Last Updated: $(date +"%Y-%m-%d")

## 🚀 Project Health: 7/10

### ✅ Working Features
- Multi-user authentication system
- Dashboard with XP/Level system
- Focus Guardian (Pomodoro timer)
- Mission Control (Task management)
- Settings and themes
- Local data persistence

### 🐛 Known Issues
- Load time: ~20 seconds (needs optimization)
- Python backend not configured
- Some achievement triggers need verification
- App tracking limited to browser only

### 🎯 Next Priority
1. Performance optimization (reduce load time to <3s)
2. Fix remaining console errors
3. Add proper error handling
4. Implement code splitting
5. Add loading states

### 📊 Metrics
- Bundle Size: 690KB (target: <300KB)
- Test Coverage: 0% (target: 90%)
- Load Time: 20s (target: <3s)
- Active Users: N/A
EOF
echo -e "${GREEN}✓ Created: CURRENT-STATUS.md${NC}"

echo -e "\n${YELLOW}7. Cleaning up unused npm packages...${NC}"
echo "Run 'npm prune' to remove unused packages"

echo -e "\n${GREEN}✅ Cleanup Complete!${NC}"
echo -e "\nSummary:"
echo "- Deleted backup and test files"
echo "- Removed duplicate components"
echo "- Organized documentation"
echo "- Created missing config files"
echo "- Updated .gitignore"

echo -e "\n${YELLOW}Recommended next steps:${NC}"
echo "1. Run 'npm prune' to clean dependencies"
echo "2. Run 'npm run build' to test the build"
echo "3. Commit these changes to version control"
echo "4. Start working on performance optimizations"