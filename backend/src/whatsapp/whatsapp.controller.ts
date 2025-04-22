import { Controller, Post, Body, Param, BadRequestException, Get } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Get('status')
  async getStatus() {
    const status = await this.whatsAppService.getConnectionStatus();
    return { status };
  }

  @Post('generate-link/:phone')
  generateLink(
    @Param('phone') phone: string,
    @Body() body: { message: string },
  ) {
    if (!body.message) {
      throw new BadRequestException('Message is required');
    }

    try {
      const link = this.whatsAppService.getWhatsAppLink(phone, body.message);
      return { success: true, link };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to generate WhatsApp link');
    }
  }

  @Post('send/:phone')
  async sendMessage(
    @Param('phone') phone: string,
    @Body() body: { message: string },
  ) {
    if (!body.message) {
      throw new BadRequestException('Message is required');
    }

    try {
      const result = await this.whatsAppService.sendMessage(phone, body.message);
      return { success: true, result };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to send WhatsApp message');
    }
  }
} 