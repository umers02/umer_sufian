export default function FreeTrialCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl" style={{backgroundColor: '#0F0F0F', border: '1px solid #262626'}}>
          <div className="absolute inset-0">
            <img 
              src="./img/hero-img.jpg" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" style={{background: 'linear-gradient(to right, black 0%, black 40%, transparent 70%), rgba(229, 9, 20, 0.1)'}}></div>
          </div>
          
          <div className="relative p-16 flex items-center justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 text-white">Start your free trial today!</h2>
              <p className="text-gray-400 text-lg">
                This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-semibold rounded-lg text-white transition-colors ml-8 flex-shrink-0">
              Start a Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}