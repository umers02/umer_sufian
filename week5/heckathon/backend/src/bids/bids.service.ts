import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { Car, CarDocument } from '../cars/schemas/car.schema';
import { Auction, AuctionDocument } from '../auctions/schemas/auction.schema';
import { BiddingGateway } from '../bidding/bidding.gateway';
import { AuctionsService } from '../auctions/auctions.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private biddingGateway: BiddingGateway,
    private auctionsService: AuctionsService,
  ) {}

  async create(bid: Partial<Bid>) {
    console.log('🔥 BidsService: Creating bid:', bid);
    
    // Update auction statuses first
    await this.auctionsService.updateAuctionStatus();
    
    if (!bid.auctionId || !bid.bidderId || !bid.amount) {
      throw new BadRequestException('Auction ID, Bidder ID, and Amount are required');
    }

    // Debug: Check if we're getting car ID instead of auction ID
    console.log('🔍 Looking for auction with ID:', bid.auctionId);
    
    // Debug: List all auctions to see what's available
    const allAuctions = await this.auctionModel.find().select('_id car').exec();
    console.log('📊 Available auctions:', allAuctions);
    
    // First try to find auction by ID
    let auction = await this.auctionModel.findById(bid.auctionId).populate('car');
    
    // If not found, maybe it's a car ID - try to find auction by car ID
    if (!auction) {
      console.log('❌ Auction not found by ID, trying to find by car ID...');
      
      // Try both ObjectId and string comparison
      auction = await this.auctionModel.findOne({ 
        $or: [
          { car: bid.auctionId },
          { car: bid.auctionId.toString() }
        ]
      }).populate('car');
      
      // Also try direct string comparison
      if (!auction && bid.auctionId) {
        const allAuctions = await this.auctionModel.find().populate('car');
        const foundAuction = allAuctions.find(a => 
          a.car && (a.car._id.toString() === bid.auctionId!.toString())
        );
        auction = foundAuction || null;
      }
      
      if (auction) {
        console.log('✅ Found auction by car ID. Auction ID:', auction._id, 'Car ID:', bid.auctionId);
        // Update the bid with correct auction ID
        bid.auctionId = auction._id as any;
      } else {
        console.log('❌ No auction found for car ID:', bid.auctionId);
      }
    }
    
    if (!auction) {
      console.log('❌ No auction found for ID:', bid.auctionId);
      throw new BadRequestException('Auction not found');
    }

    console.log('✅ Found auction:', auction._id, 'for car:', auction.car);

    const car = await this.carModel.findById(auction.car);
    if (!car) {
      throw new BadRequestException('Car not found');
    }

    // Validation 1: User can't bid on own cars
    if (car.sellerId.toString() === bid.bidderId.toString()) {
      throw new ForbiddenException('You cannot bid on your own car');
    }

    // Validation 2: Auction timing validation
    const now = new Date();
    if (auction.startTime > now) {
      throw new BadRequestException('Auction has not started yet');
    }
    if (auction.endTime < now) {
      throw new BadRequestException('Auction has already ended');
    }
    if (auction.status === 'ended' || auction.status === 'completed') {
      throw new BadRequestException('Auction is no longer active');
    }

    // Validation 3: Minimum bid increment
    const currentPrice = auction.currentPrice || car.startingPrice || 0;
    const minimumIncrement = Math.max(100, currentPrice * 0.05); // 5% or minimum 100
    const minimumBid = currentPrice + minimumIncrement;

    if (bid.amount < minimumBid) {
      throw new BadRequestException(
        `Bid must be at least $${minimumBid.toFixed(2)} (minimum increment: $${minimumIncrement.toFixed(2)})`
      );
    }

    // Validation 4: Check if user already has a higher bid
    const existingBid = await this.bidModel
      .findOne({ auctionId: bid.auctionId, bidderId: bid.bidderId })
      .sort({ amount: -1 });
    
    if (existingBid && existingBid.amount >= bid.amount) {
      throw new BadRequestException(
        `You already have a higher bid of $${existingBid.amount}. New bid must be higher.`
      );
    }
    
    const newBid = new this.bidModel(bid);
    const savedBid = await newBid.save();
    
    console.log('✅ BidsService: Bid saved:', savedBid);
    
    // Update auction's current price
    await this.auctionModel.findByIdAndUpdate(
      bid.auctionId,
      { 
        currentPrice: bid.amount,
        winningBid: savedBid._id
      },
      { new: true }
    );
    
    // Update the car's currentPrice and add bid to bids array
    const updatedCar = await this.carModel.findByIdAndUpdate(
      auction.car,
      {
        $set: { currentPrice: bid.amount },
        $push: { bids: savedBid._id }
      },
      { new: true }
    );
    
    console.log('🚗 BidsService: Car updated:', updatedCar);
    
    // Get total bid count for this auction
    const totalBids = await this.bidModel.countDocuments({ auctionId: bid.auctionId });
    
    // Emit real-time bid update
    const auctionIdStr = bid.auctionId?.toString() || (auction._id as any).toString();
    const socketData = {
      amount: bid.amount,
      bidderId: bid.bidderId,
      auctionId: auctionIdStr,
      totalBids: totalBids,
      timestamp: new Date(),
      minimumNextBid: bid.amount + Math.max(100, bid.amount * 0.05)
    };
    
    console.log('📡 BidsService: Emitting socket event:', socketData);
    this.biddingGateway.emitNewBid(auctionIdStr, socketData);
    
    // Check if auction ended and emit winner notification
    if (auction.endTime < new Date()) {
      this.biddingGateway.emitBidWinner(auctionIdStr, {
        winnerId: bid.bidderId,
        winnerName: 'Winner', // Could populate from user data
        winningAmount: bid.amount,
        carTitle: car.title
      });
    }
    
    return savedBid;
  }

  findAll() {
    return this.bidModel
      .find()
      .populate('auctionId')
      .populate('bidderId')
      .exec();
  }

  findByAuction(auctionId: string) {
    return this.bidModel
      .find({ auctionId })
      .populate('bidderId', 'username fullName')
      .sort({ amount: -1 })
      .limit(10)
      .exec();
  }

  findByUserId(userId: string) {
    return this.bidModel
      .find({ bidderId: userId })
      .populate('auctionId')
      .sort({ placedAt: -1 })
      .exec();
  }

  async getMinimumBid(auctionId: string): Promise<number> {
    const auction = await this.auctionModel.findById(auctionId).populate('car');
    if (!auction) {
      throw new BadRequestException('Auction not found');
    }

    const car = await this.carModel.findById(auction.car);
    const currentPrice = auction.currentPrice || car?.startingPrice || 0;
    const minimumIncrement = Math.max(100, currentPrice * 0.05);
    
    return currentPrice + minimumIncrement;
  }
}
