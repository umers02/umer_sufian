'use client'

import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/home" 
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/login" className="text-red-400 hover:text-red-300">
              Login with different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}