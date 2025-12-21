import api from './api'

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans')
    return response.data
  },

  subscribe: async (planId: string) => {
    const response = await api.post('/subscriptions/subscribe', { planId })
    return response.data
  },

  getSubscriptionStatus: async () => {
    const response = await api.get('/subscriptions/status')
    return response.data
  },

  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel')
    return response.data
  }
}