'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, CreditCard, Calendar, User } from 'lucide-react'
import { auth } from '@/lib/auth'
import { subscriptionAPI } from '@/lib/subscription'
import Navbar from '@/components/Navbar'

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [userSubscription, setUserSubscription] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [showCardForm, setShowCardForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })
  const router = useRouter()

  // Check if user should be redirected based on role
  useEffect(() => {
    const user = auth.getUser()
    const role = user?.role?.toLowerCase()
    if (user && (role === 'admin' || role === 'superadmin')) {
      router.push(auth.getRoleBasedRedirect())
    }
  }, [router])

  useEffect(() => {
    loadPlans()
    loadUserSubscription()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await subscriptionAPI.getPlans()
      setPlans(data.plans)
    } catch (error) {
      console.error('Error loading plans:', error)
    }
  }

  const loadUserSubscription = async () => {
    try {
      const data = await subscriptionAPI.getUserSubscription()
      setUserSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const handleFreeTrial = async () => {
    setLoading(true)
    try {
      await subscriptionAPI.startFreeTrial()
      alert('Free trial activated successfully!')
      loadUserSubscription()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error starting free trial')
    }
    setLoading(false)
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setShowCardForm(true)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await subscriptionAPI.subscribeToPlan(selectedPlan, cardDetails)
      alert('Subscription activated successfully!')
      setShowCardForm(false)
      loadUserSubscription()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error subscribing to plan')
    }
    setLoading(false)
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await subscriptionAPI.cancelSubscription()
        alert('Subscription cancelled successfully!')
        loadUserSubscription()
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error cancelling subscription')
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Select the perfect subscription plan for your streaming needs
          </p>
        </div>
      </section>

      {/* Current Subscription */}
      {userSubscription?.hasActiveSubscription && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-green-400 mb-2">Active Subscription</h3>
              <p className="text-gray-300 mb-4">
                Plan: {userSubscription.subscription.planType.toUpperCase()} 
                {userSubscription.subscription.isFreeTrial && ' (Free Trial)'}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Expires: {new Date(userSubscription.subscription.endDate).toLocaleDateString()}
              </p>
              <button
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Free Trial */}
      {!userSubscription?.hasActiveSubscription && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-8 text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Start Your Free Trial</h3>
              <p className="text-gray-300 mb-6">
                Get 30 days of unlimited access to all content, completely free!
              </p>
              <button
                onClick={handleFreeTrial}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Activating...' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Subscription Plans */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-gray-900 p-8 rounded-lg border ${plan.popular ? 'border-red-600' : 'border-gray-800'}`}>
                {plan.popular && (
                  <div className="bg-red-600 text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-6">
                  ${plan.price}<span className="text-lg text-gray-400">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Details Modal */}
      {showCardForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Payment Details</h3>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.cardHolderName}
                  onChange={(e) => setCardDetails({...cardDetails, cardHolderName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <select
                    value={cardDetails.expiryMonth}
                    onChange={(e) => setCardDetails({...cardDetails, expiryMonth: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={String(i+1).padStart(2, '0')}>
                        {String(i+1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select
                    value={cardDetails.expiryYear}
                    onChange={(e) => setCardDetails({...cardDetails, expiryYear: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">YY</option>
                    {Array.from({length: 10}, (_, i) => (
                      <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                        {String(new Date().getFullYear() + i).slice(-2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    maxLength={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCardForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}