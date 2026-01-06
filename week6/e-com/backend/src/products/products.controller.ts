import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    let imageUrls: string[] = [];
    
    if (files && files.length > 0) {
      imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }

    // Handle tags array from FormData
    // When FormData sends multiple values with same key, multer might parse them differently
    let tags: string[] | undefined = undefined;
    
    // Check if tags exist in request body
    if (req.body && 'tags' in req.body) {
      const tagsValue = req.body.tags;
      
      if (Array.isArray(tagsValue)) {
        // Already an array - filter out empty strings
        tags = tagsValue.filter((tag: any) => tag && typeof tag === 'string' && tag.trim() !== '');
      } else if (typeof tagsValue === 'string' && tagsValue.trim() !== '') {
        // Single string value
        tags = [tagsValue.trim()];
      }
    }
    
    // If tags from DTO exist (from Transform decorator), use them as fallback
    if (!tags && createProductDto.tags && Array.isArray(createProductDto.tags) && createProductDto.tags.length > 0) {
      tags = createProductDto.tags;
    }

    return this.productsService.create({
      ...createProductDto,
      tags: tags,
      images: imageUrls,
    });
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.productsService.search(searchTerm);
  }

  @Get('top-selling')
  getTopSelling(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 8;
    return this.productsService.getTopSellingProducts(limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    let newImageUrls: string[] = [];
    
    if (files && files.length > 0) {
      newImageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }

    // Get existing images that should be preserved
    let existingImages: string[] = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        existingImages = [];
      }
    }

    // Combine existing images with new images
    const allImages = [...existingImages, ...newImageUrls];

    // Handle tags array from FormData (similar to create method)
    let tags: string[] | undefined = undefined;
    if (req.body && 'tags' in req.body) {
      const tagsValue = req.body.tags;
      if (Array.isArray(tagsValue)) {
        tags = tagsValue.filter((tag: any) => tag && typeof tag === 'string' && tag.trim() !== '');
      } else if (typeof tagsValue === 'string' && tagsValue.trim() !== '') {
        tags = [tagsValue.trim()];
      }
    }
    
    // If tags from DTO exist, use them as fallback
    if (!tags && updateProductDto.tags && Array.isArray(updateProductDto.tags) && updateProductDto.tags.length > 0) {
      tags = updateProductDto.tags;
    }

    // Handle isOnSale - set based on salePrice
    let isOnSale: boolean | undefined = undefined;
    if (req.body.isOnSale !== undefined) {
      isOnSale = req.body.isOnSale === 'true' || req.body.isOnSale === true;
    } else if (updateProductDto.salePrice !== undefined) {
      // If salePrice is provided, set isOnSale based on whether salePrice > 0
      isOnSale = updateProductDto.salePrice > 0;
    }
    
    // Remove existingImages from DTO as it's only used for processing, not saved to DB
    const { existingImages: _, ...updateData } = updateProductDto;
    
    return this.productsService.update(id, {
      ...updateData,
      tags: tags,
      images: allImages.length > 0 ? allImages : undefined,
      isOnSale: isOnSale !== undefined ? isOnSale : updateProductDto.isOnSale,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('upload-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    return { images: imageUrls };
  }
}