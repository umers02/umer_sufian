import { Controller, Get, Post, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create/:auctionId')
  createPayment(@Request() req: any, @Param('auctionId') auctionId: string) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.paymentsService.createPayment(userId, auctionId);
  }

  @Get('my-payments')
  getMyPayments(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub || req.user?._id;
    return this.paymentsService.findByUserId(userId);
  }

  @Get(':paymentId')
  getPayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.findById(paymentId);
  }

  @Put(':paymentId/status')
  updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() body: { status: string }
  ) {
    return this.paymentsService.updateStatus(paymentId, body.status);
  }

  @Public()
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }
}
