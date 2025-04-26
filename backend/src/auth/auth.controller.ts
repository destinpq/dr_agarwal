import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminAuthDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Post('admin')
  async adminAuth(@Body() adminAuthDto: AdminAuthDto) {
    try {
      this.authService.validateAdminPassword(adminAuthDto.password);
      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid admin password');
    }
  }
} 