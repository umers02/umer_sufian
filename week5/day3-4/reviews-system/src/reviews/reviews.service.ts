import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../schemas/review.schema';
import { Reply } from '../schemas/reply.schema';
import { Product } from '../schemas/product.schema';
import { CreateReviewDto, CreateReplyDto } from './dto/review.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Optional() private notificationsService: NotificationsService,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, userId: string) {
    try {
      console.log('Creating review:', { ...createReviewDto, userId });
      
      const review = new this.reviewModel({
        ...createReviewDto,
        userId,
      });
      
      const savedReview = await review.save();
      console.log('Review saved:', savedReview._id);
      
      await savedReview.populate('userId', 'name email');
      console.log('Review populated with user data');

      // Update product rating
      await this.updateProductRating(createReviewDto.productId);
      console.log('Product rating updated');

      // Send notifications
      try {
        if (this.notificationsService) {
          await this.notificationsService.notifyNewReview(savedReview);
          console.log('Notification sent');
        }
      } catch (notifError) {
        console.error('Notification error:', notifError);
      }
      
      if (createReviewDto.mentions?.length) {
        try {
          if (this.notificationsService) {
            await this.notificationsService.notifyMentions(
              createReviewDto.mentions,
              'review',
              savedReview._id.toString(),
              userId
            );
          }
        } catch (mentionError) {
          console.error('Mention notification error:', mentionError);
        }
      }

      return savedReview;
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  async createReply(createReplyDto: CreateReplyDto, userId: string) {
    try {
      console.log('Creating reply:', { ...createReplyDto, userId });
      
      const reply = new this.replyModel({
        ...createReplyDto,
        userId,
      });
      
      const savedReply = await reply.save();
      console.log('Reply saved:', savedReply._id);
      
      await savedReply.populate('userId', 'name email');
      console.log('Reply populated with user data');

      // Notify review owner
      try {
        const review = await this.reviewModel.findById(createReplyDto.reviewId).populate('userId', 'name email');
        if (review && review.userId._id.toString() !== userId && this.notificationsService) {
          await this.notificationsService.notifyNewReply(review, savedReply);
          console.log('Reply notification sent');
        }
      } catch (notifError) {
        console.error('Reply notification error:', notifError);
      }

      // Handle mentions in reply
      if (createReplyDto.mentions?.length && this.notificationsService) {
        try {
          await this.notificationsService.notifyMentions(
            createReplyDto.mentions,
            'reply',
            savedReply._id.toString(),
            userId
          );
        } catch (mentionError) {
          console.error('Reply mention notification error:', mentionError);
        }
      }

      return savedReply;
    } catch (error) {
      console.error('Error in createReply:', error);
      throw error;
    }
  }

  async getAllReplies() {
    try {
      const allReplies = await this.replyModel.find().populate('userId', 'name email');
      console.log('All replies in database:', allReplies.map(r => ({ id: r._id, reviewId: r.reviewId, content: r.content })));
      return allReplies;
    } catch (error) {
      console.error('Error fetching all replies:', error);
      throw error;
    }
  }

  async getReplies(reviewId: string) {
    try {
      console.log('Fetching replies for review:', reviewId);
      const replies = await this.replyModel.find({ reviewId: reviewId }).populate('userId', 'name email').sort({ createdAt: 1 });
      console.log(`Found ${replies.length} replies for review ${reviewId}`);
      console.log('Reply reviewIds:', replies.map(r => r.reviewId));
      return replies;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    try {
      console.log('Fetching reviews for product:', productId);
      
      const reviews = await this.reviewModel
        .find({ productId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.reviewModel.countDocuments({ productId });
      console.log(`Found ${reviews.length} reviews`);

      // Get replies for each review
      const reviewsWithReplies = await Promise.all(
        reviews.map(async (review) => {
          const replies = await this.replyModel
            .find({ reviewId: review._id.toString() })
            .populate('userId', 'name email')
            .sort({ createdAt: 1 });
          
          console.log(`Review ${review._id} searching for replies with reviewId: ${review._id.toString()}`);
          console.log(`Found ${replies.length} replies:`, replies.map(r => r._id));
          
          return {
            ...review.toObject(),
            replies,
          };
        })
      );

      return {
        reviews: reviewsWithReplies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async likeReview(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);
    
    if (review.likedBy.includes(userId as any)) {
      review.likedBy = review.likedBy.filter(id => id.toString() !== userId);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      review.likedBy.push(userId as any);
      review.likes += 1;
      
      // Notify review author
      if (review.userId.toString() !== userId && this.notificationsService) {
        await this.notificationsService.notifyReviewLiked(review, userId);
      }
    }
    
    return await review.save();
  }

  async likeReply(replyId: string, userId: string) {
    const reply = await this.replyModel.findById(replyId);
    
    if (reply.likedBy.includes(userId as any)) {
      reply.likedBy = reply.likedBy.filter(id => id.toString() !== userId);
      reply.likes = Math.max(0, reply.likes - 1);
    } else {
      reply.likedBy.push(userId as any);
      reply.likes += 1;
      
      // Notify reply author
      if (reply.userId.toString() !== userId && this.notificationsService) {
        await this.notificationsService.notifyReplyLiked(reply, userId);
      }
    }
    
    return await reply.save();
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.reviewModel.find({ productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.productModel.findByIdAndUpdate(productId, {
      'rating.average': averageRating,
      'rating.count': reviews.length,
    });
  }

  // Admin methods
  async deleteReview(reviewId: string, adminUserId: string) {
    try {
      const review = await this.reviewModel.findById(reviewId).populate('userId', 'name email');
      if (!review) {
        throw new Error('Review not found');
      }

      // Delete the review
      await this.reviewModel.findByIdAndDelete(reviewId);
      
      // Delete associated replies
      await this.replyModel.deleteMany({ reviewId });
      
      // Update product rating
      await this.updateProductRating(review.productId.toString());
      
      // Notify the review author
      if (this.notificationsService) {
        await this.notificationsService.notifyAdminAction(
          review.userId._id.toString(),
          'review_deleted',
          'Your review has been removed by an administrator'
        );
      }
      
      return { message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  async flagReview(reviewId: string, adminUserId: string) {
    try {
      const review = await this.reviewModel.findByIdAndUpdate(
        reviewId,
        { isFlagged: true },
        { new: true }
      ).populate('userId', 'name email');
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      // Notify the review author
      if (this.notificationsService) {
        await this.notificationsService.notifyAdminAction(
          review.userId._id.toString(),
          'review_flagged',
          'Your review has been flagged for review by an administrator'
        );
      }
      
      return review;
    } catch (error) {
      console.error('Error flagging review:', error);
      throw error;
    }
  }
}