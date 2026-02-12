# Stop both backend and frontend servers
# Run this script from the project root directory

Write-Host "Stopping AI Chatbot Builder servers..." -ForegroundColor Yellow
Write-Host ""

# Find and stop processes on ports 3000 and 5000
$ports = @(3000, 5000)

foreach ($port in $ports) {
    $connections = netstat -ano | Select-String -Pattern ":$port\s+.*LISTENING"
    
    foreach ($connection in $connections) {
        $pid = ($connection -split '\s+')[-1]
        if ($pid -and $pid -match '^\d+$') {
            try {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Stopping process on port $port (PID: $pid)..." -ForegroundColor Yellow
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "✓ Stopped process on port $port" -ForegroundColor Green
                }
            } catch {
                Write-Host "Could not stop process on port $port (PID: $pid)" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "Done! Servers have been stopped." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

