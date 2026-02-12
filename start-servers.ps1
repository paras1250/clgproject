# AI Chatbot Builder - Start Servers Script
# This script starts both backend and frontend servers

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Starting AI Chatbot Builder" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  WARNING: backend\.env file not found!" -ForegroundColor Yellow
    Write-Host "   Please create backend\.env with:" -ForegroundColor Gray
    Write-Host "   SUPABASE_URL=your-url" -ForegroundColor Gray
    Write-Host "   SUPABASE_SERVICE_KEY=your-key" -ForegroundColor Gray
    Write-Host "   JWT_SECRET=your-secret" -ForegroundColor Gray
    Write-Host "   HF_API_KEY=your-hf-key" -ForegroundColor Gray
    Write-Host ""
}

# Start Backend
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ Servers Started!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Your App:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📡 Servers:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test User:" -ForegroundColor Magenta
Write-Host "   Email:    test@example.com" -ForegroundColor White
Write-Host "   Password: Test1234" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Please wait 10-15 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host "   Check the PowerShell windows for any errors." -ForegroundColor Gray
Write-Host ""