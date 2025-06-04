#!/bin/bash
# Start all Control Station OS services

echo "🚀 Starting Control Station OS Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in WSL
if grep -qEi "(Microsoft|WSL)" /proc/version &> /dev/null ; then
    echo -e "${GREEN}✓ WSL environment detected${NC}"
fi

# Start Node.js development server
echo -e "\n${YELLOW}Starting Frontend Server...${NC}"
cd /mnt/f/CODING/"Control Station OS_v03"/control-station-os
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Frontend server starting on http://localhost:5173${NC}"
echo -e "${YELLOW}Note: Python backend service not configured - Focus Guardian will run in offline mode${NC}"

# Keep script running
echo -e "\n${GREEN}All services started!${NC}"
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo -e '\n${RED}Stopping services...${NC}'; kill $FRONTEND_PID 2>/dev/null; exit" INT

# Keep the script running
while true; do
    sleep 1
done