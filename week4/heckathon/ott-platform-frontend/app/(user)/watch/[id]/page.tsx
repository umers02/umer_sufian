import Navbar from '@/components/Navbar'

export default function WatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Watch Movie</h1>
          <p className="text-gray-300">Movie ID: {params.id}</p>
          <p className="text-gray-300 mt-4">Video player coming soon...</p>
        </div>
      </div>
    </div>
  )
}