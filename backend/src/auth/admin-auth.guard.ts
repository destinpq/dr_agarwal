import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    
    // Get the API key from the request headers
    const apiKey = request.headers['x-admin-key'];
    
    if (!apiKey) {
      throw new UnauthorizedException('Admin API key is required');
    }
    
    if (apiKey !== adminPassword) {
      throw new UnauthorizedException('Invalid admin API key');
    }
    
    return true;
  }
} 