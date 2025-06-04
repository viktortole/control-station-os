@echo off
title Control Station OS - Military-Grade Productivity System
cls

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║                                                      ║
echo  ║              CONTROL STATION OS                      ║
echo  ║         Military-Grade Productivity System           ║
echo  ║                                                      ║
echo  ║  Status: LAUNCHING TACTICAL INTERFACE...            ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

REM Check if the executable exists
if not exist "release\win-unpacked\Control Station OS.exe" (
    echo [ERROR] Control Station OS executable not found!
    echo.
    echo The app needs to be built first.
    echo If you have Node.js installed, you can build it by running:
    echo   npm install
    echo   npm run build
    echo   npm run pack
    echo.
    echo Alternatively, download the pre-built version.
    echo.
    pause
    exit /b 1
)

REM Show file timestamp for debugging
echo [DEBUG] Executable timestamp:
dir "release\win-unpacked\Control Station OS.exe" | find "Control Station OS.exe"
echo.

echo [INFO] Launching Control Station OS...
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║                                                      ║
echo  ║          CONTROL STATION OS - READY                 ║
echo  ║                                                      ║
echo  ║  🎯 Windows application launching...                 ║
echo  ║  💀 Punishment system active                        ║
echo  ║  🏆 XP tracking enabled                             ║
echo  ║                                                      ║
echo  ║  ⚠️  Close this window to exit the application      ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

REM Launch the executable
start "" "release\win-unpacked\Control Station OS.exe"

echo [SUCCESS] Control Station OS launched successfully!
echo.
echo Application is now running as a Windows desktop app.
echo You can close this window safely.
echo.
pause