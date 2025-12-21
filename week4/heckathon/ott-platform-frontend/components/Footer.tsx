import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-16 px-4" style={{backgroundColor: '#141414'}}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Home</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Devices</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Movies</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Gernes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Release</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Popular</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shows</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Gernes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Release</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Popular</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Subscription</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Plans</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            @2023 streamvibe, All Rights Reserved
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Use</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}