// Combined server script for Next.js frontend and health check
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

// Load environment variables if dotenv is available
try {
  const dotenv = require('dotenv');
  dotenv.config();
  console.log('Environment variables loaded from .env file');
} catch (err) {
  console.log('Dotenv not available, using process.env directly');
}

console.log('Starting combined server for Next.js frontend + Health Check');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// Get ports from environment or use defaults with fallbacks
const PRIMARY_HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8080', 10);
const FALLBACK_HEALTH_PORTS = [8081, 8082, 8083, 8084, 8085];
const APP_PORT = parseInt(process.env.PORT || '3000', 10);

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true))
          .close();
      })
      .listen(port, '0.0.0.0');
  });
}

// Start health check server on an available port
async function startHealthServer() {
  let healthPort = PRIMARY_HEALTH_PORT;
  
  // First try the primary port
  if (await isPortAvailable(healthPort)) {
    startHealthServerOnPort(healthPort);
    return;
  }
  
  console.log(`Health port ${healthPort} is not available, trying fallback ports...`);
  
  // Try fallback ports
  for (const port of FALLBACK_HEALTH_PORTS) {
    if (await isPortAvailable(port)) {
      console.log(`Using fallback health port: ${port}`);
      startHealthServerOnPort(port);
      return;
    }
  }
  
  // If we reach here, no ports were available
  console.error('Could not find an available port for health check server');
  process.exit(1);
}

function startHealthServerOnPort(port) {
  const healthServer = http.createServer((req, res) => {
    console.log(`Health check received from ${req.socket.remoteAddress}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
  
  healthServer.on('error', (e) => {
    console.error(`Health server error: ${e.message}`);
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please use a different port.`);
    }
  });
  
  healthServer.listen(port, '0.0.0.0', () => {
    console.log(`Health check server running on http://0.0.0.0:${port}`);
  });
}

// Start health server
startHealthServer();

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