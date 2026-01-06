import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SuperAdminService {
  constructor(private usersService: UsersService) {}

  async promoteToAdmin(userId: string) {
    return this.usersService.update(userId, { role: Role.ADMIN });
  }

  async demoteFromAdmin(userId: string) {
    return this.usersService.update(userId, { role: Role.USER });
  }

  async getAllAdmins() {
    const users = await this.usersService.findAll();
    return users.filter(user => user.role === Role.ADMIN);
  }
}