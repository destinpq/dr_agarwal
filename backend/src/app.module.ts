import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ContentModule } from './content/content.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { RegistrationModule } from './registration/registration.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database - conditionally loaded
    ...getDatabaseModule(),
    
    // Email module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST', 'smtp.gmail.com'),
          port: configService.get('EMAIL_PORT', 465),
          secure: true,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get('EMAIL_FROM', '"Dr. Agarwal Workshop" <noreply@dragarwal.com>'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    
    // Feature modules
    AuthModule,
    ContentModule,
    RegistrationModule,
    WhatsAppModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

/**
 * Returns the database module if the required environment variables are set
 */
function getDatabaseModule() {
  const requiredVars = ['DB_HOST', 'DB_PORT'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing database environment variables: ${missing.join(', ')}`);
    console.warn('Database connection will be disabled. Only health checks will work.');
    return [];
  }
  
  return [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          // Use DB_USER if available, fallback to DB_USERNAME for compatibility
          username: configService.get('DB_USER') || configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          // Use DB_NAME if available, fallback to DB_DATABASE for compatibility
          database: configService.get('DB_NAME') || configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') !== 'production',
          ssl: configService.get('NODE_ENV') === 'production' ? {
            rejectUnauthorized: false,
          } : false,
        };
        
        console.log('Database configuration:', {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          // Don't log sensitive info
          username: dbConfig.username ? '***' : undefined,
          password: dbConfig.password ? '***' : undefined,
          ssl: dbConfig.ssl ? 'enabled' : 'disabled'
        });
        
        return dbConfig;
      },
    })
  ];
} 