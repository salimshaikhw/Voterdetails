#!/bin/bash

# Deployment script for Linux/Mac

echo "========================================"
echo "Voter Details - Deployment Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi
echo "Dependencies installed successfully!"
echo ""

echo "[2/5] Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "Build completed successfully!"
echo ""

echo "[3/5] Copying deployment files..."
if [ -f "dist/web.config" ]; then
    echo "web.config already exists in dist folder"
else
    echo "web.config copied to dist folder"
fi

if [ -f "dist/.htaccess" ]; then
    echo ".htaccess already exists in dist folder"
else
    echo ".htaccess copied to dist folder"
fi
echo ""

echo "[4/5] Build statistics:"
echo "Output directory: $(pwd)/dist"
du -sh dist/
echo ""

echo "[5/5] Next steps:"
echo "========================================"
echo ""
echo "For Apache/Nginx Deployment:"
echo "1. Copy the contents of 'dist' folder to your web root"
echo "2. Configure your web server (see nginx.conf example)"
echo "3. Update backend API URL in configuration"
echo ""
echo "For Docker Deployment:"
echo "1. Run: docker build -t voterdetails-app ."
echo "2. Run: docker run -p 80:80 voterdetails-app"
echo ""
echo "For cloud deployment (Vercel/Netlify):"
echo "1. Install CLI: npm install -g vercel (or netlify-cli)"
echo "2. Run: vercel (or netlify deploy)"
echo ""
echo "For other deployment options, see DEPLOYMENT.md"
echo "========================================"
echo ""
echo "Deployment files ready in 'dist' folder!"
echo ""
