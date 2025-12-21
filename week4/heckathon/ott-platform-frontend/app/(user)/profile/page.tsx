import Navbar from '@/components/Navbar'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          <p className="text-gray-300">Profile page content coming soon...</p>
        </div>
      </div>
    </div>
  )
}