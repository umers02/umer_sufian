import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './entities/order.entity';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { StripeService } from '../common/services/stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    UsersModule,
    ProductsModule,
    LoyaltyModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, StripeService],
  exports: [OrdersService],
})
export class OrdersModule {}