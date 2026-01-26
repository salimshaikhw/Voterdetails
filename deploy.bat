@echo off
REM Deployment script for Windows

echo ========================================
echo Voter Details - Deployment Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies!
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [2/5] Building application for production...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    exit /b 1
)
echo Build completed successfully!
echo.

echo [3/5] Copying deployment files...
copy /Y web.config dist\web.config >nul 2>nul
if exist "dist\web.config" (
    echo web.config copied to dist folder
) else (
    echo WARNING: web.config not copied - may already exist in dist
)

copy /Y .htaccess dist\.htaccess >nul 2>nul
if exist "dist\.htaccess" (
    echo .htaccess copied to dist folder
)
echo.

echo [4/5] Build statistics:
echo Output directory: %CD%\dist
dir dist /s | find "File(s)"
echo.

echo [5/5] Next steps:
echo ========================================
echo.
echo For IIS Deployment:
echo 1. Copy the contents of 'dist' folder to your IIS website directory
echo 2. Ensure URL Rewrite module is installed in IIS
echo 3. Configure your backend API URL
echo.
echo For Docker Deployment:
echo 1. Run: docker build -t voterdetails-app .
echo 2. Run: docker run -p 80:80 voterdetails-app
echo.
echo For other deployment options, see DEPLOYMENT.md
echo ========================================
echo.
echo Deployment files ready in 'dist' folder!
echo.
pause
