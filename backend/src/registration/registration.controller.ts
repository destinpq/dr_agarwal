import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, ParseUUIDPipe, Logger, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto, UpdateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './registration.entity';
import { Response } from 'express';

@Controller('registrations')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('paymentScreenshot'))
  async create(
    @Body() createRegistrationDto: CreateRegistrationDto,
    @UploadedFile() paymentScreenshot?: Express.Multer.File,
  ): Promise<Registration> {
    this.logger.log(`Received registration request: ${JSON.stringify(createRegistrationDto)}`);
    
    try {
      // Handle file safely
      let fileBuffer: Buffer | undefined = undefined;
      
      if (paymentScreenshot && paymentScreenshot.buffer) {
        try {
          // Make sure we have a valid buffer
          if (Buffer.isBuffer(paymentScreenshot.buffer)) {
            fileBuffer = paymentScreenshot.buffer;
            this.logger.log(`Payment screenshot received with size: ${fileBuffer.length} bytes`);
          } else {
            this.logger.warn(`Payment screenshot buffer is not a valid Buffer object`);
          }
        } catch (fileError) {
          this.logger.error(`Error processing payment screenshot: ${fileError.message}`);
          // Continue without the file if there's an error
        }
      }
      
      // Ensure preferredDates is an array with exactly 2 elements
      if (!Array.isArray(createRegistrationDto.preferredDates) || 
          createRegistrationDto.preferredDates.length !== 2) {
        this.logger.error(`Invalid preferredDates format: ${JSON.stringify(createRegistrationDto.preferredDates)}`);
        throw new BadRequestException('preferredDates must be an array with exactly 2 elements');
      }
      
      return this.registrationService.create(createRegistrationDto, fileBuffer);
    } catch (error) {
      this.logger.error(`Error creating registration: ${error.message}`);
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Registration[]> {
    return this.registrationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Registration> {
    return this.registrationService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('paymentScreenshot'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRegistrationDto: UpdateRegistrationDto,
    @UploadedFile() paymentScreenshot?: Express.Multer.File,
  ): Promise<Registration> {
    this.logger.log(`Updating registration ${id}: ${JSON.stringify(updateRegistrationDto)}`);
    
    try {
      // Handle file safely
      let fileBuffer: Buffer | undefined = undefined;
      
      if (paymentScreenshot && paymentScreenshot.buffer) {
        try {
          // Make sure we have a valid buffer
          if (Buffer.isBuffer(paymentScreenshot.buffer)) {
            fileBuffer = paymentScreenshot.buffer;
            this.logger.log(`Payment screenshot received with size: ${fileBuffer.length} bytes`);
          } else {
            this.logger.warn(`Payment screenshot buffer is not a valid Buffer object`);
          }
        } catch (fileError) {
          this.logger.error(`Error processing payment screenshot: ${fileError.message}`);
          // Continue without the file if there's an error
        }
      }
      
      return this.registrationService.update(id, updateRegistrationDto, fileBuffer);
    } catch (error) {
      this.logger.error(`Error updating registration: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.registrationService.remove(id);
  }

  // Dedicated endpoint for frontend update-registration path
  @Post('/update-registration')
  @UseInterceptors(FileInterceptor('paymentScreenshot', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    // Force proper multer setup
    storage: undefined // Use memory storage for direct buffer access
  }))
  async updateRegistrationWithPayment(
    @Body() updateData: any,
    @UploadedFile() paymentScreenshot?: Express.Multer.File,
  ): Promise<Registration> {
    const id = updateData.id;
    if (!id) {
      throw new BadRequestException('Registration ID is required in the request body');
    }
    
    this.logger.log(`Updating registration ${id} via update-registration endpoint`);
    
    try {
      // Handle file safely
      let fileBuffer: Buffer | undefined = undefined;
      
      if (paymentScreenshot && paymentScreenshot.buffer) {
        try {
          // Make sure we have a valid buffer
          if (Buffer.isBuffer(paymentScreenshot.buffer)) {
            fileBuffer = paymentScreenshot.buffer;
            this.logger.log(`Payment screenshot received with size: ${fileBuffer.length} bytes`);
          } else {
            this.logger.warn(`Payment screenshot buffer is not a valid Buffer object`);
          }
        } catch (fileError) {
          this.logger.error(`Error processing payment screenshot: ${fileError.message}`);
          // Continue without the file if there's an error
        }
      }
      
      const updateDto = new UpdateRegistrationDto();
      // Copy allowed fields from updateData to updateDto
      if (updateData.paymentStatus) updateDto.paymentStatus = updateData.paymentStatus;
      
      return this.registrationService.update(id, updateDto, fileBuffer);
    } catch (error) {
      this.logger.error(`Error updating registration: ${error.message}`);
      throw error;
    }
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('paymentScreenshot'))
  async updateViaPost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRegistrationDto: UpdateRegistrationDto,
    @UploadedFile() paymentScreenshot?: Express.Multer.File,
  ): Promise<Registration> {
    this.logger.log(`Updating registration ${id} via POST: ${JSON.stringify(updateRegistrationDto)}`);
    
    try {
      // Handle file safely
      let fileBuffer: Buffer | undefined = undefined;
      
      if (paymentScreenshot && paymentScreenshot.buffer) {
        try {
          // Make sure we have a valid buffer
          if (Buffer.isBuffer(paymentScreenshot.buffer)) {
            fileBuffer = paymentScreenshot.buffer;
            this.logger.log(`Payment screenshot received with size: ${fileBuffer.length} bytes`);
          } else {
            this.logger.warn(`Payment screenshot buffer is not a valid Buffer object`);
          }
        } catch (fileError) {
          this.logger.error(`Error processing payment screenshot: ${fileError.message}`);
          // Continue without the file if there's an error
        }
      }
      
      return this.registrationService.update(id, updateRegistrationDto, fileBuffer);
    } catch (error) {
      this.logger.error(`Error updating registration via POST: ${error.message}`);
      throw error;
    }
  }

  @Get(':id/screenshot')
  async getPaymentScreenshot(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response
  ): Promise<void> {
    try {
      const registration = await this.registrationService.findOne(id);
      
      if (!registration.paymentScreenshot) {
        throw new BadRequestException('No payment screenshot found for this registration');
      }
      
      // Set appropriate headers
      response.setHeader('Content-Type', 'image/jpeg');
      response.setHeader('Content-Disposition', `inline; filename="payment-${id}.jpg"`);
      
      // Send the buffer as response
      response.send(registration.paymentScreenshot);
    } catch (error) {
      this.logger.error(`Error retrieving payment screenshot: ${error.message}`);
      throw error;
    }
  }
} 