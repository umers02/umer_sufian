'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { orderService } from '../../services/orderService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, onSuccess, onError, onCancel }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment intent
      const { clientSecret, paymentIntentId } = await orderService.createPaymentIntent(amount);

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntentId);
      }
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay PKR ${amount.toFixed(2)}`}
      </button>
      
      <button
        type="button"
        onClick={onCancel}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
      >
        Cancel
      </button>
    </form>
  );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}