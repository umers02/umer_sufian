import { api } from '@/lib/api';
import { Payment } from '@/types/api';

export const paymentsApi = {
  createPayment: async (auctionId: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/create/${auctionId}`);
    return response.data;
  },

  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments/my-payments');
    return response.data;
  },

  getPayment: async (paymentId: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${paymentId}`);
    return response.data;
  },

  updatePaymentStatus: async (paymentId: string, status: string): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${paymentId}/status`, { status });
    return response.data;
  },
};