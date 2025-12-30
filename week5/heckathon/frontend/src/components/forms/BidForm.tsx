'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bidSchema } from '@/lib/validationSchemas';
import { usePlaceBid } from '@/hooks/useBids';

interface BidFormData {
  amount: number;
}

interface BidFormProps {
  auctionId: string;
  currentHighestBid: number;
  minimumBid: number;
  onBidPlaced?: () => void;
}

export function BidForm({ auctionId, currentHighestBid, minimumBid, onBidPlaced }: BidFormProps) {
  const placeBidMutation = usePlaceBid();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<BidFormData>({
    resolver: yupResolver(bidSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: BidFormData) => {
    try {
      // Additional frontend validation
      if (data.amount <= currentHighestBid) {
        setError('amount', {
          type: 'manual',
          message: `Bid must be higher than current highest bid of $${currentHighestBid}`,
        });
        return;
      }

      if (data.amount < minimumBid) {
        setError('amount', {
          type: 'manual',
          message: `Minimum bid is $${minimumBid}`,
        });
        return;
      }

      await placeBidMutation.mutateAsync({
        auctionId,
        amount: data.amount,
      });

      reset();
      onBidPlaced?.();
    } catch (error: any) {
      // Error is already handled by the mutation with toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {placeBidMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {placeBidMutation.error.response?.data?.message || placeBidMutation.error.message || 'Failed to place bid'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Bid Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min={minimumBid}
            className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
            placeholder={`Minimum: $${minimumBid}`}
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Current highest bid: ${currentHighestBid}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || placeBidMutation.isPending}
        className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white"
      >
        {isSubmitting || placeBidMutation.isPending ? 'Placing Bid...' : 'Place Bid'}
      </Button>
    </form>
  );
}