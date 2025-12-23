// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { auth } from '@/lib/auth'

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   requiredRole?: string
//   redirectTo?: string
// }

// export default function ProtectedRoute({ 
//   children, 
//   requiredRole, 
//   redirectTo = '/login' 
// }: ProtectedRouteProps) {
//   const [isLoading, setIsLoading] = useState(true)
//   const [isAuthorized, setIsAuthorized] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const checkAuth = () => {
//       const isAuthenticated = auth.isAuthenticated()
//       const user = auth.getUser()
      
//       console.log('ProtectedRoute Debug:', {
//         isAuthenticated,
//         user,
//         requiredRole,
//         hasRole: requiredRole ? auth.hasRole(requiredRole) : 'N/A'
//       })
      
//       if (!isAuthenticated) {
//         console.log('Not authenticated, redirecting to:', redirectTo)
//         router.push(redirectTo)
//         return
//       }

//       if (requiredRole && !auth.hasRole(requiredRole)) {
//         console.log('Role mismatch. Required:', requiredRole, 'User role:', user?.role)
//         router.push('/unauthorized')
//         return
//       }

//       setIsAuthorized(true)
//       setIsLoading(false)
//     }

//     checkAuth()
//   }, [requiredRole, redirectTo, router])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!isAuthorized) {
//     return null
//   }

//   return <>{children}</>
// }





'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login', // ✅ correct
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated()
    const user = auth.getUser()

    if (!isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    if (requiredRole && !auth.hasRole(requiredRole)) {
      router.replace('/unauthorized')
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthorized) return null

  return <>{children}</>
}
