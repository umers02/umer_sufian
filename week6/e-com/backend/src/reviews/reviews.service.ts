import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { Product, ProductDocument } from '../products/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const review = new this.reviewModel({
      ...createReviewDto,
      productId: new Types.ObjectId(createReviewDto.productId),
      userId: new Types.ObjectId(userId),
    });

    const savedReview = await review.save();
    
    // Update product rating
    await this.updateProductRating(createReviewDto.productId);
    
    return savedReview;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ 
        productId: new Types.ObjectId(productId), 
        isActive: true 
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find({ isActive: true })
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProductRating(productId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.reviewModel.find({
      productId: new Types.ObjectId(productId),
      isActive: true,
    });

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    return { averageRating, totalReviews: reviews.length };
  }

  private async updateProductRating(productId: string): Promise<void> {
    const { averageRating, totalReviews } = await this.getProductRating(productId);
    
    await this.productModel.findByIdAndUpdate(
      productId,
      { averageRating, totalReviews },
      { new: true }
    );
  }
}