import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HashUtil } from '../common/utils/hash.util';
import { UserDocument } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.create(registerDto) as UserDocument;
    const payload = { email: user.email, sub: user._id.toString(), role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !await HashUtil.compare(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDoc = user as UserDocument;
    
    // Check if user is blocked
    if (userDoc.isBlocked) {
      throw new UnauthorizedException('Your account has been blocked. Please contact support.');
    }
    
    const payload = { email: userDoc.email, sub: userDoc._id.toString(), role: userDoc.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        loyaltyPoints: userDoc.loyaltyPoints,
      },
    };
  }
}