@echo off
title Control Station OS - Rebuild and Launch
cls

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║                CONTROL STATION OS                        ║
echo  ║           Rebuild and Launch Sequence                    ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

REM Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not detected!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Then run this launcher again.
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js detected - proceeding with build sequence...
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
)

echo [INFO] Building React application...
call npx vite build --silent
if %errorlevel% neq 0 (
    echo [WARNING] npx vite build failed, trying npm run build...
    call npm run build --silent
    if %errorlevel% neq 0 (
        echo [ERROR] React build failed!
        echo [INFO] Trying to install vite globally...
        call npm install -g vite
        call npm run build --silent
        if %errorlevel% neq 0 (
            echo [ERROR] All build attempts failed!
            pause
            exit /b 1
        )
    )
)

echo [INFO] Checking for existing Electron executable...
if exist "release\win-unpacked\Control Station OS.exe" (
    echo [INFO] Found existing executable - launching directly...
    start "" "release\win-unpacked\Control Station OS.exe"
) else (
    echo [INFO] No executable found - building Electron app...
    call npm run pack --silent
    if %errorlevel% neq 0 (
        echo [ERROR] Electron build failed! Trying alternative launch...
        echo [INFO] Starting development server instead...
        start http://localhost:4173
        call npm run preview
        exit /b 0
    )
    echo [INFO] Launching new executable...
    start "" "release\win-unpacked\Control Station OS.exe"
)

echo.
echo [SUCCESS] Control Station OS launched!
echo.
pause