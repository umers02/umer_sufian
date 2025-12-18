'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Plus, Settings, Users, BarChart3 } from 'lucide-react'
import { useAppSelector } from '@/lib/hooks'

export default function AdminPanel() {
  const { user } = useAppSelector((state) => state.auth)

  if (!user?.isAdmin) {
    return null
  }

  const adminActions = [
    {
      title: 'Create Proposal',
      description: 'Submit new governance proposals',
      icon: Plus,
      href: '/create-proposal',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user permissions',
      icon: Users,
      href: '#',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'System Settings',
      description: 'Configure governance parameters',
      icon: Settings,
      href: '#',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Advanced Analytics',
      description: 'Detailed governance insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-orange-100 text-orange-800'
    }
  ]

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <Shield className="h-5 w-5" />
          <span>Admin Panel</span>
          <Badge variant="destructive" className="text-xs">ADMIN ONLY</Badge>
        </CardTitle>
        <CardDescription>
          Administrative tools and governance management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {adminActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => action.href !== '#' && (window.location.href = action.href)}
                disabled={action.href === '#'}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}