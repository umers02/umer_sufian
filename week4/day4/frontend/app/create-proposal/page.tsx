'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Calendar, Clock } from 'lucide-react'
import { useAppSelector } from '@/lib/hooks'
import { useCreateProposalMutation } from '@/lib/api/proposalApi'

export default function CreateProposal() {
  const { isConnected, user } = useAppSelector((state) => state.auth)
  const [createProposal, { isLoading }] = useCreateProposalMutation()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'governance',
    executionDelay: 48,
    endDate: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createProposal({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        endDate: formData.endDate,
        executionDelay: formData.executionDelay,
        proposer: user?.walletAddress || '',
        requiredQuorum: formData.category === 'emergency' ? 2000 : 1000
      }).unwrap()
      
      // Reset form and redirect
      setFormData({
        title: '',
        description: '',
        category: 'governance',
        executionDelay: 48,
        endDate: ''
      })
      
      alert('Proposal created successfully!')
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to create proposal:', error)
      alert('Failed to create proposal. Please try again.')
    }
  }

  const categories = [
    { value: 'governance', label: 'Governance', color: 'bg-blue-100 text-blue-800' },
    { value: 'treasury', label: 'Treasury', color: 'bg-green-100 text-green-800' },
    { value: 'technical', label: 'Technical', color: 'bg-purple-100 text-purple-800' },
    { value: 'community', label: 'Community', color: 'bg-orange-100 text-orange-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Connect Wallet Required</CardTitle>
              <CardDescription>You need to connect your wallet to create proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Go Back Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>Only administrators can create new proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/'} className="w-full">
                Go Back Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 space-y-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Proposal</span>
              </CardTitle>
              <CardDescription>
                Submit a new governance proposal for community voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter proposal title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.value})}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          formData.category === cat.value 
                            ? cat.color + ' ring-2 ring-primary' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary h-32"
                    placeholder="Describe your proposal in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Execution Delay (hours)
                    </label>
                    <input
                      type="number"
                      value={formData.executionDelay}
                      onChange={(e) => setFormData({...formData, executionDelay: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                      min="1"
                      max="168"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Preview</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={categories.find(c => c.value === formData.category)?.color}>
                        {categories.find(c => c.value === formData.category)?.label}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{formData.title || 'Proposal Title'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Proposal description will appear here...'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Proposal'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}