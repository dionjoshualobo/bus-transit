# Run both backend and frontend
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Starting both backend and frontend..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

npm run dev:all

Read-Host "Press Enter to exit"
