#!/bin/bash

echo "🔍 Verifying Port Configuration Setup"
echo "======================================"
echo ""

# Check frontend constants
echo "✓ Checking frontend/src/constants.js..."
if grep -q "REACT_APP_API_URL" frontend/src/constants.js; then
    echo "  ✅ Environment variable detection configured"
else
    echo "  ❌ Missing REACT_APP_API_URL configuration"
fi

# Check frontend Dockerfile
echo ""
echo "✓ Checking frontend/Dockerfile..."
if grep -q "ARG REACT_APP_API_URL" frontend/Dockerfile; then
    echo "  ✅ Build argument configured"
else
    echo "  ❌ Missing build argument"
fi

# Check docker-compose
echo ""
echo "✓ Checking docker-compose.yml..."
if grep -q "REACT_APP_API_URL" docker-compose.yml; then
    echo "  ✅ Docker Compose environment configured"
else
    echo "  ❌ Missing Docker Compose configuration"
fi

# Check package.json proxy
echo ""
echo "✓ Checking frontend/package.json..."
if grep -q '"proxy": "http://localhost:5000"' frontend/package.json; then
    echo "  ✅ Local development proxy configured"
else
    echo "  ❌ Missing or incorrect proxy configuration"
fi

# Check nginx config
echo ""
echo "✓ Checking frontend/nginx.conf..."
if grep -q "proxy_pass http://fastapi-backend:5000" frontend/nginx.conf; then
    echo "  ✅ Nginx reverse proxy configured"
else
    echo "  ❌ Missing or incorrect nginx configuration"
fi

echo ""
echo "======================================"
echo "📋 Configuration Summary:"
echo ""
echo "Local Development:"
echo "  • Frontend: http://localhost:3000 (React Dev Server)"
echo "  • Backend:  http://localhost:5000 (FastAPI)"
echo "  • Proxy:    package.json proxy setting"
echo ""
echo "Docker Deployment:"
echo "  • Frontend: http://localhost:3000 (Nginx)"
echo "  • Backend:  http://localhost:5000 (FastAPI)"
echo "  • Proxy:    nginx.conf reverse proxy"
echo ""
echo "📚 See ENVIRONMENT_SETUP.md for detailed instructions"
echo "📚 See PORT_SETUP_SUMMARY.md for technical details"
