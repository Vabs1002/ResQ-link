@echo off
echo =======================================================
echo          ResqLink Final End-to-End Demo Starter
echo =======================================================
echo.

echo 1. Stopping any stray background servers to prevent crashes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2. Starting Unified State Engine (Backend)...
start "AI State Engine (Port 3000)" cmd /k "cd state-engine && node server.js"

echo 3. Starting Modern Web Command Dashboard...
start "Web Dashboard (Port 8080)" cmd /k "cd web-dashboard && python -m http.server 8080"

echo 4. Starting Next.js Mobile Web Interface...
start "Mobile React App (Port 3001)" cmd /k "cd ui-source && npm run dev -- -p 3001"

echo 5. Generating QR Network Tunnel for Physical Phone...
start "QR Remote Access Tunnel" cmd /k "cd ui-source && node tunnel.js"

echo.
echo All 4 tactical subsystems are booting up!
echo -------------------------------------------------------
echo [LAPTOP]: Open your laptop browser to http://localhost:8080
echo [PHONE]: Scan the giant QR code popping up in the Tunnel terminal!
echo -------------------------------------------------------
echo.
pause
