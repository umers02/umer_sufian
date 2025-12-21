'use client'

import { useState, useEffect } from 'react'
import { subscriptionService } from '@/services/subscription.service'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
}

interface SubscriptionStatus {
  isActive: boolean
  plan: SubscriptionPlan | null
  expiresAt: string | null
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [status, setStatus] = useState<SubscriptionStatus>({
    isActive: false,
    plan: null,
    expiresAt: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlans()
    fetchStatus()
  }, [])

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getPlans()
      setPlans(data)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    }
  }

  const fetchStatus = async () => {
    try {
      const data = await subscriptionService.getSubscriptionStatus()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  const subscribe = async (planId: string) => {
    setLoading(true)
    try {
      await subscriptionService.subscribe(planId)
      await fetchStatus()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancel = async () => {
    setLoading(true)
    try {
      await subscriptionService.cancelSubscription()
      await fetchStatus()
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    plans,
    status,
    loading,
    subscribe,
    cancel,
    refetch: fetchStatus
  }
}