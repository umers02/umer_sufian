import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black leading-[0.9]">
                FIND CLOTHES<br />
                THAT MATCHES<br />
                YOUR STYLE
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Browse through our diverse range of meticulously crafted garments, designed
                to bring out your individuality and cater to your sense of style.
              </p>
            </div>
            
            <Link 
              href="/products" 
              className="inline-block bg-black text-white px-8 sm:px-12 lg:px-16 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">200+</div>
                <div className="text-gray-600 text-xs sm:text-sm">International Brands</div>
              </div>
              <div className="hidden sm:block w-px h-8 sm:h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">2,000+</div>
                <div className="text-gray-600 text-xs sm:text-sm">High-Quality Products</div>
              </div>
              <div className="hidden sm:block w-px h-8 sm:h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">30,000+</div>
                <div className="text-gray-600 text-xs sm:text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative order-first lg:order-last">
            <Image
              src="/hero-section.jpg"
              alt="Fashion Models"
              width={600}
              height={663}
              className="w-full h-[400px] sm:h-[500px] lg:h-[650px] object-cover object-top rounded-lg lg:rounded-none"
              priority
            />
            
            {/* Decorative Stars */}
            <div className="absolute top-12 sm:top-16 lg:top-24 right-4 sm:right-6 lg:right-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 lg:w-26 lg:h-26" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z" fill="black"/>
              </svg>
            </div>
            <div className="absolute top-1/2 left-3 sm:left-4 lg:left-6 transform -translate-y-1/2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 0C28.9506 15.0527 40.9472 27.0495 56 28C40.9472 28.9506 28.9506 40.9472 28 56C27.0495 40.9472 15.0527 28.9506 0 28C15.0527 27.0495 27.0495 15.0527 28 0Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}