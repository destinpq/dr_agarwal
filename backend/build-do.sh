#!/bin/bash

# Custom build script for Digital Ocean App Platform
# This script performs a clean npm install instead of using npm ci

echo "Running custom build script for Dr. Agarwal backend..."

# Remove package-lock.json if it exists
if [ -f package-lock.json ]; then
  echo "Removing existing package-lock.json..."
  rm package-lock.json
fi

# Install dependencies (this will generate a new package-lock.json)
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!" 