import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
// Import qrcode-terminal for proper QR code display in console
import * as qrcodeTerminal from 'qrcode-terminal';
import { EmailService } from '../email/email.service';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private isReady = false;
  private messageQueue: { to: string; message: string; mediaData?: Buffer; mediaType?: string }[] = [];
  private defaultCountryCode: string;
  private whatsappPhoneNumber: string;
  private qrCode: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    // Get configuration from environment variables via ConfigService
    const sessionPath = this.configService.get<string>('WHATSAPP_SESSION_PATH', './whatsapp-sessions');
    const clientId = this.configService.get<string>('WHATSAPP_CLIENT_ID', 'dr-agarwal-workshop');
    const timeout = parseInt(this.configService.get<string>('WHATSAPP_TIMEOUT', '60000'), 10);
    this.defaultCountryCode = this.configService.get<string>('WHATSAPP_DEFAULT_COUNTRY_CODE', '91');
    this.whatsappPhoneNumber = this.configService.get<string>('WHATSAPP_PHONE_NUMBER', '');
    
    this.logger.log(`Initializing WhatsApp with sessionPath=${sessionPath}, clientId=${clientId}`);
    if (this.whatsappPhoneNumber) {
      this.logger.log(`Using WhatsApp number: ${this.whatsappPhoneNumber}`);
    }
    
    // Initialize WhatsApp client with LocalAuth to maintain session persistence
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: clientId,
        dataPath: sessionPath
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: timeout
      }
    });

    this.setupEventListeners();
  }

  async onModuleInit() {
    try {
      await this.client.initialize();
      this.logger.log('WhatsApp client initializing. If already authenticated, no QR code will appear.');
    } catch (error) {
      this.logger.error(`Failed to initialize WhatsApp client: ${error.message}`);
    }
  }

  private setupEventListeners() {
    // Handle QR code generation (only needed on first run)
    this.client.on('qr', (qr) => {
      this.qrCode = qr;
      this.logger.log('WhatsApp QR Code received. Scan with your phone:');
      
      // Generate and display QR code in console
      qrcodeTerminal.generate(qr, { small: false });
      
      this.logger.log('If QR code is not visible, use this string with an online QR generator:');
      this.logger.log(qr);
      
      // Send QR code to email
      this.sendQrCodeToEmail(qr);
    });

    // Handle ready state
    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log('WhatsApp client is ready to send messages!');
      this.processMessageQueue();
    });

    // Handle authentication
    this.client.on('authenticated', () => {
      this.logger.log('WhatsApp client authenticated successfully!');
    });

    // Handle disconnections
    this.client.on('disconnected', () => {
      this.isReady = false;
      this.logger.warn('WhatsApp client disconnected');
    });
  }

  /**
   * Get the current QR code
   */
  getQRCode(): string {
    return this.qrCode;
  }

  /**
   * Send the WhatsApp QR code to email
   */
  private async sendQrCodeToEmail(qr: string): Promise<void> {
    try {
      const adminEmail = this.configService.get('EMAIL_FROM', 'support@destinpq.com');
      
      // Create a QR code image url
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
      
      // Send email with QR code
      const subject = 'WhatsApp QR Code for Dr. Agarwal Workshop';
      const text = `Here is your WhatsApp QR code for the Dr. Agarwal Workshop. Scan it with your WhatsApp app to log in.\n\nQR Code: ${qr}\n\nOr use this URL to see the QR code: ${qrCodeImageUrl}`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>WhatsApp QR Code for Dr. Agarwal Workshop</h2>
          <p>Here is your WhatsApp QR code. Scan it with your WhatsApp app to log in.</p>
          <div style="text-align: center; margin: 20px 0;">
            <img src="${qrCodeImageUrl}" alt="WhatsApp QR Code" style="max-width: 300px; border: 1px solid #ddd;">
          </div>
          <p>If the image doesn't appear, you can use this code with an online QR generator:</p>
          <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; white-space: pre-wrap; word-break: break-all;">${qr}</pre>
          <p>This QR code will expire after being scanned or after a certain period of time.</p>
        </div>
      `;
      
      await this.emailService.sendMail(adminEmail, subject, text, html);
      this.logger.log(`WhatsApp QR code sent to ${adminEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send QR code email: ${error.message}`);
    }
  }

  /**
   * Get the connection status
   */
  async getConnectionStatus(): Promise<string> {
    return this.isReady ? 'connected' : 'disconnected';
  }

  /**
   * Send a WhatsApp message - will queue if not ready
   */
  async sendMessage(to: string, message: string): Promise<string> {
    try {
      // Format the phone number
      const formattedNumber = this.formatPhoneNumber(to);
      
      // If client isn't ready, queue the message for later
      if (!this.isReady) {
        this.messageQueue.push({ to: formattedNumber, message });
        this.logger.log(`Client not ready. Queued message for ${formattedNumber}`);
        return `Message queued for ${formattedNumber}`;
      }
      
      // Otherwise send immediately
      const messageId = await this.sendDirectMessage(formattedNumber, message);
      return messageId;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      // Generate a fallback link
      const link = this.getWhatsAppLink(to, message);
      this.logger.log(`Generated fallback WhatsApp link: ${link}`);
      return link;
    }
  }

  /**
   * Send a WhatsApp message with media attachment
   */
  async sendMediaMessage(to: string, caption: string, mediaBuffer: Buffer, mediaType: string = 'image/jpeg'): Promise<boolean> {
    try {
      // Format the phone number
      const formattedNumber = this.formatPhoneNumber(to);
      
      // If client isn't ready, queue the message for later
      if (!this.isReady) {
        this.messageQueue.push({ 
          to: formattedNumber, 
          message: caption,
          mediaData: mediaBuffer,
          mediaType
        });
        this.logger.log(`Client not ready. Queued media message for ${formattedNumber}`);
        return true;
      }
      
      // Handle media messages with direct messages
      await this.sendDirectMessage(formattedNumber, caption);
      this.logger.log(`Media message not supported yet. Sent text message to ${formattedNumber}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp media message: ${error.message}`);
      return false;
    }
  }

  /**
   * Process queued messages when client becomes ready
   */
  private async processMessageQueue() {
    if (this.messageQueue.length > 0) {
      this.logger.log(`Processing ${this.messageQueue.length} queued messages`);
      
      // Create a copy of the queue and clear the original
      const queueCopy = [...this.messageQueue];
      this.messageQueue = [];
      
      // Process each queued message
      for (const item of queueCopy) {
        try {
          await this.sendDirectMessage(item.to, item.message);
          this.logger.log(`Sent queued message to ${item.to}`);
        } catch (error) {
          this.logger.error(`Failed to send queued message to ${item.to}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Send a direct WhatsApp message using the client
   */
  private async sendDirectMessage(to: string, message: string): Promise<string> {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }
      
      const response = await this.client.sendMessage(`${to}@c.us`, message);
      this.logger.log(`Message sent to ${to}`);
      return response.id._serialized;
    } catch (error) {
      this.logger.error(`Failed to send direct message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a WhatsApp deep link (as fallback)
   */
  getWhatsAppLink(to: string, message: string): string {
    const formattedNumber = this.formatPhoneNumber(to);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
  }

  /**
   * Format phone number to international format for WhatsApp
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // For Indian numbers, strip leading 0 if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // Add country code if not present
    if (!cleaned.startsWith(this.defaultCountryCode) && cleaned.length === 10) {
      cleaned = `${this.defaultCountryCode}${cleaned}`;
    }
    
    this.logger.log(`Formatted phone number ${phone} to ${cleaned}`);
    return cleaned;
  }
} 