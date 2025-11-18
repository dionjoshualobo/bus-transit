@echo off
echo Installing dependencies...
call npm install
cd frontend
call npm install
cd ..

echo.
echo Starting both backend and frontend...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
npm run dev:all

pause
