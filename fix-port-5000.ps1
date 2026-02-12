# Fix Port 5000 Script
# Kills any process using port 5000

Write-Host "Finding process on port 5000..." -ForegroundColor Yellow

$connection = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess | Select-Object -First 1
    
    Write-Host "Found process ID: $processId" -ForegroundColor Cyan
    
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Process: $($process.ProcessName) (PID: $processId)" -ForegroundColor White
        Write-Host "Stopping process..." -ForegroundColor Yellow
        
        Stop-Process -Id $processId -Force
        
        Write-Host "Process stopped!" -ForegroundColor Green
    }
} else {
    Write-Host "No process found on port 5000" -ForegroundColor Gray
    Write-Host "Port may already be free." -ForegroundColor Gray
}

Write-Host ""
Write-Host "You can now start your backend with: npm run dev" -ForegroundColor Cyan
Write-Host ""

