import api from './api'

export const subscriptionAPI = {
  // Get subscription plans
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans')
    return response.data
  },

  // Start free trial
  startFreeTrial: async () => {
    const response = await api.post('/subscriptions/free-trial')
    return response.data
  },

  // Subscribe to plan
  subscribeToPlan: async (planType: string, cardDetails: any) => {
    const response = await api.post('/subscriptions/subscribe', {
      planType,
      cardDetails
    })
    return response.data
  },

  // Get user subscription
  getUserSubscription: async () => {
    const response = await api.get('/subscriptions/my-subscription')
    return response.data
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel')
    return response.data
  }
}