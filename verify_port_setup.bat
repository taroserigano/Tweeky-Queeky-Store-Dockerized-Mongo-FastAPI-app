@echo off
echo.
echo 🔍 Verifying Port Configuration Setup
echo ======================================
echo.

echo ✓ Checking frontend/src/constants.js...
findstr /C:"REACT_APP_API_URL" frontend\src\constants.js >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Environment variable detection configured
) else (
    echo   ❌ Missing REACT_APP_API_URL configuration
)

echo.
echo ✓ Checking frontend/Dockerfile...
findstr /C:"ARG REACT_APP_API_URL" frontend\Dockerfile >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Build argument configured
) else (
    echo   ❌ Missing build argument
)

echo.
echo ✓ Checking docker-compose.yml...
findstr /C:"REACT_APP_API_URL" docker-compose.yml >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Docker Compose environment configured
) else (
    echo   ❌ Missing Docker Compose configuration
)

echo.
echo ✓ Checking frontend/package.json...
findstr /C:"proxy" frontend\package.json >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Local development proxy configured
) else (
    echo   ❌ Missing or incorrect proxy configuration
)

echo.
echo ✓ Checking frontend/nginx.conf...
findstr /C:"proxy_pass" frontend\nginx.conf >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Nginx reverse proxy configured
) else (
    echo   ❌ Missing or incorrect nginx configuration
)

echo.
echo ======================================
echo 📋 Configuration Summary:
echo.
echo Local Development:
echo   • Frontend: http://localhost:3000 (React Dev Server)
echo   • Backend:  http://localhost:5000 (FastAPI)
echo   • Proxy:    package.json proxy setting
echo.
echo Docker Deployment:
echo   • Frontend: http://localhost:3000 (Nginx)
echo   • Backend:  http://localhost:5000 (FastAPI)
echo   • Proxy:    nginx.conf reverse proxy
echo.
echo 📚 See ENVIRONMENT_SETUP.md for detailed instructions
echo 📚 See PORT_SETUP_SUMMARY.md for technical details
echo.
pause
