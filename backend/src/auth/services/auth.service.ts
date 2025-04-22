import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  validateAdminPassword(password: string): boolean {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (!password || password !== adminPassword) {
      throw new UnauthorizedException('Invalid admin password');
    }
    return true;
  }
} 