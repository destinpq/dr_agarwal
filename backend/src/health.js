const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Log all interfaces
const os = require('os');
const nets = os.networkInterfaces();
console.log('Network interfaces:');
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4') {
      console.log(`${name}: ${net.address}`);
    }
  }
}

// Handle termination
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  process.exit(0);
}); 