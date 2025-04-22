// Combined server script for Next.js frontend and health check
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables if dotenv is available
try {
  const dotenv = require('dotenv');
  dotenv.config();
  console.log('Environment variables loaded from .env file');
} catch (error) {
  console.log('Dotenv not available, using process.env directly');
  console.log('Error details:', error.message);
}

console.log('Starting combined server for Next.js frontend + Health Check');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Digital Ocean assigns this port dynamically
const PORT = process.env.PORT || 8080;
console.log(`Using port: ${PORT}`);

// Handle clean shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

// Check if Next.js is already built
if (!fs.existsSync(path.join(__dirname, '.next'))) {
  console.log('No .next directory found, running next build first...');
  const buildProcess = spawn('npx', ['next', 'build'], {
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      startNextjs();
    } else {
      console.error(`Build failed with code ${code}`);
      process.exit(1);
    }
  });
} else {
  startNextjs();
}

function startNextjs() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log(`Starting Next.js in ${isDevelopment ? 'development' : 'production'} mode`);
  
  // Start Next.js
  const command = isDevelopment ? 'next dev' : 'next start';
  const nextApp = spawn('npx', [command, '-p', PORT.toString()], {
    stdio: 'inherit',
    shell: true
  });
  
  nextApp.on('error', (err) => {
    console.error('Failed to start Next.js application:', err);
  });
  
  nextApp.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Next.js process exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Create a health check server on port 8000 - a common port that's usually available
  // This is separate from the Next.js app port
  const HEALTH_PORT = process.env.HEALTH_PORT || 8000;
  
  const healthServer = http.createServer((req, res) => {
    console.log(`Health check received from ${req.socket.remoteAddress}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
  
  healthServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Health check port ${HEALTH_PORT} is already in use, but will continue Next.js startup.`);
      // Just log the error, don't exit - we prioritize the Next.js app
    } else {
      console.error(`Health server error: ${err.message}`);
    }
  });
  
  try {
    healthServer.listen(HEALTH_PORT, '0.0.0.0', () => {
      console.log(`Health check server running on http://0.0.0.0:${HEALTH_PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start health check server: ${err.message}`);
    console.log('Continuing with Next.js startup only');
  }
} 