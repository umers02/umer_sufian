import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BiddingGateway } from '../bidding/bidding.gateway';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private biddingGateway: BiddingGateway,
  ) {}

  create(createAuctionDto: CreateAuctionDto) {
    const newAuction = new this.auctionModel(createAuctionDto);
    return newAuction.save();
  }

  async findAll() {
    await this.updateAuctionStatus();
    return this.auctionModel.find().populate('car').exec();
  }

  async findOne(id: string) {
    await this.updateAuctionStatus();
    return this.auctionModel.findById(id).populate('car').exec();
  }

  async findLiveAuctions() {
    await this.updateAuctionStatus();
    const now = new Date();
    return this.auctionModel
      .find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: { $in: ['upcoming', 'live'] }
      })
      .populate('car')
      .exec();
  }

  async findUpcomingAuctions() {
    await this.updateAuctionStatus();
    const now = new Date();
    return this.auctionModel
      .find({
        startTime: { $gt: now },
        status: 'upcoming'
      })
      .populate('car')
      .exec();
  }

  @Cron('*/10 * * * * *') // Every 10 seconds for testing
  async updateAuctionStatusFrequent() {
    await this.updateAuctionStatus();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAuctionStatus() {
    const now = new Date();
    console.log('🕰️ Cron job running - checking auction statuses at:', now.toISOString());
    
    // Debug: Check all auctions
    const allAuctions = await this.auctionModel.find().exec();
    console.log('📊 All auctions in DB:', allAuctions.map(a => ({
      id: a._id,
      status: a.status,
      startTime: a.startTime,
      endTime: a.endTime,
      isStarted: a.startTime <= now,
      isEnded: a.endTime < now
    })));
    
    // Find auctions that should start
    const startingAuctions = await this.auctionModel
      .find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: 'upcoming'
      })
      .populate('car')
      .exec();
    
    console.log(`🚀 Found ${startingAuctions.length} auctions to start`);
    
    // Update upcoming to live and emit notifications
    for (const auction of startingAuctions) {
      await this.auctionModel.updateOne(
        { _id: auction._id },
        { status: 'live' }
      );
      
      console.log(`🚀 Starting auction ${auction._id}`);
      
      // Emit auction started notification
      this.biddingGateway.emitAuctionStarted((auction._id as any).toString(), {
        carTitle: (auction.car as any)?.title || 'Unknown Car',
        startingPrice: auction.currentPrice || 0,
        endTime: auction.endTime
      });
    }
    
    // Find auctions that should end
    const endingAuctions = await this.auctionModel
      .find({
        endTime: { $lt: now },
        status: { $in: ['live', 'upcoming'] }
      })
      .populate('car')
      .exec();
    
    console.log(`🏁 Found ${endingAuctions.length} auctions to end`);
    
    // Update live to ended and emit notifications
    for (const auction of endingAuctions) {
      await this.auctionModel.updateOne(
        { _id: auction._id },
        { status: 'ended' }
      );
      
      console.log(`🏁 Ending auction ${auction._id}`);
      
      // Emit auction ended notification
      this.biddingGateway.emitAuctionEnded((auction._id as any).toString(), {
        carTitle: (auction.car as any)?.title || 'Unknown Car',
        finalPrice: auction.currentPrice || 0,
        totalBids: 0
      });
      
      // If there are bids, emit winner notification
      if (auction.currentPrice && auction.currentPrice > 0) {
        console.log(`🏆 Emitting winner notification for auction ${auction._id}`);
        this.biddingGateway.emitBidWinner((auction._id as any).toString(), {
          winnerId: 'winner-id',
          winnerName: 'Winner',
          winningAmount: auction.currentPrice,
          carTitle: (auction.car as any)?.title || 'Unknown Car'
        });
      }
    }
  }

  updateCurrentPrice(auctionId: string, newPrice: number) {
    return this.auctionModel.findByIdAndUpdate(
      auctionId,
      { currentPrice: newPrice },
      { new: true }
    ).exec();
  }
}
