import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('my-wishlist')
  getMyWishlist(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.wishlistService.findByUserId(userId);
  }

  @Post('add/:auctionId')
  addToWishlist(@Request() req: any, @Param('auctionId') auctionId: string) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.wishlistService.addToWishlist(userId, auctionId);
  }

  @Delete('remove/:auctionId')
  removeFromWishlist(@Request() req: any, @Param('auctionId') auctionId: string) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.wishlistService.removeFromWishlist(userId, auctionId);
  }

  @Get('check/:auctionId')
  checkWishlist(@Request() req: any, @Param('auctionId') auctionId: string) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.wishlistService.isInWishlist(userId, auctionId);
  }
}
