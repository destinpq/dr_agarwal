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

// On Digital Ocean, we get an assigned port via environment variables
// This port will be used for both the health check and the Next.js app
const PORT = parseInt(process.env.PORT || '3000', 10);

// Create a combined HTTP server that will handle both health checks and proxy to Next.js
const server = http.createServer((req, res) => {
  // Simple path-based router
  if (req.url === '/health' || req.url === '/') {
    // Health check endpoint
    console.log(`Health check received from ${req.socket.remoteAddress}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    // For all other requests, proxy to Next.js
    // This is handled by the Next.js app directly in production mode
    // In development mode, we'd need to configure a proxy here
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Handle startup errors gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please ensure no other services are running on this port.`);
    console.error('If running on Digital Ocean, try requesting a different port from their support team.');
  } else {
    console.error(`Server error: ${err.message}`);
  }
  process.exit(1);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running on http://0.0.0.0:${PORT}`);
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
console.log(`Starting Next.js in ${isDevelopment ? 'development' : 'production'} mode`);

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
  // Use a different port for Next.js in development mode to avoid conflicts
  // In production, use the assigned port from process.env.PORT
  const command = isDevelopment ? 'next dev' : 'next start';
  const args = isDevelopment 
    ? [command, '-p', '3001'] // Use a different port for dev mode
    : [command, '-p', PORT.toString()]; // Use assigned port in production
  
  const nextApp = spawn('npx', args, {
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