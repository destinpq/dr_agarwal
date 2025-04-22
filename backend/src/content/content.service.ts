import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(divId: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { divId },
    });

    if (!content) {
      throw new NotFoundException(`Content with divId ${divId} not found`);
    }

    return content;
  }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async update(divId: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(divId);
    
    // Update the content with the new values
    const updatedContent = {
      ...content,
      ...updateContentDto,
    };

    return this.contentRepository.save(updatedContent);
  }

  async remove(divId: string): Promise<void> {
    const result = await this.contentRepository.delete({ divId });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Content with divId ${divId} not found`);
    }
  }
} 