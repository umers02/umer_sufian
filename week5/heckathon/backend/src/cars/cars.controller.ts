// cars.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Query, UseInterceptors, UploadedFiles, Request } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
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
    console.log('Request user:', req.user);
    console.log('Create car DTO:', createCarDto);
    
    let photoUrls: string[] = [];
    
    if (files && files.length > 0) {
      photoUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }
    
    // Transform FormData strings to proper types
    const transformedDto = {
      ...createCarDto,
      sellerId: req.user?.userId || req.user?.sub || req.user?._id,
      year: createCarDto.year ? parseInt(createCarDto.year) : undefined,
      startingPrice: createCarDto.startingPrice ? parseFloat(createCarDto.startingPrice) : undefined,
      currentPrice: createCarDto.currentPrice ? parseFloat(createCarDto.currentPrice) : undefined,
      photos: photoUrls,
    };
    
    console.log('Transformed DTO:', transformedDto);
    
    return this.carsService.create(transformedDto);
  }

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
