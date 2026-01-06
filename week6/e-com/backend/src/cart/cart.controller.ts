import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@User() user: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(user.sub, addToCartDto);
  }

  @Get()
  getCart(@User() user: any) {
    return this.cartService.getCart(user.sub);
  }

  @Patch(':productId')
  updateQuantity(
    @User() user: any,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(user.sub, productId, quantity);
  }

  @Delete(':productId')
  removeFromCart(@User() user: any, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(user.sub, productId);
  }

  @Delete()
  clearCart(@User() user: any) {
    return this.cartService.clearCart(user.sub);
  }
}