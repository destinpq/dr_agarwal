import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Registration } from './registration.entity';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration]),
    MulterModule.register({
      dest: './uploads',
    }),
    WhatsAppModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {} 