/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CloudinaryService } from '../common/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('cars')
export class CarsController {
  constructor(
    private readonly carsService: CarsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('photos', 10))
  async create(
    @Body() createCarDto: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    // 🔒 Safety check
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // ✅ Upload images & extract ONLY URLs
    let photoUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadedImages =
        await this.cloudinaryService.uploadMultipleImages(files);

      photoUrls = uploadedImages.map((img) => img.secure_url);
    }

    // ✅ Transform FormData strings → correct types
    const transformedDto = {
      title: createCarDto.title,
      description: createCarDto.description,
      make: createCarDto.make,
      model: createCarDto.model,
      bodyType: createCarDto.bodyType,
      category: createCarDto.category,
      year: parseInt(createCarDto.year),
      startingPrice: parseFloat(createCarDto.startingPrice),
      currentPrice: createCarDto.currentPrice
        ? parseFloat(createCarDto.currentPrice)
        : 0,
      startTime: new Date(createCarDto.startTime),
      endTime: new Date(createCarDto.endTime),
      sellerId: req.user.userId, // 👈 schema expects ObjectId
      photos: photoUrls,         // 👈 string[]
    };

    return this.carsService.create(transformedDto);
  }

  // ================= PUBLIC ROUTES =================

  @Public()
  @Get()
  findAll(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.carsService.findAll({ make, model, year, minPrice, maxPrice });
  }

  @Public()
  @Get('filters/options')
  getFilterOptions() {
    return this.carsService.getFilterOptions();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }
}
