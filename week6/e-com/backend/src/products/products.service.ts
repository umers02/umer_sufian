import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(query?: any): Promise<Product[]> {
    const filter = { isActive: true };
    
    if (query?.category) {
      filter['category'] = query.category;
    }
    
    if (query?.isOnSale) {
      filter['isOnSale'] = query.isOnSale === 'true';
    }

    return this.productModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stock -= quantity;
    return product.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async search(searchTerm: string): Promise<Product[]> {
    return this.productModel.find({
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    }).exec();
  }

  async getTopSellingProducts(limit: number = 8): Promise<any[]> {
    try {
      console.log('Fetching top selling products...');
      
      // Try the aggregation approach first
      let topSellingProducts = await this.productModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            let: { productId: { $toString: '$_id' } },
            pipeline: [
              {
                $unwind: '$items'
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$items.product', '$$productId']
                  }
                }
              },
              {
                $group: {
                  _id: '$items.product',
                  totalQuantity: { $sum: '$items.quantity' },
                  totalOrders: { $sum: 1 }
                }
              }
            ],
            as: 'orderData'
          }
        },
        {
          $addFields: {
            totalSold: {
              $ifNull: [
                { $arrayElemAt: ['$orderData.totalQuantity', 0] },
                0
              ]
            },
            orderCount: {
              $ifNull: [
                { $arrayElemAt: ['$orderData.totalOrders', 0] },
                0
              ]
            }
          }
        },
        {
          $match: {
            isActive: true,
            totalSold: { $gt: 0 }
          }
        },
        {
          $sort: { totalSold: -1, orderCount: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            orderData: 0
          }
        }
      ]);

      console.log('Top selling products found:', topSellingProducts.length);
      
      // If no results from aggregation, try alternative approach
      if (topSellingProducts.length === 0) {
        console.log('No results from aggregation, trying alternative approach...');
        
        // Import Order model dynamically
        const { Order } = await import('../orders/entities/order.entity');
        const orderModel = this.orderModel || (await import('@nestjs/mongoose')).getModelToken(Order.name);
        
        // Get all orders and manually count
        const orders = await this.orderModel.db.collection('orders').find({}).toArray();
        console.log('Total orders found:', orders.length);
        
        if (orders.length > 0) {
          // Count products manually
          const productCounts = new Map<string, number>();
          
          orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                const productId = item.product.toString();
                const quantity = item.quantity || 1;
                productCounts.set(productId, (productCounts.get(productId) || 0) + quantity);
              });
            }
          });
          
          // Get top products
          const sortedProducts = Array.from(productCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
          
          console.log('Manual count results:', sortedProducts.length);
          
          // Fetch product details
          const productIds = sortedProducts.map(([id]) => id);
          topSellingProducts = await this.productModel.find({
            _id: { $in: productIds },
            isActive: true
          }).exec();
          
          // Sort by the manual count order
          topSellingProducts.sort((a, b) => {
            const aCount = productCounts.get(a._id.toString()) || 0;
            const bCount = productCounts.get(b._id.toString()) || 0;
            return bCount - aCount;
          });
        }
      }
      
      return topSellingProducts;
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return [];
    }
  }
}