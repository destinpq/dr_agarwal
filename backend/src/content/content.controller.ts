import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { AuthService } from '../auth/services/auth.service';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly authService: AuthService
  ) {}

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':divId')
  findOne(@Param('divId') divId: string) {
    return this.contentService.findOne(divId);
  }

  @Post()
  create(
    @Headers('admin-password') adminPassword: string,
    @Body() createContentDto: CreateContentDto
  ) {
    this.authService.validateAdminPassword(adminPassword);
    return this.contentService.create(createContentDto);
  }

  @Put(':divId')
  update(
    @Headers('admin-password') adminPassword: string,
    @Param('divId') divId: string, 
    @Body() updateContentDto: UpdateContentDto
  ) {
    this.authService.validateAdminPassword(adminPassword);
    return this.contentService.update(divId, updateContentDto);
  }

  @Delete(':divId')
  remove(
    @Headers('admin-password') adminPassword: string,
    @Param('divId') divId: string
  ) {
    this.authService.validateAdminPassword(adminPassword);
    return this.contentService.remove(divId);
  }
} 