'use client'

import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Vote, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Minus, 
  Clock,
  Wallet,
  BarChart3
} from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Vote,
      title: 'Digital Voting System',
      description: 'Participate in governance decisions through a secure web-based voting platform'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'See live vote counts and proposal updates using Socket.IO real-time communication'
    },
    {
      icon: Shield,
      title: 'Secure & Authenticated',
      description: 'JWT-based authentication with role-based access control and MongoDB data persistence'
    },
    {
      icon: Users,
      title: 'Community Participation',
      description: 'Simple one-person-one-vote system for fair and democratic decision making'
    }
  ]

  const votingSteps = [
    {
      step: 1,
      title: 'User Authentication',
      description: 'Sign up or login to access the governance platform features',
      icon: Wallet
    },
    {
      step: 2,
      title: 'Browse Proposals',
      description: 'Review active governance proposals stored in MongoDB database',
      icon: BarChart3
    },
    {
      step: 3,
      title: 'Cast Your Vote',
      description: 'Vote Yes, No, or Abstain - each user gets one vote per proposal',
      icon: Vote
    },
    {
      step: 4,
      title: 'Real-time Results',
      description: 'See live vote counts update instantly via Socket.IO connections',
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Governance Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern governance platform prototype built with Next.js, TypeScript, and MongoDB 
            for transparent, real-time decision-making and community participation.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How Governance Works</CardTitle>
            <CardDescription>
              Follow these simple steps to participate in decentralized governance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {votingSteps.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.step} className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">{step.step}</Badge>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Voting Options */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Voting Options</CardTitle>
              <CardDescription>Understand your voting choices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Vote Yes</h4>
                  <p className="text-sm text-muted-foreground">
                    Support the proposal and want it to be implemented
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Vote No</h4>
                  <p className="text-sm text-muted-foreground">
                    Oppose the proposal and don't want it implemented
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Minus className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Abstain</h4>
                  <p className="text-sm text-muted-foreground">
                    Participate in quorum but remain neutral on the outcome
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Lifecycle</CardTitle>
              <CardDescription>How proposals progress through the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">Draft</Badge>
                  <span className="text-sm">Proposal is being prepared</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="default">Active</Badge>
                  <span className="text-sm">Voting is open to all participants</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Passed</Badge>
                  <span className="text-sm">Proposal approved, awaiting execution</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="destructive">Failed</Badge>
                  <span className="text-sm">Proposal did not meet requirements</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">Executed</Badge>
                  <span className="text-sm">Changes have been implemented</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-2">How does voting work?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                This platform uses a simple one-person-one-vote system. Each authenticated user 
                can cast one vote per proposal, ensuring fair and equal participation.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-2">How long do proposals stay active?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Each proposal has a specific end date set by the proposer. 
                Voting closes automatically when this deadline is reached.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-2">What happens after a proposal passes?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Passed proposals can be managed by administrators who have the ability to 
                execute, close, or cancel proposals based on the voting results and requirements.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-base font-medium mb-2">What technology stack is used?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Built with Next.js 14, TypeScript, MongoDB, Socket.IO for real-time updates, 
                RTK Query for API management, and shadcn/ui components for modern UI design.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Ready to Participate?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
              Connect and start participating in governance today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-3">
              <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
                View Proposals
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}