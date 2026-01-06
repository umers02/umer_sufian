import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { SalesService } from '../sales/sales.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private salesService: SalesService,
  ) {}

  async getDashboardStats() {
    const [usersData, products, orders, sales] = await Promise.all([
      this.usersService.findAllWithPagination(1, ''),
      this.productsService.findAll(),
      this.ordersService.findAll(),
      this.salesService.findAll(),
    ]);

    const users = usersData.users;

    // Sort orders by date (newest first) and get recent 10
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt).getTime();
      return dateB - dateA;
    });

    // Calculate total revenue from all orders
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Calculate order stats
    const activeOrders = orders.filter(order => 
      ['pending', 'confirmed', 'shipped'].includes(order.status?.toLowerCase())
    ).length;
    const completedOrders = orders.filter(order => 
      order.status?.toLowerCase() === 'delivered'
    ).length;
    const cancelledOrders = orders.filter(order => 
      order.status?.toLowerCase() === 'cancelled'
    ).length;

    return {
      totalUsers: usersData.totalUsers,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      activeOrders,
      completedOrders,
      cancelledOrders,
      activeSales: sales.filter(sale => sale.isActive).length,
      recentOrders: sortedOrders.slice(0, 10),
    };
  }
}