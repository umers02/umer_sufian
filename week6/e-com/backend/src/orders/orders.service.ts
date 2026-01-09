import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { NotificationsService } from '../notifications/notifications.service';
import { StripeService } from '../common/services/stripe.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PointsUtil } from '../common/utils/points.util';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private loyaltyService: LoyaltyService,
    private notificationsService: NotificationsService,
    private stripeService: StripeService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersService.findOne(userId);

    if (!createOrderDto.items.length) {
      throw new BadRequestException('No items in order');
    }

    // Check if points are being used and validate
    if (createOrderDto.pointsUsed && createOrderDto.pointsUsed > 0) {
      if (user.loyaltyPoints < createOrderDto.pointsUsed) {
        throw new BadRequestException('Insufficient loyalty points');
      }
    }

    // Check if order contains loyalty-only products and hybrid products
    let hasLoyaltyOnlyProducts = false;
    let hasHybridProducts = false;
    let totalPointsRequired = 0;
    let hybridProductsTotal = 0;
    let regularProductsTotal = 0;
    
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.product);
      if (product.type === 'loyalty_only') {
        hasLoyaltyOnlyProducts = true;
        totalPointsRequired += (product.pointsPrice || 0) * item.quantity;
      } else if (product.type === 'hybrid') {
        hasHybridProducts = true;
        hybridProductsTotal += item.price * item.quantity;
      } else if (product.type === 'regular') {
        regularProductsTotal += item.price * item.quantity;
      }
    }

    // For loyalty-only orders, validate points and set correct values
    if (hasLoyaltyOnlyProducts) {
      if (user.loyaltyPoints < totalPointsRequired) {
        throw new BadRequestException(`Insufficient points. Required: ${totalPointsRequired}, Available: ${user.loyaltyPoints}`);
      }
      createOrderDto.pointsUsed = totalPointsRequired;
    }

    // Update product stock
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.product, item.quantity);
    }

    // Calculate points earned based on payment method and product types
    let pointsEarned = 0;
    
    if (hasLoyaltyOnlyProducts && createOrderDto.paymentMethod === 'points') {
      // Loyalty-only products paid with points: no points earned
      pointsEarned = 0;
    } else if (hasHybridProducts && createOrderDto.paymentMethod === 'hybrid_points') {
      // Hybrid products paid with points: no points earned
      pointsEarned = 0;
    } else {
      // Regular products or hybrid products paid with cash: earn points
      const cashAmount = hasHybridProducts && createOrderDto.paymentMethod !== 'hybrid_points' 
        ? hybridProductsTotal + regularProductsTotal 
        : regularProductsTotal;
      pointsEarned = PointsUtil.calculatePointsEarned(cashAmount);
    }

    const order = new this.orderModel({
      user: userId,
      items: createOrderDto.items,
      totalAmount: createOrderDto.total,
      pointsUsed: createOrderDto.pointsUsed || 0,
      pointsEarned,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      stripePaymentIntentId: createOrderDto.stripePaymentIntentId,
      paymentStatus: createOrderDto.paymentMethod === 'points' || createOrderDto.paymentMethod === 'hybrid_points' ? 'succeeded' : 'pending',
      status: OrderStatus.CONFIRMED,
    });

    const savedOrder = await order.save();

    // Deduct points if used
    if (createOrderDto.pointsUsed && createOrderDto.pointsUsed > 0) {
      await this.usersService.updateLoyaltyPoints(userId, -createOrderDto.pointsUsed);
      await this.loyaltyService.recordPointsSpent(userId, createOrderDto.pointsUsed, savedOrder._id.toString());
    }

    // Add points earned (only for successful payments)
    if (pointsEarned > 0 && (createOrderDto.paymentMethod === 'points' || createOrderDto.paymentMethod === 'hybrid_points' || createOrderDto.stripePaymentIntentId)) {
      await this.usersService.updateLoyaltyPoints(userId, pointsEarned);
      await this.loyaltyService.recordPointsEarned(userId, pointsEarned, savedOrder._id.toString());
    }

    // Send notification
    await this.notificationsService.sendOrderConfirmation(userId, savedOrder._id.toString());

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('user items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user items.product')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updatePaymentStatus(id: string, paymentStatus: string, stripePaymentIntentId?: string): Promise<Order> {
    const updateData: any = { paymentStatus };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user items.product')
      .exec();
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    // Award points only when payment succeeds
    if (paymentStatus === 'succeeded' && order.pointsEarned > 0) {
      const userId = typeof order.user === 'string' ? order.user : order.user._id.toString();
      const hasPointsAlready = await this.loyaltyService.checkIfPointsAwarded(userId, id);
      if (!hasPointsAlready) {
        await this.usersService.updateLoyaltyPoints(userId, order.pointsEarned);
        await this.loyaltyService.recordPointsEarned(userId, order.pointsEarned, id);
      }
    }
    
    return order;
  }

  async createPaymentIntent(userId: string, amount: number): Promise<any> {
    const paymentIntent = await this.stripeService.createPaymentIntent(amount);
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async findByStripePaymentIntent(paymentIntentId: string): Promise<Order[]> {
    return this.orderModel
      .find({ stripePaymentIntentId: paymentIntentId })
      .populate('user items.product')
      .exec();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('user items.product')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}