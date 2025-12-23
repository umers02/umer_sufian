// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function Home() {
//   const router = useRouter()

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem('token')
//     if (token) {
//       router.push('/home')
//     } else {
//       router.push('/login')
//     }
//   }, [])

//   return (
//     <div className="min-h-screen ott-bg flex items-center justify-center">
//       <div className="text-white text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//         <p>Loading StreamVibe...</p>
//       </div>
//     </div>
//   )
// }



'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      router.replace('/home')   // ✅ correct user home
    } else {
      router.replace('/login')  // ✅ correct auth login
    }
  }, [router])

  return (
    <div className="min-h-screen ott-bg flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p>Loading StreamVibe...</p>
      </div>
    </div>
  )
}
