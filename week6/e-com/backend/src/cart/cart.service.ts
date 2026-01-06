import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';
import { ProductType } from '../common/enums/product-type.enum';
import { ProductDocument } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const product = await this.productsService.findOne(addToCartDto.productId) as ProductDocument;
    
    if (product.stock < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    if (addToCartDto.usePoints && product.type === ProductType.REGULAR) {
      throw new BadRequestException('This product cannot be purchased with points');
    }

    let cart = await this.cartModel.findOne({ user: userId }).exec();
    
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === addToCartDto.productId
    );

    const price = addToCartDto.usePoints 
      ? (product.pointsPrice || 0)
      : (product.isOnSale ? product.salePrice : product.price);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += addToCartDto.quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity: addToCartDto.quantity,
        price,
        usePoints: addToCartDto.usePoints || false,
      });
    }

    this.calculateTotals(cart);
    return cart.save();
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();
    
    if (!cart) {
      return new this.cartModel({ user: userId, items: [] });
    }
    
    return cart;
  }

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    this.calculateTotals(cart);
    return cart.save();
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    this.calculateTotals(cart);
    return cart.save();
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0, totalPoints: 0 }
    ).exec();
  }

  private calculateTotals(cart: Cart): void {
    cart.totalAmount = 0;
    cart.totalPoints = 0;

    cart.items.forEach(item => {
      if (item.usePoints) {
        cart.totalPoints += item.price * item.quantity;
      } else {
        cart.totalAmount += item.price * item.quantity;
      }
    });
  }
}