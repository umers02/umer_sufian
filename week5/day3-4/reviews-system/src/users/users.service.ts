import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async searchUsers(query: string) {
    if (!query || query.length < 1) {
      return [];
    }

    const users = await this.userModel
      .find({
        name: { $regex: query, $options: 'i' },
        isBlocked: { $ne: true }
      })
      .select('_id name email')
      .limit(10);

    return users;
  }
}