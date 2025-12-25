import { Controller, Post, Get, Put, Body, Param, Query, UseGuards, Request, ValidationPipe, UsePipes } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, CreateReplyDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createReview(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    try {
      return this.reviewsService.createReview(createReviewDto, req.user.id);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  @Post('reply')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createReply(@Body() createReplyDto: CreateReplyDto, @Request() req) {
    try {
      console.log('Reply endpoint hit with data:', createReplyDto);
      console.log('User ID:', req.user.id);
      const result = await this.reviewsService.createReply(createReplyDto, req.user.id);
      console.log('Reply created successfully:', result._id);
      return result;
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  }

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getProductReviews(productId, page, limit);
  }

  @Get('debug/replies')
  async debugReplies() {
    try {
      const allReplies = await this.reviewsService.getAllReplies();
      return allReplies;
    } catch (error) {
      console.error('Error fetching all replies:', error);
      throw error;
    }
  }

  @Get('replies/:reviewId')
  async getReplies(@Param('reviewId') reviewId: string) {
    try {
      const replies = await this.reviewsService.getReplies(reviewId);
      return replies;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }

  @Put(':reviewId/like')
  @UseGuards(JwtAuthGuard)
  async likeReview(@Param('reviewId') reviewId: string, @Request() req) {
    return this.reviewsService.likeReview(reviewId, req.user.id);
  }

  @Put('reply/:replyId/like')
  @UseGuards(JwtAuthGuard)
  async likeReply(@Param('replyId') replyId: string, @Request() req) {
    return this.reviewsService.likeReply(replyId, req.user.id);
  }
}