export default function Newsletter() {
  return (
    <section className="relative z-10 -mb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-black text-white rounded-2xl px-12 py-8 flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-black leading-tight">STAY UPTO DATE ABOUT</h3>
            <h3 className="text-4xl font-black leading-tight">OUR LATEST OFFERS</h3>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-80 px-12 py-3 rounded-full bg-white text-black placeholder-gray-400 focus:outline-none text-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <button className="w-80 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 text-sm">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>
    </section>
  );}