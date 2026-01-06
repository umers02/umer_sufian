import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './entities/sale.entity';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createSaleDto: any): Promise<Sale> {
    const sale = new this.saleModel(createSaleDto);
    const savedSale = await sale.save();

    // Apply sale to products
    await this.applySaleToProducts(savedSale);

    // Send notifications to all users
    await this.notificationsService.sendSaleNotification(savedSale);

    return savedSale;
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel.find().populate('products').exec();
  }

  async findActive(): Promise<Sale[]> {
    const now = new Date();
    return this.saleModel.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate('products').exec();
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).populate('products').exec();
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }
    return sale;
  }

  async update(id: string, updateSaleDto: any): Promise<Sale> {
    const sale = await this.saleModel
      .findByIdAndUpdate(id, updateSaleDto, { new: true })
      .populate('products')
      .exec();
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    await this.applySaleToProducts(sale);
    return sale;
  }

  async remove(id: string): Promise<void> {
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Remove sale from products
    await this.removeSaleFromProducts(sale);

    await this.saleModel.findByIdAndDelete(id).exec();
  }

  private async applySaleToProducts(sale: Sale): Promise<void> {
    for (const productId of sale.products) {
      const product = await this.productsService.findOne(productId.toString());
      const salePrice = product.price * (1 - sale.discountPercentage / 100);
      
      await this.productsService.update(productId.toString(), {
        salePrice,
        isOnSale: true,
      });
    }
  }

  private async removeSaleFromProducts(sale: Sale): Promise<void> {
    for (const productId of sale.products) {
      await this.productsService.update(productId.toString(), {
        salePrice: 0,
        isOnSale: false,
      });
    }
  }
}