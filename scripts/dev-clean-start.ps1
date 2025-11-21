<#
Control Station OS - Clean start helper for Windows PowerShell.

What it does:
- Kills Electron processes and anything listening on the dev ports (default 5173/5175, plus 8000 if backend requested).
- Starts the Vite dev server and Electron app (and optionally the FastAPI backend) in fresh shells.

Usage (from repo root):
  powershell -ExecutionPolicy Bypass -File scripts/dev-clean-start.ps1

Flags:
  -NoFrontend    Skip starting the Vite dev server.
  -NoElectron    Skip starting Electron.
  -StartBackend  Also start the FastAPI backend on port 8000.
#>

param(
  [switch]$NoFrontend,
  [switch]$NoElectron,
  [switch]$StartBackend
)

$root = Resolve-Path "$PSScriptRoot\.."
$portsToClear = @(5173, 5175)
if ($StartBackend) { $portsToClear += 8000 }

function Stop-ByPort {
  param([int[]]$Ports)
  foreach ($port in $Ports) {
    try {
      $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
      if (-not $conns) {
        Write-Host "Port ${port}: free"
        continue
      }
      $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
      foreach ($procId in $pids) {
        try {
          $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
          if ($proc) {
            Write-Host "Port ${port}: stopping PID $procId ($($proc.ProcessName))"
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
          } else {
            Write-Host "Port ${port}: PID $procId no longer exists"
          }
        } catch {
          Write-Warning "Port ${port}: failed to stop PID $procId - $($_.Exception.Message)"
        }
      }
    } catch {
      Write-Warning "Port ${port}: unable to inspect - $($_.Exception.Message)"
    }
  }
}

function Stop-ProcessSafe {
  param([string]$Name)
  $procs = Get-Process -Name $Name -ErrorAction SilentlyContinue
  if ($procs) {
    foreach ($p in $procs) {
      Write-Host "Stopping $Name (PID $($p.Id))"
      Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
    }
  } else {
    Write-Host "$Name : none running"
  }
}

Write-Host "==== Control Station OS clean start ===="
Write-Host "Repo: $root"
Write-Host "Ensuring dev ports are clear: $($portsToClear -join ', ')"

# Clean up old processes
Stop-ProcessSafe -Name "electron"
Stop-ByPort -Ports $portsToClear

# Start frontend dev server
if (-not $NoFrontend) {
  Write-Host "Starting Vite dev server (npm run dev)..."
  $frontendCmd = "Set-Location '$root'; npm run dev"
  Start-Process -FilePath "powershell" -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-Command",$frontendCmd `
    -WorkingDirectory $root -WindowStyle Minimized
} else {
  Write-Host "Skipping frontend start (-NoFrontend set)"
}

# Start backend (optional)
if ($StartBackend) {
  Write-Host "Starting FastAPI backend (uvicorn)..."
  Start-Process -FilePath "python" -ArgumentList "-m","uvicorn","backend.main:app","--app-dir","backend","--reload" `
    -WorkingDirectory $root -WindowStyle Minimized
}

# Start Electron
if (-not $NoElectron) {
  Write-Host "Starting Electron (DEV)..."
  $electronCmd = "`$env:ELECTRON_IS_DEV='true'; `$env:VITE_DEV_SERVER_URL='http://localhost:5173'; Set-Location '$root'; npm run electron"
  Start-Process -FilePath "powershell" -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-Command",$electronCmd `
    -WorkingDirectory $root
} else {
  Write-Host "Skipping Electron start (-NoElectron set)"
}

Write-Host "Done. Check new terminal windows for server logs."
