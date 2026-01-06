import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoyaltyHistory, LoyaltyHistoryDocument } from './entities/loyalty-history.entity';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectModel(LoyaltyHistory.name) private loyaltyHistoryModel: Model<LoyaltyHistoryDocument>,
  ) {}

  async recordPointsEarned(userId: string, points: number, orderId?: string): Promise<LoyaltyHistory> {
    const history = new this.loyaltyHistoryModel({
      user: userId,
      points,
      type: 'earned',
      description: `Earned ${points} points from purchase`,
      order: orderId,
    });
    return history.save();
  }

  async recordPointsSpent(userId: string, points: number, orderId?: string): Promise<LoyaltyHistory> {
    const history = new this.loyaltyHistoryModel({
      user: userId,
      points,
      type: 'spent',
      description: `Spent ${points} points on purchase`,
      order: orderId,
    });
    return history.save();
  }

  async getUserLoyaltyHistory(userId: string): Promise<LoyaltyHistory[]> {
    return this.loyaltyHistoryModel
      .find({ user: userId })
      .populate('order')
      .sort({ createdAt: -1 })
      .exec();
  }
}