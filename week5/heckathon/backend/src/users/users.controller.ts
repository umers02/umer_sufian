import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarsService } from '../cars/cars.service';
import { BidsService } from '../bids/bids.service';
import { CloudinaryService } from '../common/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly carsService: CarsService,
    private readonly bidsService: BidsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile/me')
  async getMyProfile(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('profile/my-cars')
  async getMyCars(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.carsService.findByUserId(userId);
  }

  @Get('profile/my-bids')
  async getMyBids(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.bidsService.findByUserId(userId);
  }

  @Post('profile/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(file);
    
    const updated = await this.usersService.update(userId, {
      profilePicture: uploadResult.secure_url,
    });

    if (!updated) throw new NotFoundException('User not found');
    
    return {
      message: 'Profile image uploaded successfully',
      profilePicture: uploadResult.secure_url,
    };
  }

  @Put('profile/me')
  async updateMyProfile(@Request() req: any, @Body() body: Partial<User>) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    const updated = await this.usersService.update(userId, body);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @Post()
  async create(@Body() body: Partial<User>): Promise<User> {
    return this.usersService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<User>,
  ): Promise<User> {
    const updated = await this.usersService.update(id, body);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
    return { message: `User with id ${id} deleted successfully` };
  }
}