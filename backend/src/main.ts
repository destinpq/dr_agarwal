import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting NestJS application...');
  logger.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  logger.log(`PORT: ${process.env.PORT || 3001}`);
  logger.log(`HOST: ${process.env.HOST || '0.0.0.0'}`);

  try {
    // Force binding to IPv4 through NODE_OPTIONS
    process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      abortOnError: false,
    });
    
    logger.log('NestJS application created successfully');
    
    // Enable CORS with all origins for health checks
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    logger.log('CORS enabled with all origins');
    
    // Add health check endpoints BEFORE setting global prefix
    // These need to be directly accessible without prefix
    const httpAdapter = app.getHttpAdapter();
    
    // IMPORTANT: Make health checks extremely simple and fast
    
    // Root level health check for Digital Ocean
    httpAdapter.get('/', (req, res) => {
      logger.debug(`Health check hit at / from ${req.ip}`);
      res.status(200).send('OK');
    });
    logger.log('Root health check endpoint added at /');
    
    // Standard health check path
    httpAdapter.get('/health', (req, res) => {
      logger.debug(`Health check hit at /health from ${req.ip}`);
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
      });
    });
    logger.log('Health check endpoint added at /health');
    
    // Enable global validation pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    logger.log('Validation pipe configured');
    
    // Set global prefix for API routes AFTER adding health checks
    app.setGlobalPrefix('api');
    logger.log('Global prefix set to /api');
    
    // Start the application on the configured port
    const port = parseInt(process.env.PORT || '3001', 10);
    
    // Force IPv4 binding and listen on all interfaces
    const server = await app.listen(port, '0.0.0.0', () => {
      logger.log(`Server listening on port ${port} on all interfaces (0.0.0.0)`);
    });
    
    // Increase keep-alive timeout to prevent premature connection closing
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // slightly higher than keepAliveTimeout
    
    logger.log(`Application is running on: http://0.0.0.0:${port}/api`);
    logger.log(`Health check available at: http://0.0.0.0:${port}/health`);
    logger.log(`Root endpoint available at: http://0.0.0.0:${port}/`);
    
    // After successful startup, log network interfaces for debugging
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    logger.log('Network interfaces available:');
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4') {
          logger.log(`Interface: ${name}, Address: ${net.address}`);
        }
      }
    }
  } catch (error) {
    logger.error('Failed to start application:', error);
    throw error;
  }
}

// Handle process termination signals properly
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

bootstrap()
  .then(() => console.log('Bootstrap process completed successfully'))
  .catch(err => {
    console.error('Bootstrap process failed:', err);
    process.exit(1);
  }); 