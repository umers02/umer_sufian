import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Auction, AuctionDocument } from '../auctions/schemas/auction.schema';
import { Bid, BidDocument } from '../bids/schemas/bid.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
  ) {}

  async createPayment(userId: string, auctionId: string) {
    // Check if auction exists and is ended
    const auction = await this.auctionModel.findById(auctionId).populate('car');
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    console.log('🔍 Auction status check:', {
      auctionId,
      status: auction.status,
      endTime: auction.endTime,
      now: new Date(),
      isEnded: auction.endTime < new Date()
    });

    // Allow payment if auction is ended, completed, or past end time
    const now = new Date();
    const isAuctionEnded = auction.status === 'ended' || 
                          auction.status === 'completed' || 
                          auction.endTime < now;
    
    if (!isAuctionEnded) {
      throw new BadRequestException(`Auction is still active. Status: ${auction.status}, End time: ${auction.endTime}`);
    }

    // Find winning bid
    const winningBid = await this.bidModel
      .findOne({ auctionId })
      .sort({ amount: -1 })
      .populate('bidderId')
      .exec();

    if (!winningBid || (winningBid.bidderId as any)._id.toString() !== userId) {
      throw new BadRequestException('You are not the winner of this auction');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentModel.findOne({ auctionId, buyerId: userId });
    if (existingPayment) {
      return existingPayment;
    }

    // Create payment
    const payment = new this.paymentModel({
      auctionId,
      buyerId: userId,
      amountPaid: winningBid.amount,
      status: 'pending',
      paymentDate: new Date(),
      lotNumber: `LOT-${auctionId.slice(-6)}`,
      deliveryUpdates: [
        {
          status: 'pending',
          updatedAt: new Date(),
        }
      ]
    });

    const savedPayment = await payment.save();

    // Start delivery simulation
    this.simulateDeliveryProgress(savedPayment._id as string);

    return savedPayment;
  }

  async findByUserId(userId: string) {
    return this.paymentModel
      .find({ buyerId: userId })
      .populate({
        path: 'auctionId',
        populate: {
          path: 'car',
          model: 'Car'
        }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(paymentId: string) {
    return this.paymentModel
      .findById(paymentId)
      .populate({
        path: 'auctionId',
        populate: {
          path: 'car',
          model: 'Car'
        }
      })
      .populate('buyerId')
      .exec();
  }

  async updateStatus(paymentId: string, status: string) {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = status as any;
    payment.deliveryUpdates.push({
      status: status,
      updatedAt: new Date(),
    } as any);

    return payment.save();
  }

  private async simulateDeliveryProgress(paymentId: string) {
    const statuses = [
      { status: 'ready_for_shipping', delay: 60000 }, // 1 minute
      { status: 'in_transit', delay: 120000 }, // 2 minutes
      { status: 'delivered', delay: 180000 }, // 3 minutes
    ];

    for (const { status, delay } of statuses) {
      setTimeout(async () => {
        await this.updateStatus(paymentId, status);
        
        if (status === 'delivered') {
          // Mark auction as completed
          const payment = await this.paymentModel.findById(paymentId);
          if (payment) {
            await this.auctionModel.findByIdAndUpdate(
              payment.auctionId,
              { status: 'completed' }
            );
          }
        }
      }, delay);
    }
  }

  create(payment: Partial<Payment>) {
    const newPayment = new this.paymentModel(payment);
    return newPayment.save();
  }

  findAll() {
    return this.paymentModel
      .find()
      .populate('auctionId')
      .populate('buyerId')
      .exec();
  }
}
