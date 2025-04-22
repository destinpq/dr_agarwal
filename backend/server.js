/**
 * This is a simple wrapper to load the compiled NestJS application
 * It's useful for platforms that look for a server.js entry point
 */

// Combined server script for NestJS backend and health check
const http = require('http');
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

console.log('Starting combined server for NestJS backend + Health Check');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Start health check server
const healthServer = http.createServer((req, res) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

// Digital Ocean expects health checks on port 8081
const HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8081', 10);
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

// Start the NestJS app
function startNestJSApp() {
  try {
    console.log('Starting NestJS application...');
    
    // Check if the main.js file exists
    const mainJsPath = path.join(__dirname, 'dist', 'src', 'main.js');
    if (fs.existsSync(mainJsPath)) {
      console.log(`Found main.js at ${mainJsPath}`);
      
      // Set environment variables
      process.env.NODE_ENV = process.env.NODE_ENV || 'production';
      
      // Use the PORT from .env for the main API (default to 3000 if not set)
      const apiPort = process.env.PORT || '3000';
      process.env.API_PORT = apiPort;
      
      console.log(`Starting NestJS on port ${apiPort}`);
      
      // Load the NestJS app
      require('./dist/src/main');
      console.log('NestJS application started successfully');
    } else {
      console.error(`Error: Could not find ${mainJsPath}`);
      console.log('Make sure to run: npm run build');
    }
  } catch (error) {
    console.error('Error starting NestJS app:', error);
  }
}

// Start the NestJS app
startNestJSApp(); 