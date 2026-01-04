import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  // ✅ Get wishlist for a user with auction + car details populated
  async findByUserId(userId: string) {
    console.log('🔍 Finding wishlist for userId:', userId);
    
    const wishlist = await this.wishlistModel
      .findOne({ userId })
      .populate({
        path: 'auctionIds',
        model: 'Auction',
        populate: {
          path: 'car',
          model: 'Car',
          select: 'title photos startingPrice currentPrice'
        }
      })
      .exec();

    console.log('📋 Raw wishlist data:', JSON.stringify(wishlist, null, 2));
    const result = (wishlist as any)?.auctionIds || [];
    console.log('🎯 Returning wishlist items:', result.length);
    
    return result;
  }

  // ✅ Add auction to wishlist
  async addToWishlist(userId: string, auctionId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId });

    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId, auctionIds: [auctionId] });
    } else {
      const wishlistData = wishlist as any;
      if (!wishlistData.auctionIds.some((id: any) => id.toString() === auctionId)) {
        wishlistData.auctionIds.push(auctionId);
      }
    }

    return wishlist.save();
  }

  // ✅ Remove auction from wishlist
  async removeFromWishlist(userId: string, auctionId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId });

    if (wishlist) {
      const wishlistData = wishlist as any;
      wishlistData.auctionIds = wishlistData.auctionIds.filter(
        (id: any) => id.toString() !== auctionId
      );
      return wishlist.save();
    }

    return null;
  }

  // ✅ Check if an auction is in user's wishlist
  async isInWishlist(userId: string, auctionId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId });

    return {
      isInWishlist: wishlist
        ? (wishlist as any).auctionIds.some((id: any) => id.toString() === auctionId)
        : false,
    };
  }

  // ✅ Create a wishlist (optional)
  create(wishlist: Partial<Wishlist>) {
    const newWishlist = new this.wishlistModel(wishlist);
    return newWishlist.save();
  }

  // ✅ Get all wishlists (admin / debug purpose)
  findAll() {
    return this.wishlistModel
      .find()
      .populate({
        path: 'auctionIds',
        model: 'Auction',
        populate: {
          path: 'car',
          model: 'Car',
          select: 'title photos startingPrice currentPrice'
        }
      })
      .populate('userId')
      .exec();
  }
}
