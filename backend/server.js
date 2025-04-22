/**
 * This is a simple wrapper to load the compiled NestJS application
 * It's useful for platforms that look for a server.js entry point
 */

// Combined server script for NestJS backend and health check
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('Starting combined server for NestJS backend + Health Check');

// Start health check server
const healthServer = http.createServer((req, res) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

const HEALTH_PORT = parseInt(process.env.PORT || '8080', 10);
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
    const mainJsPath = path.join(__dirname, 'dist', 'main.js');
    if (fs.existsSync(mainJsPath)) {
      console.log(`Found main.js at ${mainJsPath}`);
      
      // Set environment variables
      process.env.NODE_ENV = 'production';
      
      // Default API port to 3000 if not set
      if (!process.env.API_PORT) {
        process.env.API_PORT = '3000';
      }
      
      console.log(`Starting NestJS on port ${process.env.API_PORT}`);
      
      // Load the NestJS app
      require('./dist/main');
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