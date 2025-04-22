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
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Start health check server
const healthServer = http.createServer((req, res) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

// Digital Ocean expects health checks on port 8080
const HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8080', 10);
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

// Start the Next.js app
function startNextApp() {
  try {
    console.log('Starting Next.js application...');
    
    // Use the correct start command based on build output
    const standaloneDir = path.join(__dirname, '.next', 'standalone');
    const hasStandalone = fs.existsSync(standaloneDir);
    
    if (hasStandalone) {
      console.log('Using standalone server.js');
      
      // If we're in Digital Ocean, check if we need to patch the standalone server
      if (fs.existsSync('/workspace')) {
        console.log('Digital Ocean environment detected, adjusting paths...');
        
        // Set the NODE_ENV and PORT for the standalone server
        process.env.NODE_ENV = 'production';
        process.env.PORT = '3001';
        
        try {
          // Add a synthetic "chdir" since we're in the Digital Ocean environment
          const originalCwd = process.cwd();
          process.chdir = function(directory) {
            console.log(`Intercepted chdir call to ${directory}, staying in ${originalCwd}`);
            return originalCwd;
          };
        } catch (error) {
          console.error('Failed to patch chdir:', error);
        }
      }
      
      // Require the standalone server.js
      const standaloneServerPath = path.join(standaloneDir, 'server.js');
      console.log(`Loading standalone server from ${standaloneServerPath}`);
      require(standaloneServerPath);
    } else {
      console.log('Using next start command');
      // Start Next.js using next start (development mode)
      const nextApp = spawn('npx', ['next', 'start', '-p', '3001'], {
        stdio: 'inherit',
        shell: true
      });
      
      nextApp.on('error', (err) => {
        console.error('Failed to start Next.js application:', err);
      });
    }
  } catch (error) {
    console.error('Error starting Next.js app:', error);
  }
}

// Start the Next.js app
startNextApp(); 