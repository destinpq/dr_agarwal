import * as http from 'http';
import { AddressInfo } from 'net';

// Minimal health check server
const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log(`Health check received from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

const PORT: number = parseInt(process.env.PORT || '8081', 10);
server.listen(PORT, '0.0.0.0', () => {
  const address = server.address() as AddressInfo;
  console.log(`Health check server running on http://${address.address}:${address.port}`);
  console.log('Server details:', address);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0)); 