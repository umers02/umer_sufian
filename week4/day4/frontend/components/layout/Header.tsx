'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, Users, Activity, Menu, X } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setCredentials, logout } from '@/lib/slices/authSlice'
import { useConnectWalletMutation } from '@/lib/api/authApi'

export default function Header() {
  const { user, isConnected } = useAppSelector((state) => state.auth)
  const { activeUsers } = useAppSelector((state) => state.socket)
  const dispatch = useAppDispatch()
  const [connectWallet] = useConnectWalletMutation()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnectWallet = async (isAdmin = false) => {
    try {
      // Choose wallet based on user preference
      const mockWalletAddress = isAdmin 
        ? '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416' // Admin wallet
        : '0x1234567890123456789012345678901234567890' // Regular user wallet
      const mockSignature = '0x1234567890abcdef'
      
      const result = await connectWallet({
        walletAddress: mockWalletAddress,
        signature: mockSignature,
      }).unwrap()
      
      // Backend returns { success: true, data: { token, user } }
      dispatch(setCredentials({
        token: result.data.token,
        user: result.data.user
      }))
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnect = () => {
    dispatch(logout())
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">Governance Hub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Proposals
            </a>
            <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
              Analytics
            </a>
            {mounted && user?.isAdmin && (
              <a href="/create-proposal" className="text-sm font-medium hover:text-primary transition-colors">
                Create
              </a>
            )}
            <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>

          {/* Active Users Badge - Hidden on mobile */}
          <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span className="hidden md:inline">{activeUsers} Active</span>
            <span className="md:hidden">{activeUsers}</span>
          </Badge>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {mounted && isConnected && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-xs lg:text-sm">
                      {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                    </span>
                    {user.isAdmin && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">ADMIN</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs hidden lg:block">
                    {user.votingPower} VP • {user.role}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button onClick={() => handleConnectWallet(false)} variant="outline" size="sm">
                  <Wallet className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">User</span>
                </Button>
                <Button onClick={() => handleConnectWallet(true)} size="sm">
                  <Wallet className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Proposals
              </a>
              <a
                href="/dashboard"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="/analytics"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </a>
              {mounted && user?.isAdmin && (
                <a
                  href="/create-proposal"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Proposal
                </a>
              )}
              <a
                href="/about"
                className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-3 mt-3">
                {mounted && isConnected && user ? (
                  <div className="px-3 space-y-2">
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </span>
                        {user.isAdmin && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">ADMIN</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {user.votingPower} VP • {user.role}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDisconnect} className="w-full">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 space-y-2">
                    <Button onClick={() => handleConnectWallet(false)} variant="outline" size="sm" className="w-full">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect as User
                    </Button>
                    <Button onClick={() => handleConnectWallet(true)} size="sm" className="w-full">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect as Admin
                    </Button>
                  </div>
                )}
                
                {/* Mobile Active Users */}
                <div className="px-3 pt-2">
                  <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                    <Users className="h-3 w-3" />
                    <span>{activeUsers} Active Users</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}