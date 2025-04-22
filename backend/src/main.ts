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
    
    // Enable CORS
    app.enableCors();
    console.log('CORS enabled');
    
    // Enable global validation pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('Validation pipe configured');
    
    // Set global prefix
    app.setGlobalPrefix('api');
    console.log('Global prefix set to /api');
    
    // Start the application on the configured port
    const port = process.env.PORT || 3001;
    
    // Add a basic health check endpoint for Digital Ocean App Platform
    app.getHttpAdapter().get('/health', (req, res) => {
      res.status(200).send('OK');
    });
    console.log('Health check endpoint added at /health');

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
    console.log(`Health check available at: http://localhost:${port}/health`);
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