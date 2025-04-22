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
}

console.log('Starting combined server for Next.js frontend + Health Check');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Start health check server
const healthServer = http.createServer((req, res) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

// Get port from environment or use default
const HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8080', 10);
const APP_PORT = parseInt(process.env.PORT || '3000', 10);

healthServer.listen(HEALTH_PORT, '0.0.0.0', () => {
  console.log(`Health check server running on http://0.0.0.0:${HEALTH_PORT}`);
});

// Handle clean shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});

// Start the Next.js app directly with next start/dev
const isDevelopment = process.env.NODE_ENV === 'development';
console.log(`Starting Next.js in ${isDevelopment ? 'development' : 'production'} mode on port ${APP_PORT}`);

// Check if .next directory exists
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
  // Start Next.js using either next start or next dev
  const command = isDevelopment ? 'next dev' : 'next start';
  const nextApp = spawn('npx', [command, '-p', APP_PORT.toString()], {
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
} 