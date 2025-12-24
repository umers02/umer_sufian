import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class FollowersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async followUser(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new Error('Cannot follow yourself');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { following: targetUserId }
    });

    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: userId }
    });

    return { message: 'User followed successfully' };
  }

  async unfollowUser(userId: string, targetUserId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { following: targetUserId }
    });

    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: userId }
    });

    return { message: 'User unfollowed successfully' };
  }

  async getFollowers(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('followers', 'username profilePicture bio');
    
    return user?.followers || [];
  }

  async getFollowing(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('following', 'username profilePicture bio');
    
    return user?.following || [];
  }

  async isFollowing(userId: string, targetUserId: string) {
    const user = await this.userModel.findById(userId);
    return user?.following.includes(targetUserId as any) || false;
  }
}