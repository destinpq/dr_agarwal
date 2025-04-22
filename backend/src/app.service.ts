import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Dr. Agarwal Workshop Registration API';
  }
} 