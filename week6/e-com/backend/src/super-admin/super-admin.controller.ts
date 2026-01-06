import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('promote/:userId')
  promoteToAdmin(@Param('userId') userId: string) {
    return this.superAdminService.promoteToAdmin(userId);
  }

  @Post('demote/:userId')
  demoteFromAdmin(@Param('userId') userId: string) {
    return this.superAdminService.demoteFromAdmin(userId);
  }

  @Get('admins')
  getAllAdmins() {
    return this.superAdminService.getAllAdmins();
  }
}