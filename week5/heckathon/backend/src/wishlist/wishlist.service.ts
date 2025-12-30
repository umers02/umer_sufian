import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async findByUserId(userId: string) {
    const wishlist = await this.wishlistModel
      .findOne({ userId })
      .populate({
        path: 'auctionIds',
        populate: {
          path: 'car',
          model: 'Car'
        }
      })
      .exec();
    
    return (wishlist as any)?.auctionIds || [];
  }

  async addToWishlist(userId: string, auctionId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId, auctionIds: [auctionId] });
    } else {
      const wishlistData = wishlist as any;
      if (!wishlistData.auctionIds.includes(auctionId)) {
        wishlistData.auctionIds.push(auctionId);
      }
    }
    
    return wishlist.save();
  }

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

  async isInWishlist(userId: string, auctionId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId });
    
    return {
      isInWishlist: wishlist ? (wishlist as any).auctionIds.some((id: any) => id.toString() === auctionId) : false
    };
  }

  create(wishlist: Partial<Wishlist>) {
    const newWishlist = new this.wishlistModel(wishlist);
    return newWishlist.save();
  }

  findAll() {
    return this.wishlistModel
      .find()
      .populate('userId')
      .populate('auctionIds')
      .exec();
  }
}
