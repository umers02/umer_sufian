import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, SalesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}