import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get('detailed')
  checkDetailed() {
    const env = this.configService.get('NODE_ENV') || 'development';
    
    return {
      status: 'ok',
      environment: env,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      database: {
        configured: !!this.configService.get('DB_HOST')
      }
    };
  }

  // Keep the simple health check for compatibility
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
} 