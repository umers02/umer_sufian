import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BiddingGateway } from '../bidding/bidding.gateway';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuctionsService {
  private logger = new Logger('AuctionsService');

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    this.logger.log(`🕰️ Cron job running - checking auction statuses at: ${now.toISOString()}`);

    // Fetch all auctions with car & highestBidder populated
    const allAuctions = await this.auctionModel
      .find()
      .populate('car')
      .populate('highestBidder')
      .exec();

this.logger.log(`📊 All auctions in DB: ${allAuctions.map(a => ({
  id: (a._id as Types.ObjectId).toString(),
  status: a.status,
  startTime: a.startTime,
  endTime: a.endTime,
  isStarted: a.startTime <= now,
  isEnded: a.endTime < now
}))}`);


    // Start upcoming auctions
    const startingAuctions = allAuctions.filter(a => a.status === 'upcoming' && a.startTime <= now && a.endTime >= now);
    for (const auction of startingAuctions) {
      await this.auctionModel.updateOne({ _id: auction._id }, { status: 'live' });
      this.logger.log(`🚀 Starting auction ${auction._id}`);

      await this.biddingGateway.emitAuctionStarted((auction._id as Types.ObjectId).toString(), {
        carTitle: (auction.car as any)?.title || 'Unknown Car',
        startingPrice: auction.currentPrice || 0,
        endTime: auction.endTime
      });
    }

    // End live/upcoming auctions
    const endingAuctions = allAuctions.filter(a => ['live', 'upcoming'].includes(a.status) && a.endTime < now);
    for (const auction of endingAuctions) {
      await this.auctionModel.updateOne({ _id: auction._id }, { status: 'ended' });
      this.logger.log(`🏁 Ending auction ${auction._id}`);

      await this.biddingGateway.emitAuctionEnded((auction._id as Types.ObjectId).toString(), {
        carTitle: (auction.car as any)?.title || 'Unknown Car',
        finalPrice: auction.currentPrice || 0,
        totalBids: auction.bids?.length || 0
      });

      // Emit winner notification only if highestBidder exists
      if (auction.currentPrice && auction.currentPrice > 0 && auction.highestBidder) {
        // winnerId is real MongoDB ObjectId string
        const winnerUserId = (auction.highestBidder as any)._id?.toString() || (auction.highestBidder as Types.ObjectId).toString();
        const winnerName = (auction.highestBidder as any).name || 'Winner';

        if (!winnerUserId) {
          this.logger.warn(`⚠️ No valid highest bidder for auction ${auction._id}`);
          continue;
        }

        this.logger.log(`🏆 Emitting winner notification for auction ${auction._id}`);
        await this.biddingGateway.emitBidWinner(
          (auction._id as Types.ObjectId).toString(),
          {
            winnerId: winnerUserId,
            winnerName: winnerName,
            winningAmount: auction.currentPrice,
            carTitle: (auction.car as any)?.title || 'Unknown Car'
          }
        );
      }
    }
  }

  updateCurrentPrice(auctionId: string, newPrice: number, bidderId?: string) {
    const update: any = { currentPrice: newPrice };
    if (bidderId && Types.ObjectId.isValid(bidderId)) {
      update.highestBidder = new Types.ObjectId(bidderId);
    }
    return this.auctionModel.findByIdAndUpdate(auctionId, update, { new: true }).exec();
  }
}
