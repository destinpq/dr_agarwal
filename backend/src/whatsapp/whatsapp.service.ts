import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: Client;
  private isReady = false;
  private messageQueue: { to: string; message: string; mediaData?: Buffer; mediaType?: string }[] = [];
  private defaultCountryCode: string;
  private whatsappPhoneNumber: string;

  constructor(private readonly configService: ConfigService) {
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
      // We're not logging the QR code, just noting that it was received
      this.logger.log('WhatsApp authentication required - client needs a one-time setup with QR code.');
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