import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';
import { Registration } from './registration.entity';
import { CreateRegistrationDto, PaymentStatus, UpdateRegistrationDto } from './dto/create-registration.dto';
import { ConfigService } from '@nestjs/config';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto, paymentScreenshot?: Buffer): Promise<Registration> {
    this.logger.log(`Creating new registration for ${createRegistrationDto.name}`);
    
    const registration = this.registrationRepository.create({
      ...createRegistrationDto,
      paymentScreenshot: paymentScreenshot || null,
    });

    const savedRegistration = await this.registrationRepository.save(registration);
    
    // Send initial email to admin and participant
    if (!registration.emailSent) {
      try {
        await this.sendRegistrationEmails(savedRegistration);
      } catch (error) {
        this.logger.error(`Failed to send registration emails: ${error.message}`, error.stack);
      }
    }

    return savedRegistration;
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find();
  }

  async findOne(id: string): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({ where: { id } });
    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }
    return registration;
  }

  async update(id: string, updateRegistrationDto: UpdateRegistrationDto, paymentScreenshot?: Buffer): Promise<Registration> {
    this.logger.log(`Updating registration ${id} with status ${updateRegistrationDto.paymentStatus}`);
    
    const registration = await this.findOne(id);
    
    // Update fields
    if (updateRegistrationDto.paymentStatus) {
      registration.paymentStatus = updateRegistrationDto.paymentStatus;
    }
    
    if (paymentScreenshot) {
      registration.paymentScreenshot = paymentScreenshot;
    }
    
    const updatedRegistration = await this.registrationRepository.save(registration);
    
    // Send confirmation email if payment is completed and confirmation email not sent yet
    if (
      updatedRegistration.paymentStatus === PaymentStatus.COMPLETED && 
      updatedRegistration.paymentScreenshot && 
      !updatedRegistration.confirmationEmailSent
    ) {
      try {
        await this.sendConfirmationEmails(updatedRegistration);
      } catch (error) {
        this.logger.error(`Failed to send confirmation emails: ${error.message}`, error.stack);
      }
    }
    
    return updatedRegistration;
  }

  async remove(id: string): Promise<void> {
    const registration = await this.findOne(id);
    await this.registrationRepository.remove(registration);
  }

  private async sendRegistrationEmails(registration: Registration): Promise<void> {
    const isDev = this.configService.get('NODE_ENV') === 'development';
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    const userEmail = registration.email;
    
    if (isDev && adminEmail === 'admin@example.com') {
      this.logger.warn('Admin email not configured. Skipping admin notification.');
      return;
    }
    
    try {
      // Send email to admin
      await this.emailService.sendMail(
        adminEmail,
        'New Workshop Registration',
        `A new registration has been submitted for Dr. Agarwal's Psychology Workshop.
      
        Registration Details:
        - ID: ${registration.id}
        - Name: ${registration.name}
        - Email: ${registration.email}
        - Phone: ${registration.phone}
        - Age: ${registration.age}
        - Interest Area: ${registration.interestArea}
        - Preferred Dates: ${registration.preferredDates}
        - Preferred Timing: ${registration.preferredTiming}
        - Expectations: ${registration.expectations || 'None provided'}
        - Referral Source: ${registration.referralSource}
        - Payment Status: ${registration.paymentStatus}
        - Registration Date: ${registration.createdAt}
        
        You can view and manage all registrations in the admin dashboard.`
      );
      
      this.logger.log(`Admin notification sent to ${adminEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send admin notification: ${error.message}`);
    }
    
    try {
      // Send email to user
      await this.emailService.sendMail(
        userEmail,
        'Workshop Registration Confirmation',
        `Hello ${registration.name},
      
        Thank you for registering for Dr. Agarwal's Psychology Workshop. We're excited to have you join us!
        
        Workshop Details:
        - Dates: ${registration.preferredDates.join(' - ')}
        - Timing: ${registration.preferredTiming}
        - Payment Status: ${registration.paymentStatus === PaymentStatus.COMPLETED ? 'Completed' : 'Pending'}
        
        ${registration.paymentStatus !== PaymentStatus.COMPLETED 
          ? 'Please complete your payment to secure your spot in the workshop. You can do this by logging back into the workshop registration portal.' 
          : 'Your payment has been confirmed. You\'re all set for the workshop!'}
        
        If you have any questions or need assistance, please don't hesitate to contact us.
        
        We look forward to seeing you at the workshop!
        
        Best regards,
        Dr. Agarwal's Workshop Team`
      );
      
      this.logger.log(`User confirmation sent to ${userEmail}`);
      
      // Send WhatsApp message if phone number is available
      if (registration.phone) {
        try {
          const connectionStatus = await this.whatsAppService.getConnectionStatus();
          
          const message = `*Thank you for registering for our Psychology Workshop!* 🌟

Dear ${registration.name},

Your registration details:
📅 Workshop dates: ${registration.preferredDates.join(' - ')}
⏰ Workshop timing: ${registration.preferredTiming}
💰 Payment status: ${registration.paymentStatus === PaymentStatus.COMPLETED ? 'Confirmed ✅' : 'Pending ⏳'}

${registration.paymentStatus !== PaymentStatus.COMPLETED ? '⚠️ Please complete your payment to confirm your spot in the workshop.' : ''}

*Workshop Benefits:*
• Learn practical psychology skills
• Enhance your emotional intelligence
• Develop better relationships
• Manage stress effectively

For any queries, please reply to this message or contact us at our office.

Thank you!
Dr. Agarwal's Psychology Workshop Team`;

          const result = await this.whatsAppService.sendMessage(registration.phone, message);
          if (connectionStatus === 'connected') {
            this.logger.log(`WhatsApp message sent to ${registration.phone}`);
          } else {
            this.logger.log(`WhatsApp client not connected. Message queued or link generated: ${result}`);
          }
        } catch (error) {
          this.logger.error(`Failed to send WhatsApp registration message: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to send user confirmation: ${error.message}`);
      // Don't rethrow, as we still want to mark email as attempted
    }
    
    // Mark email as sent
    registration.emailSent = true;
    await this.registrationRepository.save(registration);
  }

  private async sendConfirmationEmails(registration: Registration): Promise<void> {
    const isDev = this.configService.get('NODE_ENV') === 'development';
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    const userEmail = registration.email;
    
    // Get backend URL from environment variable without localhost fallback
    const backendUrl = this.configService.get('BACKEND_URL');
    if (!backendUrl) {
      this.logger.warn('BACKEND_URL not configured in environment variables');
    }
    
    if (isDev && adminEmail === 'admin@example.com') {
      this.logger.warn('Admin email not configured. Skipping admin payment notification.');
      return;
    }
    
    try {
      // Send payment confirmation to admin
      await this.emailService.sendMail(
        adminEmail,
        'Workshop Payment Completed',
        `Payment has been completed for registration:
        
        Registration Details:
        - ID: ${registration.id}
        - Name: ${registration.name}
        - Email: ${registration.email}
        - Phone: ${registration.phone}
        - Payment Status: Completed
        
        You can view the payment screenshot and registration details in the admin dashboard.`
      );
      
      this.logger.log(`Admin payment notification sent to ${adminEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send admin payment notification: ${error.message}`);
    }
    
    // Generate payment screenshot URL for email
    const paymentScreenshotUrl = registration.paymentScreenshot 
      ? `${backendUrl}/registrations/${registration.id}/screenshot` 
      : null;
    
    try {
      // Send payment confirmation to user
      await this.emailService.sendMail(
        userEmail,
        'Workshop Payment Confirmation',
        `Hello ${registration.name},
        
        We're pleased to confirm that your payment for the Psychology Workshop has been successfully processed. Your spot is now fully secured!
        
        Workshop Details:
        - Dates: ${registration.preferredDates.join(' - ')}
        - Timing: ${registration.preferredTiming}
        
        We will send you a reminder email with the workshop materials and joining instructions a few days before the event.
        
        If you have any questions or need to make changes to your registration, please contact us as soon as possible.
        
        We look forward to seeing you at the workshop!
        
        Warm regards,
        Dr. Agarwal's Workshop Team`
      );
      
      this.logger.log(`User payment confirmation sent to ${userEmail}`);
      
      // Send WhatsApp message if phone number is available
      if (registration.phone) {
        try {
          const connectionStatus = await this.whatsAppService.getConnectionStatus();
          
          const message = `*Thank you for your payment confirmation!* ✅

Dear ${registration.name},

Your payment for the Psychology Workshop has been successfully processed.

*Workshop Details:*
📅 Dates: ${registration.preferredDates.join(' - ')}
⏰ Timing: ${registration.preferredTiming}

We'll send you the Zoom meeting link and preparation materials 3 days before the workshop.

*What to expect:*
• Pre-workshop reading materials
• Interactive sessions
• Practical exercises
• Certificate of completion

Please keep this confirmation handy for your reference.

For any questions, please contact us.

Warm regards,
Dr. Agarwal's Psychology Workshop Team`;

          const result = await this.whatsAppService.sendMessage(registration.phone, message);
          if (connectionStatus === 'connected') {
            this.logger.log(`WhatsApp message sent to ${registration.phone}`);
          } else {
            this.logger.log(`WhatsApp client not connected. Message queued or link generated: ${result}`);
          }
        } catch (error) {
          this.logger.error(`Failed to send WhatsApp payment confirmation message: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to send user payment confirmation: ${error.message}`);
      // Don't rethrow, as we still want to mark email as attempted
    }
    
    // Mark confirmation email as sent
    registration.confirmationEmailSent = true;
    await this.registrationRepository.save(registration);
  }
} 