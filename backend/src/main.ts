import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('Starting NestJS application...');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT || 3001}`);

  try {
    const app = await NestFactory.create(AppModule);
    
    console.log('NestJS application created successfully');
    
    // Enable CORS with all origins for health checks
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    console.log('CORS enabled with all origins');
    
    // Add health check endpoints BEFORE setting global prefix
    // These need to be directly accessible without prefix
    const httpAdapter = app.getHttpAdapter();
    
    // Root level health check for Digital Ocean
    httpAdapter.get('/', (req, res) => {
      res.status(200).send('OK');
    });
    console.log('Root health check endpoint added at /');
    
    // Standard health check path
    httpAdapter.get('/health', (req, res) => {
      res.status(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
    console.log('Health check endpoint added at /health');
    
    // Enable global validation pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('Validation pipe configured');
    
    // Set global prefix for API routes AFTER adding health checks
    app.setGlobalPrefix('api');
    console.log('Global prefix set to /api');
    
    // Start the application on the configured port
    const port = process.env.PORT || 3001;

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://0.0.0.0:${port}/api`);
    console.log(`Health check available at: http://0.0.0.0:${port}/health`);
    console.log(`Root endpoint available at: http://0.0.0.0:${port}/`);
  } catch (error) {
    console.error('Failed to start application:', error);
    throw error;
  }
}

bootstrap()
  .then(() => console.log('Bootstrap process completed'))
  .catch(err => {
    console.error('Bootstrap process failed:', err);
    process.exit(1);
  }); 