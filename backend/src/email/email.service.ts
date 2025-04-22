import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
  ) {
    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('EMAIL_PORT', 465),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      const from = this.configService.get('EMAIL_FROM', '"Dr. Agarwal Workshop" <noreply@dragarwal.com>');
      
      const mailOptions = {
        from,
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  async sendRegistrationEmail(
    userEmail: string, 
    name: string, 
    dates: string, 
    timing: string, 
    isPending: boolean
  ): Promise<boolean> {
    const subject = 'Workshop Registration Confirmation';
    
    const text = `
      Hello ${name},
      
      Thank you for registering for Dr. Agarwal's Psychology Workshop. We're excited to have you join us!
      
      Workshop Details:
      - Dates: ${dates}
      - Timing: ${timing}
      - Payment Status: ${isPending ? 'Pending' : 'Completed'}
      
      ${isPending 
        ? 'Please complete your payment to secure your spot in the workshop. You can do this by logging back into the workshop registration portal.' 
        : 'Your payment has been confirmed. You\'re all set for the workshop!'}
      
      If you have any questions or need assistance, please don't hesitate to contact us.
      
      We look forward to seeing you at the workshop!
      
      Best regards,
      Dr. Agarwal's Workshop Team
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1>Workshop Registration Confirmation</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering for Dr. Agarwal's Psychology Workshop. We're excited to have you join us!</p>
            
            <div style="background-color: #e9ecef; padding: 10px; border-left: 4px solid #722ed1; margin-bottom: 15px;">
              <h3>Workshop Details</h3>
              <p><strong>Dates:</strong> ${dates}</p>
              <p><strong>Timing:</strong> ${timing}</p>
              <p><strong>Payment Status:</strong> ${isPending ? 'Pending' : 'Completed'}</p>
            </div>
            
            ${isPending 
              ? '<p>Please complete your payment to secure your spot in the workshop. You can do this by logging back into the workshop registration portal.</p>' 
              : '<p>Your payment has been confirmed. You\'re all set for the workshop!</p>'}
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>We look forward to seeing you at the workshop!</p>
            
            <p>Best regards,<br>Dr. Agarwal's Workshop Team</p>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
            <p>&copy; 2025 Dr. Agarwal's Psychology Workshop. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    
    return this.sendMail(userEmail, subject, text, html);
  }

  async sendAdminNotification(
    adminEmail: string,
    registration: any
  ): Promise<boolean> {
    const subject = 'New Workshop Registration';
    
    const text = `
      A new registration has been submitted for Dr. Agarwal's Psychology Workshop.
      
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
      
      You can view and manage all registrations in the admin dashboard.
    `;
    
    return this.sendMail(adminEmail, subject, text);
  }

  async sendPaymentConfirmation(
    userEmail: string,
    name: string,
    dates: string,
    timing: string
  ): Promise<boolean> {
    const subject = 'Payment Confirmation - Dr. Agarwal\'s Workshop';
    
    const text = `
      Hello ${name},
      
      We're pleased to confirm that your payment for the Psychology Workshop has been successfully processed. Your spot is now fully secured!
      
      Workshop Details:
      - Dates: ${dates}
      - Timing: ${timing}
      
      We will send you a reminder email with the workshop materials and joining instructions a few days before the event.
      
      If you have any questions or need to make changes to your registration, please contact us as soon as possible.
      
      We look forward to seeing you at the workshop!
      
      Warm regards,
      Dr. Agarwal's Workshop Team
    `;
    
    return this.sendMail(userEmail, subject, text);
  }
} 