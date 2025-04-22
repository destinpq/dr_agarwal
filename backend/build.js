#!/usr/bin/env node

/**
 * This is a simple build script that runs the NestJS CLI build command.
 * It exists for compatibility with deployment systems that might be looking
 * for a build.js file based on the package.json configuration.
 */

const { execSync } = require('child_process');

console.log('Building NestJS application...');

try {
  // Run the NestJS CLI build command
  execSync('npx nest build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 