import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<boolean> {
    const user = await this.findUserByIdentifier(identifier);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return true;
    }
    return false;
  }

  async findUserByIdentifier(identifier: string): Promise<UserDocument | null> {
    // Try finding by username first
    let user = await this.usersService.findByUsername(identifier);

    // If not found by username, try email
    if (!user) {
      user = await this.usersService.findByEmail(identifier);
    }

    return user;
  }

  async login(user: UserDocument) {
    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
      },
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
    fullName: string,
    mobileNumber: string,
  ): Promise<UserDocument> {
    console.log('Checking for existing user:', { username, email, mobileNumber });
    
    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(username);
    console.log('Existing user by username:', existingUser);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.usersService.findByEmail(email);
    console.log('Existing user by email:', existingEmail);
    if (existingEmail) {
      throw new UnauthorizedException('Email already exists');
    }

    // Check if mobile number already exists
    const existingMobile = await this.usersService.findByMobileNumber(mobileNumber);
    console.log('Existing user by mobile:', existingMobile);
    if (existingMobile) {
      throw new UnauthorizedException('Mobile number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      username,
      email,
      fullName,
      mobileNumber,
      passwordHash: hashedPassword,
    } as UserDocument;

    console.log('Creating new user:', userData);
    return this.usersService.create(userData);
  }
}
