import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async create(@Body() createBidDto: CreateBidDto, @Request() req: any) {
    const bidData = {
      ...createBidDto,
      bidderId: req.user?.userId || req.user?.sub || req.user?._id,
    };
    
    return this.bidsService.create(bidData);
  }

  @Public()
  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Public()
  @Get('auction/:auctionId')
  findByAuction(@Param('auctionId') auctionId: string) {
    return this.bidsService.findByAuction(auctionId);
  }
}
