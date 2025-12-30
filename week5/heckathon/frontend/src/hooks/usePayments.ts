import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/services/payments';
import { toast } from 'sonner';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment initiated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create payment';
      toast.error(message);
    },
  });
};

export const useMyPayments = () => {
  return useQuery({
    queryKey: ['payments', 'my-payments'],
    queryFn: paymentsApi.getMyPayments,
    onError: (error: any) => {
      toast.error('Failed to load payments');
    },
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentsApi.getPayment(paymentId),
    enabled: !!paymentId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    onError: (error: any) => {
      toast.error('Failed to load payment details');
    },
  });
};