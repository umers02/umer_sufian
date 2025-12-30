import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @Public()
  @Get('live')
  findLiveAuctions() {
    return this.auctionsService.findLiveAuctions();
  }

  @Public()
  @Get('upcoming')
  findUpcomingAuctions() {
    return this.auctionsService.findUpcomingAuctions();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Public()
  @Post('test-notifications/:id')
  async testNotifications(@Param('id') id: string) {
    // Manually trigger notifications for testing
    const auction = await this.auctionsService.findOne(id);
    if (!auction) {
      return { error: 'Auction not found' };
    }

    // Force update status to ended and emit notifications
    await this.auctionsService.updateAuctionStatus();
    
    return { message: 'Notifications triggered', auctionId: id };
  }
}
