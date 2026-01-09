import { Controller, Post, Req, Headers } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';

@Controller('webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      return { error: 'Webhook signature verification failed' };
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.updateOrderPaymentStatus(paymentIntent.id, 'succeeded');
        break;
      case 'payment_intent.payment_failed':
        await this.updateOrderPaymentStatus(paymentIntent.id, 'failed');
        break;
      case 'payment_intent.canceled':
        await this.updateOrderPaymentStatus(paymentIntent.id, 'cancelled');
        break;
    }

    return { received: true };
  }

  private async updateOrderPaymentStatus(paymentIntentId: string, status: string) {
    try {
      const orders = await this.ordersService.findByStripePaymentIntent(paymentIntentId);
      for (const order of orders) {
        await this.ordersService.updatePaymentStatus(order._id, status, paymentIntentId);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }
}