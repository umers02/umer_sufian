import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[0.9]">
                FIND CLOTHES<br />
                THAT MATCHES<br />
                YOUR STYLE
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                Browse through our diverse range of meticulously crafted garments, designed
                to bring out your individuality and cater to your sense of style.
              </p>
            </div>
            
            <Link 
              href="/products" 
              className="inline-block bg-black text-white px-16 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
            
            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div>
                <div className="text-4xl font-bold text-black">200+</div>
                <div className="text-gray-600 text-sm">International Brands</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-4xl font-bold text-black">2,000+</div>
                <div className="text-gray-600 text-sm">High-Quality Products</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-4xl font-bold text-black">30,000+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <Image
              src="/hero-section.jpg"
              alt="Fashion Models"
              width={600}
              height={663}
              className="w-full h-[650px] object-cover object-top"
              priority
            />
            
            {/* Decorative Stars */}
            <div className="absolute top-24 right-8">
              <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black"/>
              </svg>
            </div>
            <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 0C28.9506 15.0527 40.9472 27.0495 56 28C40.9472 28.9506 28.9506 40.9472 28 56C27.0495 40.9472 15.0527 28.9506 0 28C15.0527 27.0495 27.0495 15.0527 28 0Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}