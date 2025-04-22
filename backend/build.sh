#!/bin/bash

echo "Starting backend build process..."

# Ensure dist directory exists
mkdir -p dist

# Clean dist directory
echo "Cleaning dist directory..."
npx rimraf dist

# Build the NestJS application
echo "Building NestJS application..."
npx nest build

# Check if the main.js file was generated
if [ -f "dist/main.js" ]; then
  echo "✅ main.js found"
else
  echo "❌ main.js not found"
  exit 1
fi

echo "Build completed successfully!" 