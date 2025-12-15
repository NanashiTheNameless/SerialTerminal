#!/bin/bash

# Build SerialTerminal for all platforms using Electron
# Electron uses Chromium on all platforms, so WebSerial API works everywhere

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
fi

# Build for all platforms
echo "Building for Linux (deb, rpm, AppImage)..."
yarn build:linux

echo "Building for Windows (x64, arm64)..."
yarn build:win

echo "Building for macOS (universal)..."
yarn build:mac

echo ""
echo "Build complete! Check the 'dist' directory for installers."
ls -lh dist/
